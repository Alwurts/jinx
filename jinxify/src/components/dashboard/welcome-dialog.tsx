"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WelcomeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreateFolder: () => void;
}

export function WelcomeDialog({
	open,
	onOpenChange,
	onCreateFolder,
}: WelcomeDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Welcome to Jinxify! 👋</DialogTitle>
					<DialogDescription>
						Get started by creating your first folder to organize your work.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<p className="text-sm text-muted-foreground">
						Folders help you organize your diagrams, forms, and documents. You can create as many folders as you need and nest them to create a structure that works for you.
					</p>
					<Button onClick={onCreateFolder} className="w-full">
						<Plus className="w-4 h-4 mr-2" />
						Create Your First Folder
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
} 