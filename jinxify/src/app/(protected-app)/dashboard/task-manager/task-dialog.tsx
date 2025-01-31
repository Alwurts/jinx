"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ResourceSelectionDialog } from "./resource-selection-dialog";
import { Trash, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { TTask } from "@/types/db";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Title is required.",
	}),
	description: z.string().min(1, {
		message: "Description is required.",
	}),
	status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
	dueDate: z.date().nullable(),
});

interface TaskDialogProps {
	taskId: string | null;
	onClose: () => void;
}

export function TaskDialog({ taskId, onClose }: TaskDialogProps) {
	const [resourceType, setResourceType] = useState<
		"diagram" | "document" | "form" | null
	>(null);
	const { toast } = useToast();
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: task, isLoading } = useQuery<TTask>({
		queryKey: ["task", taskId],
		queryFn: async () => {
			if (!taskId) return null;
			const response = await fetch(`/api/task/${taskId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch task");
			}
			return response.json();
		},
		enabled: !!taskId,
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: {
			title: task?.title || "",
			description: task?.description || "",
			status: task?.status || "TODO",
			dueDate: task?.dueDate ? new Date(task.dueDate) : null,
		},
	});

	const updateTask = useMutation({
		mutationFn: async (
			values: z.infer<typeof formSchema> & {
				linkedDiagramId?: string;
				linkedDocumentId?: string;
				linkedFormId?: string;
			},
		) => {
			if (!taskId) return;
			const response = await fetch(`/api/task/${taskId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...values,
					dueDate: values.dueDate?.toISOString() || null,
				}),
			});
			if (!response.ok) throw new Error("Failed to update task");
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["task", taskId] });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			toast({
				title: "Task updated",
				description: "Your task has been updated successfully.",
			});
		},
	});

	const deleteTask = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/task/${taskId}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete task");
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			toast({
				title: "Task deleted",
				description: "Your task has been deleted successfully.",
			});
			onClose();
		},
	});

	const handleResourceSelect = async (resourceId: string) => {
		if (!taskId) return;

		const updates = {
			linkedDiagramId: task?.linkedDiagramId,
			linkedDocumentId: task?.linkedDocumentId,
			linkedFormId: task?.linkedFormId,
		};

		switch (resourceType) {
			case "diagram":
				updates.linkedDiagramId = resourceId || null;
				break;
			case "document":
				updates.linkedDocumentId = resourceId || null;
				break;
			case "form":
				updates.linkedFormId = resourceId || null;
				break;
		}

		// @ts-ignore
		await updateTask.mutateAsync({
			...form.getValues(),
			...updates,
		});

		setResourceType(null);
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updateTask.mutateAsync({
				...values,
				linkedDiagramId: task?.linkedDiagramId ?? undefined,
				linkedDocumentId: task?.linkedDocumentId ?? undefined,
				linkedFormId: task?.linkedFormId ?? undefined,
			});
			onClose();
		} catch (error) {
			console.error("Error saving task:", error);
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		}
	}

	return (
		<>
			<Dialog open={!!taskId} onOpenChange={() => onClose()}>
				<DialogContent className="pb-16">
					<DialogHeader>
						<DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
						<DialogDescription>
							{task
								? "Make changes to your task here."
								: "Add a new task to your board."}
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="pb-4 space-y-4"
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="TODO">To Do</SelectItem>
												<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
												<SelectItem value="IN_REVIEW">In Review</SelectItem>
												<SelectItem value="DONE">Done</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Due Date</FormLabel>
										<Collapsible>
											<CollapsibleTrigger asChild>
												<FormControl>
													<Button
														type="button"
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal flex justify-between items-center",
															!field.value && "text-muted-foreground",
														)}
													>
														<span>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span>Pick a date</span>
															)}
														</span>
														<div className="flex items-center gap-2">
															<CalendarIcon className="h-4 w-4 opacity-50" />
															<ChevronDown className="h-4 w-4 opacity-50" />
														</div>
													</Button>
												</FormControl>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<div className="pt-2">
													<Calendar
														mode="single"
														selected={field.value || undefined}
														onSelect={(date) => {
															field.onChange(date);
														}}
														initialFocus
														disabled={(date) =>
															date < new Date(new Date().setHours(0, 0, 0, 0))
														}
														className="rounded-md border"
													/>
													{field.value && (
														<Button
															type="button"
															variant="ghost"
															className="w-full mt-2"
															onClick={() => field.onChange(null)}
														>
															Clear date
														</Button>
													)}
												</div>
											</CollapsibleContent>
										</Collapsible>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div>
								<FormLabel>Linked Files</FormLabel>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => setResourceType("diagram")}
											className="min-w-32"
										>
											{task?.diagram
												? `Diagram: ${task.diagram.title || "Untitled"}`
												: "Link Diagram"}
										</Button>
										{task?.diagram && (
											<>
												<Link
													href={`/diagram/${task.diagram.id}`}
													className="text-blue-600 hover:text-blue-800"
												>
													<ExternalLink className="h-4 w-4" />
												</Link>
												<Button
													type="button"
													variant="ghost"
													onClick={() => handleResourceSelect("")}
												>
													Remove
												</Button>
											</>
										)}
									</div>
									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => setResourceType("document")}
											className="min-w-32"
										>
											{task?.document
												? `Document: ${task.document.title || "Untitled"}`
												: "Link Document"}
										</Button>
										{task?.document && (
											<>
												<Link
													href={`/document/${task.document.id}`}
													className="text-blue-600 hover:text-blue-800"
												>
													<ExternalLink className="h-4 w-4" />
												</Link>
												<Button
													type="button"
													variant="ghost"
													onClick={() => handleResourceSelect("")}
												>
													Remove
												</Button>
											</>
										)}
									</div>
									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => setResourceType("form")}
											className="min-w-32"
										>
											{task?.form
												? `Form: ${task.form.title || "Untitled"}`
												: "Link Form"}
										</Button>
										{task?.form && (
											<>
												<Link
													href={`/form/${task.form.id}`}
													className="text-blue-600 hover:text-blue-800"
												>
													<ExternalLink className="h-4 w-4" />
												</Link>
												<Button
													type="button"
													variant="ghost"
													onClick={() => handleResourceSelect("")}
												>
													Remove
												</Button>
											</>
										)}
									</div>
								</div>
							</div>

							{task && (
								<div className="flex flex-row space-x-4 items-center text-sm text-gray-500">
									<div>
										Created {new Date(task.createdAt).toLocaleDateString()}
									</div>
									<div>ID: {task.id.slice(0, 8)}</div>
								</div>
							)}

							<div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 dark:bg-accent flex justify-between rounded-b-lg">
								{task && (
									<Button
										type="button"
										variant="ghost"
										onClick={() => deleteTask.mutate()}
										className="text-red-600 hover:bg-red-100 hover:text-red-700"
									>
										<Trash className="h-4 w-4" />
										Delete Task
									</Button>
								)}
								<Button type="submit">
									{task ? "Save changes" : "Create task"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<ResourceSelectionDialog
				open={resourceType !== null}
				onOpenChange={() => setResourceType(null)}
				onSelect={handleResourceSelect}
				type={resourceType || "diagram"}
				currentResourceId={
					resourceType === "diagram"
						? (task?.linkedDiagramId ?? undefined)
						: resourceType === "document"
							? (task?.linkedDocumentId ?? undefined)
							: resourceType === "form"
								? (task?.linkedFormId ?? undefined)
								: undefined
				}
			/>
		</>
	);
}
