"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Folder, FileText, Plus } from "lucide-react";
import Link from "next/link";
import type { TDirectory } from "@/types/db";

export default function Dashboard() {
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const directoryId = searchParams.get("directoryId") ?? "root";

	const { data: currentDirectory, isLoading } = useQuery({
		queryKey: ["directory", directoryId],
		queryFn: async () => {
			const response = await fetch(`/api/workspace/${directoryId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch directory");
			}
			return response.json() as Promise<TDirectory>;
		},
	});

	const createWorkspaceItem = useMutation({
		mutationFn: async ({
			type,
			title,
		}: { type: "directory" | "diagram"; title: string }) => {
			const response = await fetch("/api/workspace", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type,
					title,
					directoryId: currentDirectory?.id,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create workspace item");
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch the current directory data
			queryClient.invalidateQueries({ queryKey: ["directory", directoryId] });
		},
	});

	const handleCreateFolder = () => {
		createWorkspaceItem.mutate({
			type: "directory",
			title: "New Folder", // You might want to add a dialog to get the title from user
		});
	};

	const handleCreateDiagram = () => {
		createWorkspaceItem.mutate({
			type: "diagram",
			title: "New Diagram", // You might want to add a dialog to get the title from user
		});
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const items = [
		...(currentDirectory?.directories ?? []),
		...(currentDirectory?.diagrams ?? []),
	];

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					{currentDirectory?.title || "My Workspace"}
				</h1>
				<div className="space-x-2">
					<Button
						disabled={createWorkspaceItem.isPending}
						variant="outline"
						onClick={handleCreateFolder}
					>
						<Plus className="w-4 h-4 mr-2" />
						New Folder
					</Button>
					<Button
						disabled={createWorkspaceItem.isPending}
						onClick={handleCreateDiagram}
					>
						<Plus className="w-4 h-4 mr-2" />
						New Diagram
					</Button>
				</div>
			</div>

			{items.length === 0 ? (
				<div className="text-center text-muted-foreground py-8">
					No folders or diagrams yet. Create one to get started!
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{items.map((item) => (
						<Link
							href={
								item.type === "directory"
									? `/dashboard?directoryId=${item.id}`
									: `/diagram/${item.id}`
							}
							key={item.id}
						>
							<Card className="hover:bg-accent transition-colors cursor-pointer">
								<CardHeader>
									<CardTitle className="flex items-center">
										{item.type === "directory" ? (
											<Folder className="w-4 h-4 mr-2" />
										) : (
											<FileText className="w-4 h-4 mr-2" />
										)}
										{item.title}
									</CardTitle>
									<CardDescription>
										{item.type === "directory" ? "Folder" : "Diagram"}
									</CardDescription>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
