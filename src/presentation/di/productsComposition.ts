import { ApiClient } from '@/data/datasources/ApiClient';
import { ProductRemoteDataSource } from '@/data/datasources/ProductRemoteDataSource';
import { ProductRepositoryImpl } from '@/data/repositories/ProductRepositoryImpl';
import { CreateProduct } from '@/core/usecases/CreateProduct';
import { DeleteProduct } from '@/core/usecases/DeleteProduct';
import { GetProductById } from '@/core/usecases/GetProductById';
import { GetProducts } from '@/core/usecases/GetProducts';
import { UpdateProduct } from '@/core/usecases/UpdateProduct';
import { VerifyProductId } from '@/core/usecases/VerifyProductId';

const apiClient = ApiClient.getInstance();
const productRemoteDataSource = new ProductRemoteDataSource(apiClient);
const productRepository = new ProductRepositoryImpl(productRemoteDataSource);

export const getProducts = new GetProducts(productRepository);
export const getProductById = new GetProductById(productRepository);
export const createProduct = new CreateProduct(productRepository);
export const updateProduct = new UpdateProduct(productRepository);
export const deleteProduct = new DeleteProduct(productRepository);
export const verifyProductId = new VerifyProductId(productRepository);

export { productRepository };
