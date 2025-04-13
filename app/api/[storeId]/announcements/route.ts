import { db } from "@/lib/firebase";
import { Announcement } from "@/types-db";
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

// Add CORS headers to the response
const addCorsHeaders = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins (adjust as needed)
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
};

// ✅ CREATE Announcement
export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  const res = new NextResponse();

  // Handle CORS preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return addCorsHeaders(res);
  }

  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { name, value } = body;
    if (!name || value === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!params.storeId)
      return new NextResponse("Store ID missing", { status: 400 });

    const storeSnap = await getDoc(doc(db, "stores", params.storeId));
    if (!storeSnap.exists() || storeSnap.data()?.userId !== userId) {
      return new NextResponse("Unauthorized Access", { status: 403 });
    }

    const announcementRef = await addDoc(
      collection(db, "stores", params.storeId, "announcements"),
      { name, value, createdAt: serverTimestamp() }
    );

    await updateDoc(announcementRef, {
      id: announcementRef.id,
      updatedAt: serverTimestamp(),
    });

    return addCorsHeaders(
      new NextResponse(
        JSON.stringify({ id: announcementRef.id, name, value }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error(`ANNOUNCEMENTS_POST_ERROR: ${error}`);
    return addCorsHeaders(
      new NextResponse("Internal Server Error", { status: 500 })
    );
  }
};

// ✅ GET Announcements
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  const res = new NextResponse();

  // Handle CORS preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return addCorsHeaders(res);
  }

  try {
    if (!params.storeId)
      return new NextResponse("Store ID missing", { status: 400 });

    const snapshot = await getDocs(
      collection(db, "stores", params.storeId, "announcements")
    );
    const announcements = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Announcement[];

    return addCorsHeaders(
      new NextResponse(JSON.stringify(announcements), { status: 200 })
    );
  } catch (error) {
    console.error(`ANNOUNCEMENTS_GET_ERROR: ${error}`);
    return addCorsHeaders(
      new NextResponse("Internal Server Error", { status: 500 })
    );
  }
};
