"use client";

import { useQuery } from "@tanstack/react-query";
import { RiProgress2Line } from "react-icons/ri";
import { IoCloudDoneOutline } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, CreditCard } from "lucide-react";
import type { TDiagram, TTask } from "@/types/db";

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
		<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-8 mt-2 ">
			<Card className="bg-white border border-gray-200 rounded-lg shadow-md transition-shadow">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Diagrams</CardTitle>
					<Activity className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{diagrams.length}</div>
					<p className="text-xs text-muted-foreground">
						Total diagrams created
					</p>
				</CardContent>
			</Card>
			<Card className="bg-white border border-gray-200 rounded-lg shadow-md transition-shadow">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{tasks.length}</div>
					<p className="text-xs text-muted-foreground">
						Tasks across all diagrams
					</p>
				</CardContent>
			</Card>
			<Card className="bg-white border border-gray-200 rounded-lg shadow-md transition-shadow">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Tasks Done</CardTitle>
					<IoCloudDoneOutline className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{taskStatusCounts.DONE || 0}</div>
					<p className="text-xs text-muted-foreground">Completed tasks</p>
				</CardContent>
			</Card>
			<Card className="bg-white border border-gray-200 rounded-lg shadow-md transition-shadow">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">In Progress</CardTitle>
					<RiProgress2Line className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{taskStatusCounts.IN_PROGRESS || 0}
					</div>
					<p className="text-xs text-muted-foreground">Tasks in progress</p>
				</CardContent>
			</Card>
		</div>
	);
}
