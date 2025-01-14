import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TDiagram, TDirectory, TForm, TDocument } from "@/types/db";
import { EllipsisVertical, Folder } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaFileAlt, FaProjectDiagram, FaFileWord } from "react-icons/fa";
import { RenameDialog } from "../rename-dialog";
import { useState } from "react";
import { DeleteDialog } from "../delete-dialog";

type Props = {
	item: TDiagram | TDirectory | TForm | TDocument;
};
export default function FileCard({ item }: Props) {
	const [openRenameDialog, setOpenRenameDialog] = useState<
		TDiagram | TDirectory | TForm | TDocument | null
	>(null);
	const [deleteDialog, setDeleteDialog] = useState<
		TDiagram | TDirectory | TForm | TDocument | null
	>(null);

	return (
		<>
			<RenameDialog
				item={openRenameDialog}
				close={(open: boolean) => {
					if (!open) {
						setOpenRenameDialog(null);
					}
				}}
			/>
			<DeleteDialog
				item={deleteDialog}
				close={(open: boolean) => {
					if (!open) {
						setDeleteDialog(null);
					}
				}}
			/>
			<Link
				href={
					item.type === "diagram"
						? `/diagram/${item.id}`
						: item.type === "form"
							? `/form/${item.id}`
							: item.type === "document"
								? `/document/${item.id}`
								: `/dashboard/files?directoryId=${item.id}`
				}
				key={item.id}
			>
				<Card className="mt-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-shadow cursor-pointer">
					<CardHeader>
						<CardTitle className="flex items-center w-full ">
							<div className="flex w-full justify-between">
								<div className="flex items-center">
									{item.type === "diagram" ? (
										<FaProjectDiagram className="w-5 h-5 mr-2 text-purple-900" />
									) : item.type === "form" ? (
										<FaFileAlt className="w-5 h-5 mr-2 text-purple-900" />
									) : item.type === "document" ? (
										<FaFileWord className="w-5 h-5 mr-2 text-purple-900" />
									) : (
										<Folder className="w-5 h-5 mr-2 text-purple-900" />
									)}

									{item.title}
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="h-8 w-8 p-0">
											<EllipsisVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={(e) => {
												e.preventDefault();
												setOpenRenameDialog(item);
											}}
										>
											Edit
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={(e) => {
												e.preventDefault();
												setDeleteDialog(item);
											}}
										>
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardTitle>
						<CardDescription className="text-sm text-gray-400">
							{item.type === "form"
								? "Form"
								: item.type === "diagram"
									? "Diagram"
									: item.type === "document"
										? "Document"
										: "Folder"}
						</CardDescription>
					</CardHeader>
				</Card>
			</Link>
		</>
	);
}
