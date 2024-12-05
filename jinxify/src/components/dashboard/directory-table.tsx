import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FolderIcon } from "@/components/icons/folder-icon";
import Link from "next/link";
import type { TDirectory } from "@/types/db";
import { EllipsisVertical, Folder } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import FileCard from "./card/file-card";

export function DirectoryTable({
  currentDirectory,
}: {
  currentDirectory: TDirectory;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Folders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentDirectory?.directories.map((item) => (
          /* @ts-ignore*/
          <FileCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
