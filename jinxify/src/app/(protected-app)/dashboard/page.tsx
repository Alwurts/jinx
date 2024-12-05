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
import { Folder, FileText, Plus, Sidebar } from "lucide-react";
import Link from "next/link";
import type { TDirectory } from "@/types/db";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FaFolder, FaProjectDiagram, FaRegFileAlt } from "react-icons/fa";
import { SessionProvider } from "next-auth/react";

import { useSession } from "next-auth/react";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { FolderIcon } from "@/components/icons/folder-icon";
import { DirectoryTable } from "@/components/dashboard/directory-table";
import { DiagramTable } from "@/components/dashboard/diagram-table";

export default function Dashboard() {
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const directoryId = searchParams.get("directoryId") ?? "root";
	const { data: session, status } = useSession();

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
		}: {
			type: "directory" | "diagram";
			title: string;
		}) => {
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

	return (
		<div className="flex h-screen w-screen bg-gray-50">
			<AppSidebar session={session ?? null} />
			{isLoading ? (
				<DashboardSkeleton />
			) : (
				<main className="flex-1 flex flex-col ml-4 mr-4 mt-4 mb-4 p-4 bg-white shadow-xl rounded-lg border border-gray-200">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold">
							{currentDirectory?.title || "My Workspace"}
						</h1>
						<SidebarTrigger className="md:hidden" />
						<div className="flex gap-2">
							<Button
								disabled={createWorkspaceItem.isPending}
								variant="outline"
								onClick={handleCreateFolder}
								className="flex items-center gap-2"
							>
								New Folder
								<FaFolder className="w-5 h-5" />
							</Button>
							<Button
								disabled={createWorkspaceItem.isPending}
								onClick={handleCreateDiagram}
								className="flex items-center gap-2"
							>
								New Diagram
								<FaProjectDiagram className="w-5 h-5" />
							</Button>
						</div>
					</div>

					{currentDirectory?.directories.length === 0 &&
					currentDirectory?.diagrams.length === 0 ? (
						<div className="text-center text-gray-500 py-8">
							<p className="mb-4">
								No folders or diagrams yet. Create one to get started!
							</p>
							<Button onClick={handleCreateFolder}>
								<Plus className="w-4 h-4 mr-2" />
								Create Your First Folder
							</Button>
						</div>
					) : (
						<div className="space-y-8">
							{/* @ts-ignore */}
							<DirectoryTable currentDirectory={currentDirectory} />
							{/* @ts-ignore */}
							<DiagramTable currentDirectory={currentDirectory} />
						</div>
					)}
				</main>
			)}
		</div>
	);
}
