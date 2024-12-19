"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Trash, Link as LucideLink, ExternalLink } from "lucide-react";
import type { TTask } from "@/types/db";
import { useState } from "react";
import { DiagramSelectionDialog } from "./diagram-selection-dialog";
import Link from "next/link";

const STATUS_OPTIONS = [
	{ value: "TODO", label: "To Do" },
	{ value: "IN_PROGRESS", label: "In Progress" },
	{ value: "IN_REVIEW", label: "In Review" },
	{ value: "DONE", label: "Done" },
] as const;

interface TaskDialogContentProps {
	taskId: string;
	onClose: () => void;
}

export function TaskDialogContent({ taskId, onClose }: TaskDialogContentProps) {
	const queryClient = useQueryClient();
	const [editingTitle, setEditingTitle] = useState(false);
	const [editingDescription, setEditingDescription] = useState(false);
	const [tempTitle, setTempTitle] = useState("");
	const [tempDescription, setTempDescription] = useState("");
	const [showDiagramDialog, setShowDiagramDialog] = useState(false);

	const { data: task, isLoading } = useQuery<TTask>({
		queryKey: ["task", taskId],
		queryFn: async () => {
			const response = await fetch(`/api/task/${taskId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch task");
			}
			return response.json();
		},
	});

	const updateTask = useMutation({
		mutationFn: async (updates: {
			title?: string;
			description?: string;
			status?: string;
		}) => {
			const response = await fetch(`/api/task/${taskId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updates),
			});
			if (!response.ok) throw new Error("Failed to update task");
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["task", taskId] });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
			onClose();
		},
	});

	const linkDiagram = useMutation({
		mutationFn: async (diagramId: string) => {
			const response = await fetch(`/api/task/${taskId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ diagramId }),
			});
			if (!response.ok) throw new Error("Failed to link diagram");
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["task", taskId] });
			setShowDiagramDialog(false);
		},
	});

	const handleStartEditTitle = () => {
		setEditingTitle(true);
		setTempTitle(task?.title || "");
	};

	const handleStartEditDescription = () => {
		setEditingDescription(true);
		setTempDescription(task?.description || "");
	};

	const handleSaveTitle = async () => {
		await updateTask.mutateAsync({ title: tempTitle });
		setEditingTitle(false);
	};

	const handleSaveDescription = async () => {
		await updateTask.mutateAsync({ description: tempDescription });
		setEditingDescription(false);
	};

	const handleStatusChange = (newStatus: string) => {
		updateTask.mutate({ status: newStatus });
	};

	const handleLinkDiagram = (diagramId: string) => {
		linkDiagram.mutate(diagramId);
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
				<Skeleton className="h-20 w-full" />
			</div>
		);
	}

	if (!task) return null;

	return (
		<>
			<DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
				{editingTitle ? (
					<div className="flex-1">
						<Input
							value={tempTitle}
							onChange={(e) => setTempTitle(e.target.value)}
							className="w-full mb-2"
							autoFocus
						/>
						<div className="flex justify-end gap-2">
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setEditingTitle(false)}
							>
								Cancel
							</Button>
							<Button size="sm" onClick={handleSaveTitle}>
								Save
							</Button>
						</div>
					</div>
				) : (
					<DialogTitle
						onDoubleClick={handleStartEditTitle}
						className="cursor-text hover:text-blue-600 transition-colors"
					>
						{task.title}
					</DialogTitle>
				)}
			</DialogHeader>

			<div className="mt-6 space-y-6">
				<div>
					<h3 className="font-medium text-sm text-gray-700 mb-2">
						Description
					</h3>
					{editingDescription ? (
						<div>
							<Textarea
								value={tempDescription}
								onChange={(e) => setTempDescription(e.target.value)}
								className="min-h-[100px] resize-none mb-2"
								autoFocus
							/>
							<div className="flex justify-end gap-2">
								<Button
									size="sm"
									variant="ghost"
									onClick={() => setEditingDescription(false)}
								>
									Cancel
								</Button>
								<Button size="sm" onClick={handleSaveDescription}>
									Save
								</Button>
							</div>
						</div>
					) : (
						<p
							onDoubleClick={handleStartEditDescription}
							className="text-sm text-gray-600 cursor-text hover:text-blue-600 transition-colors"
						>
							{task.description}
						</p>
					)}
				</div>

				<div>
					<h3 className="font-medium text-sm text-gray-700 mb-2">Status</h3>
					<Select value={task.status} onValueChange={handleStatusChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{STATUS_OPTIONS.map((status) => (
								<SelectItem key={status.value} value={status.value}>
									{status.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<h3 className="font-medium text-sm text-gray-700 mb-2">
						Linked Diagram
					</h3>
					{task.diagram ? (
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">
								{task.diagram.title || "Untitled Diagram"}
							</span>
							<Link
								href={`/diagram/${task.diagram.id}`}
								className="text-blue-600 hover:text-blue-800"
							>
								<ExternalLink className="h-4 w-4" />
							</Link>
						</div>
					) : (
						<p className="text-sm text-gray-500">No diagram linked</p>
					)}
				</div>

				<div>
					<div className="text-sm text-gray-500">
						Created {new Date(task.createdAt).toLocaleDateString()}
					</div>
					<div className="text-xs text-gray-400">ID: {task.id.slice(0, 8)}</div>
				</div>
			</div>

			<div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowDiagramDialog(true)}
					className="mr-auto"
				>
					<LucideLink className="h-4 w-4 mr-2" />
					{task.diagram ? "Change Linked Diagram" : "Link Diagram"}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => deleteTask.mutate()}
					className="text-red-600 hover:bg-red-100 hover:text-red-700"
				>
					<Trash className="h-4 w-4 mr-2" />
					Delete Task
				</Button>
			</div>

			<DiagramSelectionDialog
				open={showDiagramDialog}
				onClose={() => setShowDiagramDialog(false)}
				onSelect={handleLinkDiagram}
				currentDiagramId={task.diagram?.id}
			/>
		</>
	);
}

interface TaskDialogProps {
	taskId: string | null;
	onClose: () => void;
}

export function TaskDialog({ taskId, onClose }: TaskDialogProps) {
	return (
		<Dialog open={taskId !== null} onOpenChange={() => onClose()}>
			<DialogContent className="pb-16">
				{taskId && <TaskDialogContent taskId={taskId} onClose={onClose} />}
			</DialogContent>
		</Dialog>
	);
}
