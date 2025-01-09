"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, FilesIcon } from "lucide-react";
import type { TDirectory } from "@/types/db";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FaFolder, FaProjectDiagram } from "react-icons/fa";

import { useSession } from "next-auth/react";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DirectoryTable } from "@/components/dashboard/directory-table";
import { DiagramTable } from "@/components/dashboard/diagram-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ImageOverlayHeader from "@/components/layout/image-overlay-header";
import { MdMyLocation } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

export default function Dashboard() {
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const directoryId = searchParams.get("directoryId") ?? "root";
	const { data: session, status } = useSession();
	const router = useRouter();

	const { data: currentDirectory, isLoading } = useQuery({
		queryKey: ["directory", directoryId],
		queryFn: async () => {
			const response = await fetch(`/api/workspace/${directoryId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch directory");
			}
			const data = (await response.json()) as TDirectory;
			return data;
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

	const handleCreateFolder = (type: "diagram" | "directory") => {
		createWorkspaceItem.mutate({
			type,
			title: `New ${type === "directory" ? "Folder" : "Diagram"}`,
		});
	};

	const handleGoBack = () => {
		if (currentDirectory?.parent?.directoryId) {
			const newParams = new URLSearchParams();
			newParams.set("directoryId", currentDirectory.parent.id);
			router.push(`/dashboard/files?${newParams.toString()}`);
		} else {
			router.push("/dashboard/files");
		}
	};

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	return (
		<>
			<ImageOverlayHeader
				title="Files"
				icon={<FilesIcon className="size-8 text-secondary z-20" />}
				leftToolbar={
					<>
						{directoryId !== "root" && (
							<Button
								variant="secondary"
								size="icon"
								onClick={handleGoBack}
								className="hover:bg-gray-100 z-10"
							>
								<ArrowLeft className="w-5 h-5" />
							</Button>
						)}
						<SidebarTrigger className="md:hidden z-10 bg-secondary" />
					</>
				}
				rightToolbar={
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="secondary"
								className="flex items-center gap-2"
								disabled={createWorkspaceItem.isPending}
							>
								New Item
								<Plus className="w-5 h-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								onClick={() => handleCreateFolder("directory")}
								className="z-30"
							>
								<FaFolder className="w-4 h-4 mr-2" />
								New Folder
							</DropdownMenuItem>
							{directoryId !== "root" && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => handleCreateFolder("diagram")}
									>
										<FaProjectDiagram className="w-4 h-4 mr-2" />
										New Diagram
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				}
			/>

			<div className="flex items-center gap-4 py-4 px-4 pb-8">
				<div className="flex items-center space-x-1 text-muted-foreground">
					<IoIosArrowForward className="w-4 h-4" />
					<h1 className="text-sm">
						{currentDirectory?.title || "My Workspace"}
					</h1>
				</div>
			</div>

			{currentDirectory?.directories.length === 0 &&
			currentDirectory?.diagrams.length === 0 ? (
				<div className="text-center text-gray-500 py-8">
					<p className="mb-4">
						No folders or diagrams yet. Create one to get started!
					</p>
					<Button onClick={() => handleCreateFolder("directory")}>
						<Plus className="w-4 h-4 mr-2" />
						Create Your First Folder
					</Button>
				</div>
			) : (
				currentDirectory && (
					<div className="space-y-8 px-4">
						<DirectoryTable currentDirectory={currentDirectory} />
						{directoryId !== "root" && (
							<DiagramTable currentDirectory={currentDirectory ?? {}} />
						)}
					</div>
				)
			)}
		</>
	);
}
