import type { TDirectory } from "@/types/db";
import FileCard from "./files-view/file-card";
import { Separator } from "../ui/separator";

export function FilesTableCard({
	currentDirectoryData,
 
}: {
  currentDirectoryData: (TDirectory["documents"][number] | TDirectory["directories"][number] | TDirectory["forms"][number] | TDirectory["diagrams"][number])[];
  
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold ">Items</h2>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

		{currentDirectoryData.map((item) => (
          /* @ts-ignore*/
          <FileCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
