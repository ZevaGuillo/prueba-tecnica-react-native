import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { ApiError } from '@/data/errors/ApiError';
import {
  createProduct,
  getProductById,
  updateProduct,
  verifyProductId,
} from '@/presentation/di/productsComposition';
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

const NOT_FOUND_EDIT = 'No se encontró el producto. Puede que haya sido eliminado o el enlace sea incorrecto.';

export function useProductFormViewModel(mode: ProductFormMode, editProductId?: string) {
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [idTaken, setIdTaken] = useState(false);
  const [idCheckPending, setIdCheckPending] = useState(false);
  const [editLoadStatus, setEditLoadStatus] = useState<EditLoadStatus>(
    mode === 'edit' ? 'loading' : 'ready',
  );
  const [editLoadError, setEditLoadError] = useState<string | null>(null);
  const initialSnapshot = useRef<FormFields | null>(null);

  const debouncedId = useDebounce(fields.id, 400);

  const dateRevisionComputed = useMemo(
    () => computeRevisionDateFromRelease(fields.date_release) ?? '',
    [fields.date_release],
  );

  const loadEditProduct = useCallback(async () => {
    if (mode !== 'edit' || !editProductId?.trim()) {
      setEditLoadStatus('error');
      setEditLoadError('Falta el identificador del producto.');
      return;
    }
    setEditLoadStatus('loading');
    setEditLoadError(null);
    try {
      const p = await getProductById.execute(editProductId.trim());
      if (!p) {
        setEditLoadStatus('notFound');
        return;
      }
      const f = productToFormFields(p);
      setFields(f);
      initialSnapshot.current = { ...f };
      setFieldErrors({});
      setGeneralError(null);
      setEditLoadStatus('ready');
    } catch (e) {
      setEditLoadStatus('error');
      setEditLoadError(e instanceof Error ? e.message : 'No se pudo cargar el producto.');
    }
  }, [mode, editProductId]);

  useEffect(() => {
    if (mode === 'edit') {
      void loadEditProduct();
    }
  }, [mode, loadEditProduct]);

  useEffect(() => {
    if (mode !== 'create') return;

    const syncErr = validateProductId(debouncedId);
    if (syncErr) {
      setFieldErrors((prev) => ({ ...prev, id: syncErr }));
      setIdTaken(false);
      setIdCheckPending(false);
      return;
    }
    if (!debouncedId.trim()) {
      setFieldErrors((prev) => {
        const n = { ...prev };
        delete n.id;
        return n;
      });
      setIdTaken(false);
      setIdCheckPending(false);
      return;
    }

    let cancelled = false;
    setIdCheckPending(true);
    setIdTaken(false);
    verifyProductId
      .execute(debouncedId.trim())
      .then((exists) => {
        if (cancelled) return;
        setIdCheckPending(false);
        setIdTaken(exists);
        setFieldErrors((prev) => ({
          ...prev,
          id: exists ? 'Este identificador ya está en uso.' : undefined,
        }));
      })
      .catch(() => {
        if (cancelled) return;
        setIdCheckPending(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedId, mode]);

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
    if (mode === 'create') {
      setIdTaken(false);
    }
  }, [mode]);

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

    setSubmitting(true);
    try {
      if (mode === 'create') {
        await createProduct.execute(product);
      } else {
        await updateProduct.execute(product.id, {
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: product.date_release,
          date_revision: product.date_revision,
        });
      }
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        const mapped = mapBadRequestBodyToFieldErrors(err.body);
        setFieldErrors((prev) => ({ ...prev, ...mapped }));
        if (Object.keys(mapped).length === 0) {
          setGeneralError(err.message);
        }
      } else if (err instanceof ApiError && err.status === 404) {
        setGeneralError(NOT_FOUND_EDIT);
      } else {
        setGeneralError(
          err instanceof Error ? err.message : 'No se pudo guardar el producto.',
        );
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [fields, idCheckPending, validateAll, mode]);

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
    reloadEdit: loadEditProduct,
    idEditable: mode === 'create',
  };
}
