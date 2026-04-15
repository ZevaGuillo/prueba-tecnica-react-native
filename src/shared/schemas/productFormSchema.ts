import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import {
  computeRevisionDateFromRelease,
  validateDateRelease,
  validateDateRevision,
  validateDescription,
  validateLogo,
  validateName,
  validateProductId,
} from '@/shared/utils/validators';
import { z } from 'zod';

export type ProductFormValues = Pick<
  FinancialProduct,
  'id' | 'name' | 'description' | 'logo' | 'date_release'
>;

export function emptyProductFormValues(): ProductFormValues {
  return {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
  };
}

/**
 * Validación Zod alineada a `validators.ts` y al spec.
 * El ID duplicado (API) se valida en el hook con TanStack Query + `setError`.
 */
export function buildProductFormSchema() {
  return z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      logo: z.string(),
      date_release: z.string(),
    })
    .superRefine((data, c) => {
      const idErr = validateProductId(data.id);
      if (idErr) {
        c.addIssue({ code: 'custom', path: ['id'], message: idErr });
      }

      const nErr = validateName(data.name);
      if (nErr) c.addIssue({ code: 'custom', path: ['name'], message: nErr });

      const dErr = validateDescription(data.description);
      if (dErr) c.addIssue({ code: 'custom', path: ['description'], message: dErr });

      const lErr = validateLogo(data.logo);
      if (lErr) c.addIssue({ code: 'custom', path: ['logo'], message: lErr });

      const drErr = validateDateRelease(data.date_release);
      if (drErr) {
        c.addIssue({ code: 'custom', path: ['date_release'], message: drErr });
        return;
      }

      const dateRevision = computeRevisionDateFromRelease(data.date_release.trim());
      if (!dateRevision) {
        c.addIssue({
          code: 'custom',
          path: ['date_release'],
          message: 'Revisa la fecha de liberación.',
        });
        return;
      }

      const dvErr = validateDateRevision(data.date_release, dateRevision);
      if (dvErr) {
        c.addIssue({ code: 'custom', path: ['date_revision'], message: dvErr });
      }
    });
}
