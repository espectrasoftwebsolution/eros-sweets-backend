import { db } from "@/lib/firebase";
import { Announcement } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { AnnouncementForm } from "./_components/announcement-form";

const AnnouncementPage = async ({
  params,
}: {
  params: {
    announcementId: string;
    storeId: string;
  };
}) => {
  const announcement = (
    await getDoc(
      doc(db, "stores", params.storeId, "announcements", params.announcementId)
    )
  ).data() as Announcement;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AnnouncementForm initialData={announcement} />
      </div>
    </div>
  );
};

export default AnnouncementPage;
