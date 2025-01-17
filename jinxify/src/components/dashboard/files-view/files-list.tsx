import { Button } from "@/components/ui/button";
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
import React, { useState } from "react";
import {
	FaFileAlt,
	FaProjectDiagram,
	FaFileWord,
	FaFolder,
} from "react-icons/fa";
import { RenameDialog } from "../rename-dialog";
import { DeleteDialog } from "../delete-dialog";

type Item = TDiagram | TDirectory | TForm | TDocument;

type Props = {
	item: Item;
};

export default function FilesList({ item }: Props) {
	const [openRenameDialog, setOpenRenameDialog] = useState<Item | null>(null);
	const [deleteDialog, setDeleteDialog] = useState<Item | null>(null);

	const getIcon = () => {
		switch (item.type) {
			case "diagram":
				return <FaProjectDiagram className="w-5 h-5 mr-2 text-primary" />;
			case "form":
				return <FaFileAlt className="w-5 h-5 mr-2 text-primary" />;
			case "document":
				return <FaFileWord className="w-5 h-5 mr-2 text-primary" />;
			case "directory":
				return <FaFolder className="w-5 h-5 mr-2 text-primary" />;
			default:
				return <Folder className="w-5 h-5 mr-2 text-primary" />;
		}
	};

	const getItemLink = () => {
		switch (item.type) {
			case "diagram":
				return `/diagram/${item.id}`;
			case "form":
				return `/form/${item.id}`;
			case "document":
				return `/document/${item.id}`;
			case "directory":
				return `/dashboard/files?directoryId=${item.id}`;
			default:
				return "#";
		}
	};

	return (
		<>
			<RenameDialog
				item={openRenameDialog}
				close={(open: boolean) => {
					if (!open) setOpenRenameDialog(null);
				}}
			/>
			<DeleteDialog
				item={deleteDialog}
				close={(open: boolean) => {
					if (!open) setDeleteDialog(null);
				}}
			/>
			<Link href={getItemLink()} key={item.id}>
				<div className="flex items-center justify-between p-3 hover:bg-accent/50 transition-all cursor-pointer border-b border-border">
					<div className="flex items-center space-x-3">
						{getIcon()}
						<span className="text-foreground">{item.title}</span>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-muted-foreground capitalize">
							{item.type}
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<EllipsisVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="bg-popover">
								<DropdownMenuLabel className="text-foreground">
									Actions
								</DropdownMenuLabel>
								<DropdownMenuSeparator className="bg-border" />
								<DropdownMenuItem
									onClick={(e) => {
										e.preventDefault();
										setOpenRenameDialog(item);
									}}
									className="text-foreground hover:bg-accent/50"
								>
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={(e) => {
										e.preventDefault();
										setDeleteDialog(item);
									}}
									className="text-foreground hover:bg-accent/50"
								>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</Link>
		</>
	);
}
