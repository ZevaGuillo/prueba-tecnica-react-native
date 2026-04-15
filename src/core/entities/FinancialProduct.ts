/**
 * Producto financiero del catálogo (dominio).
 * Fechas como ISO 8601 fecha (`YYYY-MM-DD`) según data-model.
 */
export interface FinancialProduct {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}
