import { db, storage } from "@/lib/firebase";
import { Product } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    const {
      name,
      description,
      price,
      images,
      isFeatured,
      isArchived,
      isActive,
      isVeg,
      category,
      subCategory,
    } = body;

    if (!name) {
      return new NextResponse("SIze Name is missing!", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required!", { status: 400 });
    }

    if (!category) {
      return new NextResponse("Category is missing!", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is missing!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const productRef = await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    );

    if (productRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "products", params.productId),
        {
          ...productRef.data(),
          name,
          description,
          price,
          images,
          isFeatured,
          isArchived,
          isActive,
          isVeg,
          category,
          subCategory,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Product Not Found", { status: 404 });
    }

    const product = (
      await getDoc(
        doc(db, "stores", params.storeId, "products", params.productId)
      )
    ).data() as Product;

    return NextResponse.json(product);
  } catch (error) {
    console.log(`PRODUCT_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const productRef = doc(
      db,
      "stores",
      params.storeId,
      "products",
      params.productId
    );

    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return new NextResponse("Product Not Found", { status: 404 });
    }

    // delete all the image from the storage
    const images = productDoc.data()?.images;

    if (images && Array.isArray(images)) {
      await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, image.url);
          await deleteObject(imageRef);
        })
      );
    }

    await deleteDoc(productRef);

    return NextResponse.json({
      msg: "Product and asssociated images delete successfully",
    });
  } catch (error) {
    console.log(`PRODUCT_DELETE:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is missing", { status: 400 });
    }

    const product = (
      await getDoc(
        doc(db, "stores", params.storeId, "products", params.productId)
      )
    ).data() as Product;

    return NextResponse.json(product);
  } catch (error) {
    console.log(`PRODUCT_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
