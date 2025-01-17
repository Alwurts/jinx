import type { TDirectory } from "@/types/db";
import FileList from "./files-view/files-list";
import { Separator } from "../ui/separator";

export function FilesTableList({
	currentDirectoryData,
}: {
	currentDirectoryData: (
		| TDirectory["documents"][number]
		| TDirectory["directories"][number]
		| TDirectory["forms"][number]
		| TDirectory["diagrams"][number]
	)[];
}) {
	return (
		<div>
			<h2 className="text-xl font-semibold ">Items</h2>
			<Separator className="my-4" />
			<div className="flex flex-col space-y-2">
				{currentDirectoryData.map((item) => (
					/* @ts-ignore*/
					<FileList key={item.id} item={item} />
				))}
			</div>
		</div>
	);
}
