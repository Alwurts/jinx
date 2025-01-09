import type { TDirectory } from "@/types/db";
import FileCard from "./card/file-card";
import { Separator } from "../ui/separator";

export function DirectoryTable({
	currentDirectory,
}: {
	currentDirectory: TDirectory;
}) {
	return (
		<div>
			<h2 className="text-xl font-semibold">Folders</h2>
			<Separator className="my-4" />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{currentDirectory?.directories.map((item) => (
					/* @ts-ignore*/
					<FileCard key={item.id} item={item} />
				))}
			</div>
		</div>
	);
}
