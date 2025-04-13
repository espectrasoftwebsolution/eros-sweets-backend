import { db } from "@/lib/firebase";
import { SubCategory } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// ✅ UPDATE Subcategory
export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; subcategoryId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { name, categoryId } = body;

    if (!name || !categoryId) {
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

    const subcategoryRef = doc(
      db,
      "stores",
      params.storeId,
      "subcategory",
      params.subcategoryId
    );

    await updateDoc(subcategoryRef, {
      name,
      categoryId,
      categoryLabel: categoryData.name,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      id: params.subcategoryId,
      name,
      categoryId,
      categoryName: categoryData.name,
    });
  } catch (error) {
    console.error(`SubCategory_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// ✅ DELETE Subcategory
export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; subcategoryId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const subcategoryRef = doc(
      db,
      "stores",
      params.storeId,
      "subcategory",
      params.subcategoryId
    );

    const subcategoryDoc = await getDoc(subcategoryRef);
    if (!subcategoryDoc.exists()) {
      return new NextResponse("Subcategory Not Found", { status: 404 });
    }

    await deleteDoc(subcategoryRef);

    return NextResponse.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error(`SubCategory_DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
