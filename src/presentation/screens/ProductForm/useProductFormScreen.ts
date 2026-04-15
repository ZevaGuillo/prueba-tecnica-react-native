import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { ApiError } from '@/data/ApiError';
import { getUserFacingErrorMessage } from '@/shared/utils/userFacingMessage';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/presentation/hooks/products/useProductMutations';
import { useProductQuery } from '@/presentation/hooks/products/useProductQuery';
import { useVerifyProductIdQuery } from '@/presentation/hooks/products/useVerifyProductIdQuery';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { mapBadRequestBodyToFieldErrors } from '@/shared/utils/mapApiFieldErrors';
import {
  computeRevisionDateFromRelease,
  validateDateRelease,
  validateDateRevision,
  validateDescription,
  validateLogo,
  validateName,
  validateProductId,
} from '@/shared/utils/validators';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type ProductFormMode = 'create' | 'edit';

export type FieldErrors = Partial<Record<keyof FinancialProduct | 'general', string>>;

export type EditLoadStatus = 'idle' | 'loading' | 'ready' | 'notFound' | 'error';

type FormFields = Pick<FinancialProduct, 'id' | 'name' | 'description' | 'logo' | 'date_release'>;

const emptyFields = (): FormFields => ({
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
});

function productToFormFields(p: FinancialProduct): FormFields {
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

/**
 * Estado del formulario + mutaciones; las lecturas remotas van por TanStack Query en este hook.
 */
export function useProductFormScreen(mode: ProductFormMode, editProductId?: string) {
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const initialSnapshot = useRef<FormFields | null>(null);
  const editHydrated = useRef(false);

  const debouncedId = useDebounce(fields.id, 400);
  const syncIdErr = validateProductId(debouncedId);

  const editQuery = useProductQuery(mode === 'edit' ? editProductId : undefined);
  const verifyQuery = useVerifyProductIdQuery(
    debouncedId,
    mode === 'create' && !syncIdErr && debouncedId.trim().length > 0,
  );

  const createMut = useCreateProductMutation();
  const updateMut = useUpdateProductMutation();

  const dateRevisionComputed = useMemo(
    () => computeRevisionDateFromRelease(fields.date_release) ?? '',
    [fields.date_release],
  );

  const idTaken = verifyQuery.data === true;
  const idCheckPending = verifyQuery.isFetching;

  useEffect(() => {
    editHydrated.current = false;
  }, [editProductId, mode]);

  useEffect(() => {
    if (mode !== 'edit' || !editQuery.isSuccess || !editQuery.data) return;
    if (editHydrated.current) return;
    const f = productToFormFields(editQuery.data);
    setFields(f);
    initialSnapshot.current = { ...f };
    setFieldErrors({});
    setGeneralError(null);
    editHydrated.current = true;
  }, [mode, editQuery.isSuccess, editQuery.data]);

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

  useEffect(() => {
    if (mode !== 'create') return;

    if (syncIdErr) {
      setFieldErrors((prev) => ({ ...prev, id: syncIdErr }));
      return;
    }
    if (!debouncedId.trim()) {
      setFieldErrors((prev) => {
        const n = { ...prev };
        delete n.id;
        return n;
      });
      return;
    }

    setFieldErrors((prev) => ({
      ...prev,
      id: idTaken ? 'Este identificador ya está en uso.' : undefined,
    }));
  }, [debouncedId, mode, syncIdErr, idTaken]);

  const setField = useCallback(
    (key: keyof FormFields, value: string) => {
      if (mode === 'edit' && key === 'id') {
        return;
      }
      setFields((f) => ({ ...f, [key]: value }));
      setFieldErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
      setGeneralError(null);
    },
    [mode],
  );

  const validateAll = useCallback((): boolean => {
    const e: FieldErrors = {};
    const idErr = validateProductId(fields.id);
    if (idErr) e.id = idErr;
    else if (mode === 'create' && idTaken) e.id = 'Este identificador ya está en uso.';
    const nErr = validateName(fields.name);
    if (nErr) e.name = nErr;
    const dErr = validateDescription(fields.description);
    if (dErr) e.description = dErr;
    const lErr = validateLogo(fields.logo);
    if (lErr) e.logo = lErr;
    const drErr = validateDateRelease(fields.date_release);
    if (drErr) e.date_release = drErr;
    const dvErr = validateDateRevision(fields.date_release, dateRevisionComputed);
    if (dvErr) e.date_revision = dvErr;

    const fieldKeys: (keyof FinancialProduct)[] = [
      'id',
      'name',
      'description',
      'logo',
      'date_release',
      'date_revision',
    ];
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const k of fieldKeys) {
        const msg = e[k];
        if (msg) next[k] = msg;
        else delete next[k];
      }
      return next;
    });
    return !Object.values(e).some(Boolean);
  }, [fields, idTaken, dateRevisionComputed, mode]);

  const reset = useCallback(() => {
    if (mode === 'edit' && initialSnapshot.current) {
      setFields({ ...initialSnapshot.current });
    } else {
      setFields(emptyFields());
    }
    setFieldErrors({});
    setGeneralError(null);
  }, [mode]);

  const submitting = createMut.isPending || updateMut.isPending;

  const submit = useCallback(async (): Promise<boolean> => {
    setGeneralError(null);
    if (mode === 'create' && idCheckPending) {
      setGeneralError('Espera a que termine la verificación del identificador.');
      return false;
    }
    if (!validateAll()) {
      return false;
    }

    const dateRevision = computeRevisionDateFromRelease(fields.date_release.trim());
    if (!dateRevision) {
      setFieldErrors((p) => ({ ...p, date_release: 'Revisa la fecha de liberación.' }));
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
        setFieldErrors((prev) => ({ ...prev, ...mapped }));
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
  }, [fields, idCheckPending, validateAll, mode, createMut, updateMut]);

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
    reset,
    submit,
    dateRevisionComputed,
    editLoadStatus,
    editLoadError,
    reloadEdit,
    idEditable: mode === 'create',
  };
}
