import { db, storage } from "@/lib/firebase";
import { Store } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);

    // Delete billboards and images
    const billboardsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/billboards`)
    );

    billboardsQuerySnapshot.forEach(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref);

      const imageUrl = billboardDoc.data().imageUrl;
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    });

    // Delete categories
    const categoriesQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/categories`)
    );

    categoriesQuerySnapshot.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    // Delete subcategory (renamed from `subcategories`)
    const subcategoryQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/subcategory`)
    );

    subcategoryQuerySnapshot.forEach(async (subcategoryDoc) => {
      await deleteDoc(subcategoryDoc.ref);
    });

    // Delete sizes
    const sizesQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/sizes`)
    );

    sizesQuerySnapshot.forEach(async (sizeDoc) => {
      await deleteDoc(sizeDoc.ref);
    });

    // Delete cuisines
    const cuisinesQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/cuisines`)
    );

    cuisinesQuerySnapshot.forEach(async (cuisineDoc) => {
      await deleteDoc(cuisineDoc.ref);
    });

    // Finally, delete the store
    await deleteDoc(docRef);

    return NextResponse.json({
      msg: "Store and all of its sub-collections deleted",
    });
  } catch (error) {
    console.log(`STORES_DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
