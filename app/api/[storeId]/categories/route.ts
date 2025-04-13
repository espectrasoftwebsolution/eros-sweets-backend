import { db } from "@/lib/firebase";
import { Category } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// CREATE CATEGORY
export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Category Name is missing!", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Category Value is missing!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (!store.exists() || store.data()?.userId !== userId) {
      return new NextResponse("Un-Authorized Access", { status: 403 });
    }

    const categoryData = {
      name,
      value,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const categoryRef = await addDoc(
      collection(db, "stores", params.storeId, "categories"),
      categoryData
    );

    const id = categoryRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...categoryData });
  } catch (error) {
    console.log(`CATEGORIES_POST:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// FETCH CATEGORIES
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const categoriesData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
    ).docs.map((doc) => doc.data()) as Category[];

    return NextResponse.json(categoriesData);
  } catch (error) {
    console.log(`CATEGORIES_GET:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
