import { db } from "@/lib/firebase";
import { Announcement } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
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

// ✅ UPDATE Announcement
export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; announcementId: string } }
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

    const storeSnap = await getDoc(doc(db, "stores", params.storeId));
    if (!storeSnap.exists() || storeSnap.data()?.userId !== userId) {
      return new NextResponse("Unauthorized Access", { status: 403 });
    }

    const announcementRef = doc(
      db,
      "stores",
      params.storeId,
      "announcements",
      params.announcementId
    );
    if (!(await getDoc(announcementRef)).exists()) {
      return new NextResponse("Announcement Not Found", { status: 404 });
    }

    await updateDoc(announcementRef, {
      name,
      value,
      updatedAt: serverTimestamp(),
    });

    return addCorsHeaders(
      new NextResponse(JSON.stringify({ msg: "Announcement Updated" }), {
        status: 200,
      })
    );
  } catch (error) {
    console.error(`ANNOUNCEMENTS_PATCH_ERROR: ${error}`);
    return addCorsHeaders(
      new NextResponse("Internal Server Error", { status: 500 })
    );
  }
};

// ✅ DELETE Announcement
export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; announcementId: string } }
) => {
  const res = new NextResponse();

  // Handle CORS preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return addCorsHeaders(res);
  }

  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const storeSnap = await getDoc(doc(db, "stores", params.storeId));
    if (!storeSnap.exists() || storeSnap.data()?.userId !== userId) {
      return new NextResponse("Unauthorized Access", { status: 403 });
    }

    await deleteDoc(
      doc(db, "stores", params.storeId, "announcements", params.announcementId)
    );

    return addCorsHeaders(
      new NextResponse(JSON.stringify({ msg: "Announcement Deleted" }), {
        status: 200,
      })
    );
  } catch (error) {
    console.error(`ANNOUNCEMENTS_DELETE_ERROR: ${error}`);
    return addCorsHeaders(
      new NextResponse("Internal Server Error", { status: 500 })
    );
  }
};
