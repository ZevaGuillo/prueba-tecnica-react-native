import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { ApiError } from '@/data/ApiError';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/presentation/hooks/products/useProductMutations';
import { useProductQuery } from '@/presentation/hooks/products/useProductQuery';
import { useVerifyProductIdQuery } from '@/presentation/hooks/products/useVerifyProductIdQuery';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
  buildProductFormSchema,
  emptyProductFormValues,
  type ProductFormValues,
} from '@/shared/schemas/productFormSchema';
import { mapBadRequestBodyToFieldErrors } from '@/shared/utils/mapApiFieldErrors';
import { getUserFacingErrorMessage } from '@/shared/utils/userFacingMessage';
import { computeRevisionDateFromRelease, validateProductId } from '@/shared/utils/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useFormState, type FieldErrors as RHFFieldErrors } from 'react-hook-form';

export type ProductFormMode = 'create' | 'edit';

export type FieldErrors = Partial<Record<keyof FinancialProduct | 'general', string>>;

export type EditLoadStatus = 'idle' | 'loading' | 'ready' | 'notFound' | 'error';

/** Entidad de dominio → valores que entiende el formulario (fechas en AAAA-MM-DD). */
function productToFormValues(p: FinancialProduct): ProductFormValues {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    logo: p.logo,
    date_release: p.date_release.slice(0, 10),
  };
}

const NOT_FOUND_EDIT =
  'No se encontró el producto. Puede que haya sido eliminado o el enlace sea incorrecto.';

type FormErrorsShape = RHFFieldErrors<ProductFormValues & { date_revision?: { message?: string } }>;

/** Une errores de RHF (incl. `date_revision` solo de validación Zod) al mapa que consume la UI. */
function rhfErrorsToFieldErrors(errors: FormErrorsShape): FieldErrors {
  return {
    id: errors.id?.message,
    name: errors.name?.message,
    description: errors.description?.message,
    logo: errors.logo?.message,
    date_release: errors.date_release?.message,
    date_revision: errors.date_revision?.message as string | undefined,
  };
}

/**
 * Orquesta el formulario de producto: estado con react-hook-form + Zod, datos remotos con TanStack Query,
 * y reglas de negocio que no van en el esquema (p. ej. ID ya usado en servidor).
 */
