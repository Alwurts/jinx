"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { TDiagram } from "@/types/db";

interface DiagramSelectionDialogProps {
	open: boolean;
	onClose: () => void;
	onSelect: (diagramId: string) => void;
	currentDiagramId?: string;
}

export function DiagramSelectionDialog({
	open,
	onClose,
	onSelect,
	currentDiagramId,
}: DiagramSelectionDialogProps) {
	const { data: diagrams, isLoading } = useQuery<TDiagram[]>({
		queryKey: ["diagrams"],
		queryFn: async () => {
			const response = await fetch("/api/diagram");
			if (!response.ok) {
				throw new Error("Failed to fetch diagrams");
			}
			return response.json();
		},
	});

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select a Diagram</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 mt-4">
					{isLoading ? (
						Array(3)
							.fill(0)
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							.map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
					) : diagrams?.length === 0 ? (
						<p className="text-sm text-gray-500">No diagrams found</p>
					) : (
						diagrams?.map((diagram) => (
							<Button
								key={diagram.id}
								variant={
									currentDiagramId === diagram.id ? "default" : "outline"
								}
								className="w-full justify-start"
								onClick={() => onSelect(diagram.id)}
							>
								{diagram.title || "Untitled Diagram"}
							</Button>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
