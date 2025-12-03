import { Product } from "../types/product";
import { db } from "../config/firebase";

const COLLECTION_NAME = "products";
const COUNTER_DOCUMENT_NAME = "product_id_counter";

const getNextProductId = async (): Promise<number> => {
  const counterRef = db.collection("counters").doc(COUNTER_DOCUMENT_NAME);

  const result = await db.runTransaction(async (transaction) => {
    const counterDocument = await transaction.get(counterRef);
    let newId = 1;

    if (counterDocument.exists) {
      const currentId = counterDocument.data()?.currentId || 0;
      newId = currentId + 1;
      transaction.update(counterRef, { currentId: newId });
    } else {
      transaction.set(counterRef, { currentId: newId });
    }

    return newId;
  });

  return result;
};

export const createProduct = async (productData: Omit<Product, "id" | "createdAt">): Promise<Product> => {
  const numberId = await getNextProductId();
  const productId = numberId.toString();

  const newProduct = {
    ...productData,
    createdAt: new Date(),
  };

  await db.collection(COLLECTION_NAME).doc(productId).set(newProduct);

  return {
    ...newProduct,
    id: productId,
  };
};

export const getAllProducts = async (): Promise<Product[]> => {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  const products: Product[] = [];

  snapshot.forEach(document => {
    const data = document.data();
    const productData = {
      id: document.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    } as Product;

    products.push(productData);
  });

  return products;
};

export const getProduct = async (id: string): Promise<Product | undefined> => {
  const productRef = db.collection(COLLECTION_NAME).doc(id);
  const productDocument = await productRef.get();

  if (!productDocument.exists) {
    return undefined;
  }

  const data = productDocument.data();
  const productData = {
    id: productDocument.id,
    ...data,
    createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt,
    updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt,
  } as Product;

  return productData;
};

export const updateProductById = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  const productRef = db.collection(COLLECTION_NAME).doc(id);
  const productDocument = await productRef.get();

  if (!productDocument.exists) {
    return null;
  }

  const updatedData = {
    ...updates,
    updatedAt: new Date(),
  };

  await productRef.update(updatedData);

  const updatedProductDocument = await productRef.get();
  const data = updatedProductDocument.data();
  const productData = {
    id: updatedProductDocument.id,
    ...data,
    createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt,
    updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt,
  } as Product;

  return productData;
};

export const deleteProductById = async (id: string): Promise<boolean> => {
  const productRef = db.collection(COLLECTION_NAME).doc(id);
  const productDocument = await productRef.get();

  if (!productDocument.exists) {
    return false;
  }

  await productRef.delete();
  return true;
};