export function useProductFormScreen(mode: ProductFormMode, editProductId?: string) {
  // Banner de error global (API / red) y refs para hidratar edición una sola vez y soportar «Reiniciar».
  const [generalError, setGeneralError] = useState<string | null>(null);
  const initialSnapshot = useRef<ProductFormValues | null>(null);
  const editHydrated = useRef(false);

  const schema = useMemo(() => buildProductFormSchema(), []);

  // Valores del form, validación al enviar, y todos los errores de campo visibles a la vez (criteriaMode).
  const form = useForm<ProductFormValues>({
    defaultValues: emptyProductFormValues(),
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    criteriaMode: 'all',
  });

  const { control, watch, setValue, setError, clearErrors, reset, getValues, trigger } = form;

  // Suscripción explícita a errores: sin esto, `setError` desde efectos puede no repintar la UI (Proxy de formState).
  const { errors } = useFormState({ control });

  const fields = watch();
  const idValue = fields.id;
  const dateReleaseValue = fields.date_release;

  // ID con debounce para no spamear la API; validación síncrona del formato antes de llamar a verificación.
  const debouncedId = useDebounce(idValue, 400);
  const syncIdErr = validateProductId(debouncedId);

  // Edición: carga el producto. Alta: comprueba si el ID libre (solo si el formato es válido y hay texto).
  const editQuery = useProductQuery(mode === 'edit' ? editProductId : undefined);
  const verifyQuery = useVerifyProductIdQuery(
    debouncedId,
    mode === 'create' && !syncIdErr && debouncedId.trim().length > 0,
  );

  const createMut = useCreateProductMutation();
  const updateMut = useUpdateProductMutation();

  // Derivada solo para mostrar; el Zod ya valida coherencia liberación ↔ revisión al enviar.
  const dateRevisionComputed = useMemo(
    () => computeRevisionDateFromRelease(dateReleaseValue) ?? '',
    [dateReleaseValue],
  );

  /** `true` = el ID ya existe en servidor (solo con respuesta 200 exitosa y cuerpo booleano). */
  const idRemotelyTaken = verifyQuery.isSuccess && verifyQuery.data === true;
  const idCheckPending = verifyQuery.isFetching;

  /**
   * Mensaje bajo el campo ID sin pasar por `setError`: `setField` hace `clearErrors('id')` en cada
   * pulsación y borraba el error remoto antes de repintar. Aquí el texto es estado derivado (sync + query).
   */
  const idFieldHint = useMemo(() => {
    if (mode !== 'create') return null;
    if (syncIdErr) return syncIdErr;
    if (!debouncedId.trim()) return null;
    if (verifyQuery.isError) {
      return 'No se pudo comprobar si el identificador está disponible.';
    }
    if (idRemotelyTaken) return 'Este identificador ya está en uso.';
    return null;
  }, [mode, syncIdErr, debouncedId, verifyQuery.isError, idRemotelyTaken]);

  // Al cambiar de producto o modo, se debe volver a hidratar desde red si entramos en edición.
  useEffect(() => {
    editHydrated.current = false;
  }, [editProductId, mode]);

  // Primera carga exitosa en edición: rellena el form, guarda snapshot para reinicio y limpia errores.
  useEffect(() => {
    if (mode !== 'edit' || !editQuery.isSuccess || !editQuery.data) return;
    if (editHydrated.current) return;
    const f = productToFormValues(editQuery.data);
    reset(f);
    initialSnapshot.current = { ...f };
    clearErrors();
    setGeneralError(null);
    editHydrated.current = true;
  }, [mode, editQuery.isSuccess, editQuery.data, reset, clearErrors]);

  // Pantalla de edición: estado de la query (cargando / 404 / error) para mostrar skeleton o mensajes.
  let editLoadStatus: EditLoadStatus = mode === 'edit' ? 'loading' : 'ready';
  let editLoadError: string | null = null;

  if (mode === 'edit') {
    if (!editProductId?.trim()) {
      editLoadStatus = 'error';
      editLoadError = 'Falta el identificador del producto.';
    } else if (editQuery.isLoading) {
      editLoadStatus = 'loading';
    } else if (editQuery.isError) {
      editLoadStatus = 'error';
      editLoadError = getUserFacingErrorMessage(editQuery.error) || 'No se pudo cargar el producto.';
    } else if (editQuery.isSuccess && editQuery.data === null) {
      editLoadStatus = 'notFound';
    } else if (editQuery.isSuccess && editQuery.data) {
      editLoadStatus = 'ready';
    }
  }

  // Cambio de campo: en edición el ID es de solo lectura; al editar se limpian error de ese campo y el banner.
  const setField = useCallback(
    (key: keyof ProductFormValues, value: string) => {
      if (mode === 'edit' && key === 'id') {
        return;
      }
      setValue(key, value, { shouldDirty: true, shouldTouch: true });
      clearErrors(key);
      setGeneralError(null);
    },
    [mode, setValue, clearErrors],
  );

  // Reinicio: en edición vuelve al snapshot del servidor; en alta vacía el formulario.
  const resetForm = useCallback(() => {
    if (mode === 'edit' && initialSnapshot.current) {
      reset({ ...initialSnapshot.current });
    } else {
      reset(emptyProductFormValues());
    }
    clearErrors();
    setGeneralError(null);
  }, [mode, reset, clearErrors]);

  const submitting = createMut.isPending || updateMut.isPending;

  // Errores por input: Zod/API en RHF; el ID añade `idFieldHint` (no se pierde con clearErrors al teclear).
  const fieldErrors = useMemo((): FieldErrors => {
    const base = rhfErrorsToFieldErrors(errors as FormErrorsShape);
    return {
      ...base,
      id: idFieldHint ?? base.id,
    };
  }, [errors, idFieldHint]);

  // Envío: espera verificación de ID si aplica; `trigger()` ejecuta Zod; luego duplicado de ID y mutación; 400 → campos.
  const submit = useCallback(async (): Promise<boolean> => {
    setGeneralError(null);
    if (mode === 'create' && idCheckPending) {
      setGeneralError('Espera a que termine la verificación del identificador.');
      return false;
    }

    const valid = await trigger();
    if (!valid) {
      return false;
    }

    if (mode === 'create' && idRemotelyTaken) {
      return false;
    }

    const fields = getValues();
    const dateRevision = computeRevisionDateFromRelease(fields.date_release.trim());
    if (!dateRevision) {
      setError('date_release', { message: 'Revisa la fecha de liberación.' });
      return false;
    }

    const product: FinancialProduct = {
      id: fields.id.trim(),
      name: fields.name.trim(),
      description: fields.description.trim(),
      logo: fields.logo.trim(),
      date_release: fields.date_release.trim().slice(0, 10),
      date_revision: dateRevision,
    };

    try {
      if (mode === 'create') {
        await createMut.mutateAsync(product);
      } else {
        await updateMut.mutateAsync({
          id: product.id,
          patch: {
            name: product.name,
            description: product.description,
            logo: product.logo,
            date_release: product.date_release,
            date_revision: product.date_revision,
          },
        });
      }
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        const mapped = mapBadRequestBodyToFieldErrors(err.body);
        for (const [k, msg] of Object.entries(mapped)) {
          if (msg && k !== 'general') {
            setError(k as never, { message: msg });
          }
        }
        if (Object.keys(mapped).length === 0) {
          setGeneralError(getUserFacingErrorMessage(err));
        }
      } else if (err instanceof ApiError && err.status === 404) {
        setGeneralError(NOT_FOUND_EDIT);
      } else {
        setGeneralError(getUserFacingErrorMessage(err) || 'No se pudo guardar el producto.');
      }
      return false;
    }
  }, [
    mode,
    idCheckPending,
    idRemotelyTaken,
    trigger,
    getValues,
    setError,
    createMut,
    updateMut,
  ]);

  // Fuerza nueva hidratación tras refetch (p. ej. reintento tras error de red).
  const reloadEdit = useCallback(() => {
    editHydrated.current = false;
    void editQuery.refetch();
  }, [editQuery]);

  return {
    mode,
    fields,
    fieldErrors,
    generalError,
    submitting,
    idCheckPending,
    setField,
    reset: resetForm,
    submit,
    dateRevisionComputed,
    editLoadStatus,
    editLoadError,
    reloadEdit,
    idEditable: mode === 'create',
  };
}
