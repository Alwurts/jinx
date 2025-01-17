import type { TDirectory } from "@/types/db";
import { FilesTableCard } from "@/components/dashboard/files-table-card";
import { FilesTableList } from "./files-table-list";


interface DirectoryListViewProps {
  currentDirectoryData: (TDirectory["documents"][number] | TDirectory["directories"][number] | TDirectory["forms"][number] | TDirectory["diagrams"][number])[];
  directoryUrlId: string;
  selectItem: "directory" | "diagram" | "form" | "document"| null;
  viewType: "grid" | "list";
}

export function FilesLayout({ currentDirectoryData, viewType }: DirectoryListViewProps) {
    if (viewType === "grid") {
        return  <FilesTableCard  currentDirectoryData={currentDirectoryData} />
            

    }

    return (
        
            
        <FilesTableList  currentDirectoryData={currentDirectoryData}  />
            
        
    );
}
