import { db } from "@/lib/firebase";
import { collection, doc, getDocs, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

import { AnnouncementClient } from "./_components/client";
import { Announcement } from "@/types-db";
import { AnnouncementColumns } from "./_components/columns";

const AnnouncementPage = async ({
  params,
}: {
  params: { storeId: string };
}) => {
  const AnnouncementsData = (
    await getDocs(
      collection(doc(db, "stores", params.storeId), "announcements")
    )
  ).docs.map((doc) => doc.data()) as Announcement[];

  const formattedAnnouncements: AnnouncementColumns[] = AnnouncementsData.map(
    (item) => ({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt:
        item.createdAt instanceof Timestamp
          ? format(item.createdAt.toDate(), "MMMM do, yyyy")
          : "",
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AnnouncementClient data={formattedAnnouncements} />
      </div>
    </div>
  );
};

export default AnnouncementPage;
