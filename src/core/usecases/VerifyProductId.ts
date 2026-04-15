import type { IProductRepository } from '@/core/repositories/IProductRepository';

export class VerifyProductId {
  constructor(private readonly repository: IProductRepository) {}

  /** Devuelve `true` si el ID ya existe (no está disponible para alta). */
  execute(id: string): Promise<boolean> {
    return this.repository.verifyId(id);
  }
}
