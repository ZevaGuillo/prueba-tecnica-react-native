import { z } from 'zod';

/** Objeto `Product`(campos obligatorios en JSON). */
export const productApiDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  date_release: z.string(),
  date_revision: z.string(),
});

export type ProductApiDto = z.infer<typeof productApiDtoSchema>;

export const listResponseSchema = z.object({
  data: z.array(productApiDtoSchema),
});

/** POST 200: `data` obligatorio con producto completo. */
export const createResponseSchema = z.object({
  message: z.string().optional(),
  data: productApiDtoSchema,
});

const wrappedProductSchema = z.object({ data: productApiDtoSchema });

/** GET por ID: cuerpo plano o `{ data: product }`. */
export function parseProductFromGetById(body: unknown): ProductApiDto | null {
  const direct = productApiDtoSchema.safeParse(body);
  if (direct.success) return direct.data;
  const wrapped = wrappedProductSchema.safeParse(body);
  if (wrapped.success) return wrapped.data.data;
  return null;
}

export const verificationResponseSchema = z.boolean();
