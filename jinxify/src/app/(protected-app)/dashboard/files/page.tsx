"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, FilesIcon, Folder } from "lucide-react";
import type { TDirectory } from "@/types/db";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	FaFileAlt,
	FaFolder,
	FaProjectDiagram,
	FaFileWord,
} from "react-icons/fa";

import { useSession } from "next-auth/react";
import { DashboardSkeleton } from "@/components/dashboard/file-skeleton";
import { WelcomeDialog } from "@/components/dashboard/welcome-dialog";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ImageOverlayHeader from "@/components/layout/image-overlay-header";
import { LuLayoutGrid } from "react-icons/lu";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMemo, useState, useEffect } from "react";
import { FilesLayout } from "@/components/dashboard/files-layout";
import { DirectoryProvider } from "@/context/directory-context";
import { TemplateSelectionDialog } from "@/components/dashboard/template-selection-dialog";

export default function Dashboard() {
	const [viewType, setViewType] = useState<"grid" | "list">("grid");
	const [selectItem, setSelectItem] = useState<
		"directory" | "diagram" | "form" | "document" | null
	>(null);
	const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
	const [selectedFileType, setSelectedFileType] = useState<
		"diagram" | "form" | "document" | null
	>(null);
	const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const directoryUrlId = searchParams.get("directoryId") ?? "root";
	const { data: session, status } = useSession();
	const router = useRouter();

	// Show welcome dialog if newUser parameter is present
	useEffect(() => {
		if (searchParams.get("newUser") === "true") {
			setWelcomeDialogOpen(true);
		}
	}, [searchParams]);

	// Handle welcome dialog close
	const handleWelcomeDialogClose = () => {
		setWelcomeDialogOpen(false);
		// Remove the newUser parameter from the URL
		const newParams = new URLSearchParams(searchParams);
		newParams.delete("newUser");
		router.replace(`/dashboard/files?${newParams.toString()}`);
	};

	const { data: currentDirectoryData, isLoading } = useQuery({
		queryKey: ["directory", directoryUrlId],
		queryFn: async () => {
			const response = await fetch(`/api/workspace/${directoryUrlId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch directory");
			}
			const data = (await response.json()) as TDirectory;
			return data;
		},
	});

	const filteredFiles = useMemo(() => {
		if (!currentDirectoryData) {
			return;
		}
		let fileItems = [
			...currentDirectoryData.directories,
			...currentDirectoryData.documents,
			...currentDirectoryData.diagrams,
			...currentDirectoryData.forms,
		];

		console.log("select", selectItem);

		if (selectItem) {
			fileItems = fileItems.filter((item) => {
				return item.type === selectItem;
			});
		}

		if (directoryUrlId === "root") {
			fileItems = fileItems.filter((item) => {
				return item.type === "directory";
			});
		}

		return fileItems;
	}, [currentDirectoryData, selectItem, directoryUrlId]);

	const createWorkspaceItem = useMutation({
		mutationFn: async ({
			type,
			title,
			content,
		}: {
			type: "directory" | "diagram" | "form" | "document";
			title: string;
			content?: string | object;
		}) => {
			const response = await fetch("/api/workspace", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type,
					title,
					directoryId: currentDirectoryData?.id,
					content,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create workspace item");
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch the current directory data
			queryClient.invalidateQueries({
				queryKey: ["directory", directoryUrlId],
			});
		},
	});

	const handleCreateFile = (
		type: "directory" | "diagram" | "form" | "document",
	) => {
		if (type === "directory") {
			createWorkspaceItem.mutate({
				type,
				title: "New Folder",
			});
		} else {
			setSelectedFileType(type);
			setTemplateDialogOpen(true);
		}
	};

	const handleTemplateSelect = (template: {
		title: string;
		content: string;
	}) => {
		if (!selectedFileType) return;

		createWorkspaceItem.mutate({
			type: selectedFileType,
			title: template.title,
			content: template.content,
		});
	};

	const handleGoBack = () => {
		if (currentDirectoryData?.parent?.directoryId) {
			const newParams = new URLSearchParams();
			newParams.set("directoryId", currentDirectoryData.parent.id);
			router.push(`/dashboard/files?${newParams.toString()}`);
		} else {
			router.push("/dashboard/files");
		}
	};

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	return (
		<DirectoryProvider directoryUrlId={directoryUrlId}>
			<WelcomeDialog
				open={welcomeDialogOpen}
				onOpenChange={handleWelcomeDialogClose}
				onCreateFolder={() => {
					handleWelcomeDialogClose();
					handleCreateFile("directory");
				}}
			/>
			<ImageOverlayHeader
				title="Files"
				icon={<Folder className="size-8 text-primary-foreground z-20" />}
				leftToolbar={
					<>
						{directoryUrlId !== "root" && (
							<Button
								variant="secondary"
								size="icon"
								onClick={handleGoBack}
								className="hover:bg-gray-100 dark:hover:bg-mystical/30 z-10"
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
								className="flex items-center gap-2 bg-creamy text-mystical dark:bg-background dark:text-secondary-foreground"
								disabled={createWorkspaceItem.isPending}
							>
								New Item
								<Plus className="w-5 h-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="bg-background">
							<DropdownMenuItem
								onClick={() => handleCreateFile("directory")}
								className="z-30"
							>
								<FaFolder className="w-4 h-4 mr-2" />
								New Folder
							</DropdownMenuItem>
							{directoryUrlId !== "root" && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => handleCreateFile("diagram")}>
										<FaProjectDiagram className="w-4 h-4 mr-2" />
										New Diagram
									</DropdownMenuItem>
								</>
							)}
							{directoryUrlId !== "root" && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => handleCreateFile("form")}>
										<FaFileAlt className="w-4 h-4 mr-2" />
										New Form
									</DropdownMenuItem>
								</>
							)}
							{directoryUrlId !== "root" && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => handleCreateFile("document")}
									>
										<FaFileWord className="w-4 h-4 mr-2" />
										New Document
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				}
			/>

			<div className="flex items-center gap-4 pb-8">
				<div className="flex items-center space-x-1 justify-between text-muted-foreground px-4 py-2 border-b border-border w-full">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/dashboard/files">Home</BreadcrumbLink>
							</BreadcrumbItem>
							{currentDirectoryData &&
								currentDirectoryData.title !== "Home" && (
									<>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbPage>
												{currentDirectoryData?.title || "My Workspace"}
											</BreadcrumbPage>
										</BreadcrumbItem>
									</>
								)}
						</BreadcrumbList>
					</Breadcrumb>
					<div className="flex items-center space-x-2">
						{currentDirectoryData && currentDirectoryData.title !== "Home" && (
							<Select
								value={selectItem ?? undefined}
								onValueChange={(value) => {
									console.log("value", value);
									if (value === "remove") {
										setSelectItem(null);
										return;
									}
									// biome-ignore lint/suspicious/noExplicitAny: <explanation>
									setSelectItem(value as any);
								}}
							>
								<SelectTrigger className="w-[180px] border-border">
									<SelectValue placeholder="Filter Item" />
								</SelectTrigger>
								<SelectContent className="bg-background">
									<SelectItem value="remove">Remove filter</SelectItem>
									<DropdownMenuSeparator />
									<SelectItem value="directory">Folders</SelectItem>
									<DropdownMenuSeparator />
									<SelectItem value="diagram">Diagram</SelectItem>
									<DropdownMenuSeparator />
									<SelectItem value="form">Form</SelectItem>
									<DropdownMenuSeparator />
									<SelectItem value="document">Document</SelectItem>
								</SelectContent>
							</Select>
						)}

						<DropdownMenu>
							<DropdownMenuTrigger>
								<div className="p-2 border border-border rounded-lg">
									{" "}
									<LuLayoutGrid />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="mr-6 bg-background">
								<DropdownMenuItem onClick={() => setViewType("grid")}>
									Symbol View
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => setViewType("list")}>
									List View
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{filteredFiles?.length === 0 ? (
				<div className="text-center text-gray-500 py-8">
					<p className="mb-4">
						No folders or files yet. Create one to get started!
					</p>
					<Button onClick={() => handleCreateFile("directory")}>
						<Plus className="w-4 h-4 mr-2" />
						Create Your First Folder
					</Button>
				</div>
			) : (
				filteredFiles && (
					<div className="space-y-8 px-4">
						<FilesLayout
							currentDirectoryData={filteredFiles}
							viewType={viewType}
							selectItem={selectItem}
							directoryUrlId={directoryUrlId}
						/>
					</div>
				)
			)}

			{selectedFileType && (
				<TemplateSelectionDialog
					type={selectedFileType}
					open={templateDialogOpen}
					onOpenChange={setTemplateDialogOpen}
					onSelect={handleTemplateSelect}
				/>
			)}
		</DirectoryProvider>
	);
}
