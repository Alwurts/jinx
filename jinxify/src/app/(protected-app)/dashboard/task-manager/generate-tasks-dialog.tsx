"use client";

import * as React from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Sparkles } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { TDiagram } from "@/types/db";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Add these loading messages
const loadingMessages = [
	"🤖 Teaching AI to organize tasks...",
	"🎨 Painting your project roadmap...",
	"🧩 Putting the pieces together...",
	"✨ Sprinkling some productivity magic...",
	"🔮 Consulting the crystal ball...",
	"🎯 Targeting key objectives...",
	"🚀 Preparing for liftoff...",
];

interface GenerateTasksDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function GenerateTasksDialog({
	open,
	onOpenChange,
}: GenerateTasksDialogProps) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: diagrams = [] } = useQuery<TDiagram[]>({
		queryKey: ["diagrams"],
		queryFn: async () => {
			const response = await fetch("/api/diagram");
			if (!response.ok) throw new Error("Failed to fetch diagrams");
			return response.json();
		},
	});

	// Add loading state management
	const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);

	const generateTasksMutation = useMutation({
		mutationFn: async (diagramId: string) => {
			const response = await fetch(`/api/ai/task-generate/${diagramId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to generate tasks");
			}

			const json = (await response.json()) as { diagramId: string };
			return json.diagramId;
		},
		onSuccess: (diagramId) => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			router.push(`/dashboard/task-manager?diagramId=${diagramId}`);
			onOpenChange(false);
		},
	});

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (generateTasksMutation.isPending) {
			interval = setInterval(() => {
				setLoadingMessageIndex((prev) =>
					prev === loadingMessages.length - 1 ? 0 : prev + 1,
				);
			}, 2000);
		}
		return () => clearInterval(interval);
	}, [generateTasksMutation.isPending]);

	const handleGenerateTasks = (diagramId: string) => {
		generateTasksMutation.mutate(diagramId);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[80vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Generate Tasks from Diagram</DialogTitle>
				</DialogHeader>
				{generateTasksMutation.isPending ? (
					<div className="flex flex-col items-center justify-center py-8 space-y-4">
						<div className="animate-bounce">
							<Sparkles className="w-8 h-8 text-primary" />
						</div>
						<p className="text-center text-muted-foreground animate-pulse">
							{loadingMessages[loadingMessageIndex]}
						</p>
					</div>
				) : (
					<div className="grid gap-4 py-4 overflow-y-auto flex-1">
						{diagrams.map((diagram) => (
							<Button
								key={diagram.id}
								onClick={() => handleGenerateTasks(diagram.id)}
								variant="outline"
								className="w-full justify-start"
								disabled={generateTasksMutation.isPending}
							>
								<LinkIcon className="mr-2 h-4 w-4" />
								{diagram.title || "Untitled Diagram"}
							</Button>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
