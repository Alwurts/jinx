"use client";

import { useQuery } from "@tanstack/react-query";
import { RiProgress2Line } from "react-icons/ri";
import { IoCloudDoneOutline } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, CreditCard } from "lucide-react";
import type { TDiagram, TTask, TDocument, TForm } from "@/types/db";
import { ImFilesEmpty } from "react-icons/im";
import { MdTaskAlt } from "react-icons/md";
import { BsListTask } from "react-icons/bs";

export function StatsCards() {
	const { data: diagrams = [] } = useQuery({
		queryKey: ["diagrams"],
		queryFn: async function fetchDiagrams() {
			const response = await fetch("/api/diagram");
			if (!response.ok) throw new Error("Failed to fetch diagrams");
			const json = await response.json();
			return json as TDiagram[];
		},
	});

	const { data: documents = [], isLoading: documentsLoading } = useQuery({
		queryKey: ["documents"],
		queryFn: async function fetchDocuments() {
			const response = await fetch("/api/documents"); // Adjust your endpoint for documents
			if (!response.ok) throw new Error("Failed to fetch documents");
			const json = await response.json();
			return json as TDocument[];
		},
	});

	const { data: forms = [], isLoading: formsLoading } = useQuery({
		queryKey: ["forms"],
		queryFn: async function fetchForms() {
			const response = await fetch("/api/forms"); // Adjust your endpoint for forms
			if (!response.ok) throw new Error("Failed to fetch forms");
			const json = await response.json();
			return json as TForm[];
		},
	});

	const totalFilesCreated = diagrams.length + documents.length + forms.length;

	const { data: tasks = [] } = useQuery({
		queryKey: ["tasks"],
		queryFn: async function fetchTasks() {
			const response = await fetch("/api/task");
			if (!response.ok) throw new Error("Failed to fetch tasks");
			const json = await response.json();
			return json as TTask[];
		},
	});

	const taskStatusCounts = tasks.reduce(
		(acc, task) => {
			acc[task.status] = (acc[task.status] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	return (
		<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-8 mt-2">
			<Card className="bg-background">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-foreground">
						Total Files
					</CardTitle>
					<ImFilesEmpty className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-foreground">
						{totalFilesCreated}
					</div>
					<p className="text-xs text-muted-foreground">
						All files created with jinxify
					</p>
				</CardContent>
			</Card>

			<Card className="bg-background">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-foreground">
						Total Tasks
					</CardTitle>
					<BsListTask className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-foreground">
						{tasks.length}
					</div>
					<p className="text-xs text-muted-foreground">
						All tasks in the Task Manager
					</p>
				</CardContent>
			</Card>

			<Card className="bg-background">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-foreground">
						Tasks Done
					</CardTitle>
					<MdTaskAlt className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-foreground">
						{taskStatusCounts.DONE || 0}
					</div>
					<p className="text-xs text-muted-foreground">Completed tasks</p>
				</CardContent>
			</Card>

			<Card className="bg-background">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-foreground">
						In Progress
					</CardTitle>
					<RiProgress2Line className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-foreground">
						{taskStatusCounts.IN_PROGRESS || 0}
					</div>
					<p className="text-xs text-muted-foreground">Tasks in progress</p>
				</CardContent>
			</Card>
		</div>
	);
}
