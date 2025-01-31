"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import {
	Plus,
	Sidebar,
	Link as LinkIcon,
	EyeIcon,
	FilterIcon,
	ClockIcon,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { DashboardSkeleton } from "@/components/dashboard/file-skeleton";
import { GrTask } from "react-icons/gr";
import { TaskLoadingSkeleton } from "./task-skeleton";
import type { TTask } from "@/types/db";
import { TaskDialog } from "./task-dialog";
import { useState } from "react";
import ImageOverlayHeader from "@/components/layout/image-overlay-header";
import { useSearchParams, useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GenerateTasksDialog } from "./generate-tasks-dialog";

const statusColumns = [
	{ id: "TODO", label: "To Do" },
	{ id: "IN_PROGRESS", label: "In Progress" },
	{ id: "IN_REVIEW", label: "In Review" },
	{ id: "DONE", label: "Done" },
] as const;

type StatusType = (typeof statusColumns)[number]["id"];

export default function TaskManager() {
	const { data: session, status } = useSession();
	const queryClient = useQueryClient();
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const [isGenerateTasksOpen, setIsGenerateTasksOpen] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const currentDiagramId = searchParams.get("diagramId");

	const { data: tasks, isLoading } = useQuery<TTask[]>({
		queryKey: ["tasks"],
		queryFn: async () => {
			const response = await fetch("/api/task");
			if (!response.ok) {
				throw new Error("Failed to fetch tasks");
			}
			return response.json();
		},
	});

	const createTask = useMutation({
		mutationFn: async (newTask: { title: string; description: string }) => {
			const response = await fetch("/api/task", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...newTask,
					status: "TODO",
					dueDate: null,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create task");
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const updateTaskStatus = useMutation({
		mutationFn: async ({
			taskId,
			newStatus,
		}: { taskId: string; newStatus: StatusType }) => {
			const task = tasks?.find((t) => t.id === taskId);
			const response = await fetch(`/api/task/${taskId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: newStatus,
					title: task?.title || "",
					description: task?.description || "",
					dueDate: task?.dueDate ? new Date(task.dueDate).toISOString() : null,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update task");
			}

			return response.json();
		},
		onMutate: async ({ taskId, newStatus }) => {
			await queryClient.cancelQueries({ queryKey: ["tasks"] });
			const previousTasks = queryClient.getQueryData<TTask[]>(["tasks"]);

			queryClient.setQueryData<TTask[]>(["tasks"], (old) => {
				if (!old) return [];
				return old.map((task) =>
					task.id === taskId ? { ...task, status: newStatus } : task,
				);
			});

			return { previousTasks };
		},
		onError: (err, variables, context) => {
			if (context?.previousTasks) {
				queryClient.setQueryData(["tasks"], context.previousTasks);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const handleCreateTask = () => {
		createTask.mutate({
			title: "New Task",
			description: "Add description here",
		});
	};

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		const { draggableId, destination } = result;
		const newStatus = destination.droppableId as StatusType;

		updateTaskStatus.mutate({
			taskId: draggableId,
			newStatus,
		});
	};

	// Get unique diagrams from tasks for the filter dropdown
	const uniqueDiagrams = tasks
		? Array.from(
				new Map(
					tasks
						.filter((task) => task.diagram)
						.map((task) => [
							task.diagram?.id,
							{
								id: task.diagram?.id,
								title: task.diagram?.title || "Untitled Diagram",
							},
						]),
				).values(),
			)
		: [];

	const handleDiagramFilter = (diagramId: string) => {
		const params = new URLSearchParams(searchParams);
		if (diagramId === "all") {
			params.delete("diagramId");
		} else {
			params.set("diagramId", diagramId);
		}
		router.push(`?${params.toString()}`);
	};

	// Filter tasks by diagram if a diagram is selected
	const filteredTasks = tasks?.filter((task) => {
		if (!currentDiagramId) return true;
		return task.diagram?.id === currentDiagramId;
	});

	if (isLoading) {
		return <TaskLoadingSkeleton />;
	}

	return (
		<>
			<ImageOverlayHeader
				title="Task Manager"
				icon={<GrTask className="size-8 text-primary-foreground z-20" />}
				leftToolbar={<SidebarTrigger className="md:hidden z-10 bg-secondary" />}
				rightToolbar={
					<div className="flex items-center gap-2 text-mystical">
						<Select
							value={currentDiagramId || "all"}
							onValueChange={handleDiagramFilter}
						>
							<SelectTrigger className="w-[200px] border-none bg-creamy dark:bg-background dark:text-secondary-foreground">
								<SelectValue placeholder="Filter by diagram" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All diagrams</SelectItem>
								{uniqueDiagrams.map((diagram) => (
									<SelectItem key={diagram.id} value={diagram.id ?? ""}>
										{diagram.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							onClick={() => setIsGenerateTasksOpen(true)}
							variant="secondary"
							className="flex items-center gap-2 bg-creamy dark:bg-background text-mystical dark:text-secondary-foreground"
						>
							<Plus className="w-4 h-4" />
							Generate Tasks
						</Button>

						<Button
							onClick={handleCreateTask}
							variant="secondary"
							className="flex items-center gap-2 bg-creamy text-mystical dark:bg-background dark:text-secondary-foreground"
						>
							<Plus className="w-4 h-4" />
							Add Task
						</Button>
					</div>
				}
			/>

			<GenerateTasksDialog
				open={isGenerateTasksOpen}
				onOpenChange={setIsGenerateTasksOpen}
			/>

			<TaskDialog
				taskId={selectedTaskId}
				onClose={() => setSelectedTaskId(null)}
			/>
			<div className="flex-1 overflow-x-auto p-4 mb-4">
				<DragDropContext onDragEnd={handleDragEnd}>
					<div className="flex gap-4 h-full min-h-[calc(100vh-12rem)]">
						{statusColumns.map((column) => (
							<div
								key={column.id}
								className="flex-1 min-w-[280px] bg-background rounded-lg p-4 border border-border min-h-min"
							>
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-semibold text-foreground">
										{column.label}
									</h3>
									<span className="bg-accent dark:bg-accent text-foreground rounded-full px-2 py-1 text-sm">
										{tasks?.filter((task) => task.status === column.id)
											.length || 0}
									</span>
								</div>
								<Droppable droppableId={column.id}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className={`space-y-3 min-h-[200px] ${
												snapshot.isDraggingOver
													? "bg-accent/50 dark:bg-accent/50"
													: ""
											}`}
										>
											{filteredTasks
												?.filter((task) => task.status === column.id)
												.map((task, index) => (
													<Draggable
														key={task.id}
														draggableId={task.id}
														index={index}
													>
														{(provided, snapshot) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className={`${
																	snapshot.isDragging ? "opacity-50" : ""
																}`}
															>
																<Card
																	className="bg-background cursor-pointer hover:shadow-md transition-shadow dark:border-border dark:hover:bg-accent/50"
																	onClick={() => setSelectedTaskId(task.id)}
																>
																	<CardHeader className="p-4">
																		<CardTitle className="text-sm font-medium text-foreground dark:text-foreground">
																			{task.title}
																		</CardTitle>
																		<CardDescription className="text-xs mt-1 line-clamp-2 dark:text-muted-foreground">
																			{task.description}
																		</CardDescription>
																	</CardHeader>
																	<CardContent className="px-4 pb-2">
																		{task.diagram ? (
																			<div className="flex items-center gap-1 text-xs text-muted-foreground">
																				<LinkIcon className="h-3 w-3" />
																				<span>
																					{task.diagram.title ||
																						"Untitled Diagram"}
																				</span>
																			</div>
																		) : (
																			<div className="flex items-center gap-1 text-xs text-muted-foreground italic">
																				<LinkIcon className="h-3 w-3" />
																				<span>No diagram linked</span>
																			</div>
																		)}
																		{task.dueDate && (
																			<div className="flex items-center gap-1 text-xs mt-2">
																				<ClockIcon className="h-3 w-3" />
																				<span
																					className={`${
																						new Date(task.dueDate) < new Date()
																							? "text-destructive"
																							: "text-muted-foreground"
																					}`}
																				>
																					Due:{" "}
																					{new Date(
																						task.dueDate,
																					).toLocaleDateString()}
																				</span>
																			</div>
																		)}
																	</CardContent>
																	<CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
																		<span>
																			Created:{" "}
																			{new Date(
																				task.createdAt,
																			).toLocaleDateString()}
																		</span>
																		<span>ID: {task.id.slice(0, 8)}</span>
																	</CardFooter>
																</Card>
															</div>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						))}
					</div>
				</DragDropContext>
			</div>
		</>
	);
}
