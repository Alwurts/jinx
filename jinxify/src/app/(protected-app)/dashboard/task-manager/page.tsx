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
import { Plus, Sidebar } from "lucide-react";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import type { TTask } from "@/types/db";

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
			const response = await fetch(`/api/task/${taskId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: newStatus,
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

	return (
		<div className="flex h-screen w-screen bg-gray-50">
			<AppSidebar session={session ?? null} />
			{isLoading ? (
				<DashboardSkeleton />
			) : (
				<main className="flex-1 flex flex-col ml-4 mr-4 mt-4 mb-4 p-4 bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
					<div className="flex justify-between items-center mb-6">
						<div className="flex items-center gap-4">
							<h1 className="text-2xl font-bold">Task Board</h1>
						</div>
						<div className="flex items-center gap-2">
							<SidebarTrigger className="md:hidden" />
							<Button
								onClick={handleCreateTask}
								className="flex items-center gap-2"
							>
								<Plus className="w-4 h-4" />
								Add Task
							</Button>
						</div>
					</div>

					<div className="flex-1 overflow-x-auto">
						<DragDropContext onDragEnd={handleDragEnd}>
							<div className="flex gap-4 h-full min-h-[calc(100vh-12rem)]">
								{statusColumns.map((column) => (
									<div
										key={column.id}
										className="flex-1 min-w-[280px] bg-gray-50 rounded-lg p-4"
									>
										<div className="flex items-center justify-between mb-4">
											<h3 className="font-semibold text-gray-700">
												{column.label}
											</h3>
											<span className="bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-sm">
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
														snapshot.isDraggingOver ? "bg-gray-100" : ""
													}`}
												>
													{tasks
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
																		<Card className="bg-white">
																			<CardHeader className="p-4">
																				<CardTitle className="text-sm font-medium">
																					{task.title}
																				</CardTitle>
																				<CardDescription className="text-xs mt-1">
																					{task.description}
																				</CardDescription>
																			</CardHeader>
																			<CardFooter className="p-4 pt-0 flex justify-between text-xs text-gray-500">
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
				</main>
			)}
		</div>
	);
}
