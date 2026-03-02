import { prisma } from "@/lib/prisma";
import { Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AnnouncementList() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function deleteAction(id: string) {
    "use server";
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/admin/settings");
  }

  return (
    <div className="mt-10 pt-10 border-t border-slate-100 space-y-4">
      <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider mb-4">
        Active Announcements ({announcements.length})
      </h4>
      
      {announcements.length === 0 && (
        <p className="text-sm text-slate-400 italic">No active announcements.</p>
      )}

      {announcements.map((a) => (
        <div key={a.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:border-red-100 transition-all">
          <div className="max-w-[80%]">
            <h5 className="font-bold text-slate-800 text-sm">{a.title}</h5>
            <p className="text-xs text-slate-500 line-clamp-1">{a.content}</p>
          </div>
          
          <form action={deleteAction.bind(null, a.id)}>
            <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
