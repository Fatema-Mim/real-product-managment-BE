import { Category } from "../types/category";
import { db } from "../config/firebase";

const COLLECTION_NAME = "categories";
const COUNTER_DOCUMENT_NAME = "category_id_counter";

const getNextCategoryId = async (): Promise<number> => {
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

export const createCategory = async (categoryData: Omit<Category, "id" | "createdAt">): Promise<Category> => {
  const numberId = await getNextCategoryId();
  const categoryId = numberId.toString();

  const capitalizedName = categoryData.name.charAt(0).toUpperCase() + categoryData.name.slice(1).toLowerCase();

  const newCategory = {
    ...categoryData,
    name: capitalizedName,
    createdAt: new Date(),
  };

  await db.collection(COLLECTION_NAME).doc(categoryId).set(newCategory);

  return {
    ...newCategory,
    id: categoryId,
  };
};

export const getAllCategories = async (): Promise<Category[]> => {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  const categories: Category[] = [];

  snapshot.forEach(document => {
    const data = document.data();
    const categoryData = {
      id: document.id,
      name: data.name,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    } as Category;

    categories.push(categoryData);
  });

  return categories;
};

export const updateCategoryById = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
  const categoryRef = db.collection(COLLECTION_NAME).doc(id);
  const categoryDocument = await categoryRef.get();

  if (!categoryDocument.exists) {
    return null;
  }

  const updatedData = {
    ...updates,
    updatedAt: new Date(),
  };

  await categoryRef.update(updatedData);

  const updatedCategoryDocument = await categoryRef.get();
  const data = updatedCategoryDocument.data()!;
  const categoryData = {
    id: updatedCategoryDocument.id,
    name: data.name,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
  } as Category;

  return categoryData;
};

export const deleteCategoryById = async (id: string): Promise<boolean> => {
  const categoryRef = db.collection(COLLECTION_NAME).doc(id);
  const categoryDocument = await categoryRef.get();

  if (!categoryDocument.exists) {
    return false;
  }

  const categoryData = categoryDocument.data();
  const categoryName = categoryData?.name;

  const productsSnapshot = await db.collection("products").get();

  const batch = db.batch();

  productsSnapshot.forEach((productDocument) => {
    const productData = productDocument.data();
    const categoryIds = productData.category_id || [];

    if (Array.isArray(categoryIds) && categoryIds.includes(categoryName)) {
      const remainingCategories = categoryIds.filter((category: string) => category !== categoryName);

      if (remainingCategories.length === 0) {
        batch.update(productDocument.ref, {
          category_id: [],
          status: "inactive",
          updatedAt: new Date(),
        });
      } else {
        batch.update(productDocument.ref, {
          category_id: remainingCategories,
          updatedAt: new Date(),
        });
      }
    }
  });

  await batch.commit();

  await categoryRef.delete();
  return true;
};
