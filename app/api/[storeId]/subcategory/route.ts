import { db } from "@/lib/firebase";
import { SubCategory } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// ✅ CREATE Subcategory
export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { name, categoryId } = body;

    if (!name || !categoryId || !params.storeId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Fetch category name
    const categoryDoc = await getDoc(
      doc(db, "stores", params.storeId, "categories", categoryId)
    );

    if (!categoryDoc.exists()) {
      return new NextResponse("Category Not Found", { status: 404 });
    }

    const categoryData = categoryDoc.data();

    const subCategoryData = {
      name,
      categoryId,
      categoryLabel: categoryData.name,
      createdAt: serverTimestamp(),
    };

    const subCategoryRef = await addDoc(
      collection(db, "stores", params.storeId, "subcategory"),
      subCategoryData
    );

    return NextResponse.json({ id: subCategoryRef.id, ...subCategoryData });
  } catch (error) {
    console.error(`SubCategory_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// ✅ GET All Subcategories
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const subCategoryData = (
      await getDocs(collection(db, "stores", params.storeId, "subcategory"))
    ).docs.map((doc) => {
      const data = doc.data();
      console.log("Subcategory Data:", data);
      return {
        id: doc.id,
        name: data.name,
        categoryName: data.categoryLabel || "Unknown",
        createdAt: data.createdAt?.toDate().toLocaleDateString() || "",
      };
    });

    return NextResponse.json(subCategoryData);
  } catch (error) {
    console.error(`SubCategory_GET: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
