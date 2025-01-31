import { useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";
import type { TTask } from "@/types/db";

export function UpcomingTasks() {
	const { data: tasks } = useQuery<TTask[]>({
		queryKey: ["tasks"],
		queryFn: async () => {
			const response = await fetch("/api/task");
			if (!response.ok) {
				throw new Error("Failed to fetch tasks");
			}
			return response.json();
		},
	});

	console.log("tasks", tasks);

	const now = new Date();

	const overdueTasks =
		tasks?.filter((task) => {
			if (!task.dueDate || task.status === "DONE") {
				return false;
			}
			const dueDate = new Date(task.dueDate);
			return dueDate < now;
		}) || [];

	console.log("overdueTasks", overdueTasks);

	const upcomingTasks =
		tasks?.filter((task) => {
			if (!task.dueDate || task.status === "DONE") {
				return false;
			}
			const dueDate = new Date(task.dueDate);

			return dueDate >= now;
		}) || [];

	console.log("upcomingTasks", upcomingTasks);

	return (
		<Card className="col-span-1">
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Task Deadlines</CardTitle>
				<CardDescription>Overdue and upcoming tasks</CardDescription>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[300px] pr-4">
					{overdueTasks.length > 0 && (
						<div className="mb-6">
							<h3 className="font-semibold text-destructive mb-2">
								Overdue Tasks
							</h3>
							<div className="space-y-3">
								{overdueTasks.map((task) => (
									<div
										key={task.id}
										className="flex items-start justify-between p-2 rounded-lg border bg-destructive/10"
									>
										<div>
											<p className="font-medium">{task.title}</p>
											<div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
												<ClockIcon className="w-4 h-4" />
												<span>
													Due:{" "}
													{task.dueDate &&
														new Date(task.dueDate).toLocaleDateString()}
												</span>
											</div>
										</div>
										<Badge variant="destructive">{task.status}</Badge>
									</div>
								))}
							</div>
						</div>
					)}

					{upcomingTasks.length > 0 && (
						<div>
							<h3 className="font-semibold text-warning mb-2">
								Upcoming Tasks
							</h3>
							<div className="space-y-3">
								{upcomingTasks.map((task) => (
									<div
										key={task.id}
										className="flex items-start justify-between p-2 rounded-lg border bg-warning/10"
									>
										<div>
											<p className="font-medium">{task.title}</p>
											<div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
												<ClockIcon className="w-4 h-4" />
												<span>
													Due:{" "}
													{task.dueDate &&
														new Date(task.dueDate).toLocaleDateString()}
												</span>
											</div>
										</div>
										<Badge variant="secondary">{task.status}</Badge>
									</div>
								))}
							</div>
						</div>
					)}

					{overdueTasks.length === 0 && upcomingTasks.length === 0 && (
						<div className="text-center text-muted-foreground py-8">
							No upcoming or overdue tasks
						</div>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
