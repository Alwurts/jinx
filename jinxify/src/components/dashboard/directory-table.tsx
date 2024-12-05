import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { FolderIcon } from "@/components/icons/folder-icon";
import Link from "next/link";
import type { TDirectory } from "@/types/db";
import { Folder } from "lucide-react";

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
					<Link href={`/dashboard?directoryId=${item.id}`} key={item.id}>
						<Card className="mt-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-shadow cursor-pointer">
							<CardHeader>
								<CardTitle className="flex items-center">
									<Folder className="w-5 h-5 mr-2 text-purple-900" />
									{item.title}
								</CardTitle>
								<CardDescription className="text-sm text-gray-400">
									Folder
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
