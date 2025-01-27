"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Label } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import type { TTask } from "@/types/db";

const pieChartConfig = {
	visitors: {
		label: "Tasks",
	},
	TODO: {
		label: "To Do",
		color: "hsl(var(--chart1))",
	},
	IN_PROGRESS: {
		label: "In Progress",
		color: "hsl(var(--chart2))",
	},
	IN_REVIEW: {
		label: "In Review",
		color: "hsl(var(--chart3))",
	},
	DONE: {
		label: "Done",
		color: "hsl(var(--chart4))",
	},
} satisfies ChartConfig;

export function TaskStatusChart() {
	const { data: tasks = [] } = useQuery({
		queryKey: ["tasks"],
		queryFn: async function fetchTasks() {
			const response = await fetch("/api/task");
			if (!response.ok) throw new Error("Failed to fetch tasks");
			const json = await response.json();
			return json as TTask[];
		},
	});

	const taskStatusData = [
		{
			name: "To Do",
			value: tasks.filter((t) => t.status === "TODO").length,
			fill: pieChartConfig.TODO.color,
		},
		{
			name: "In Progress",
			value: tasks.filter((t) => t.status === "IN_PROGRESS").length,
			fill: pieChartConfig.IN_PROGRESS.color,
		},
		{
			name: "In Review",
			value: tasks.filter((t) => t.status === "IN_REVIEW").length,
			fill: pieChartConfig.IN_REVIEW.color,
		},
		{
			name: "Done",
			value: tasks.filter((t) => t.status === "DONE").length,
			fill: pieChartConfig.DONE.color,
		},
	];

	const totalTasks = taskStatusData.reduce((acc, curr) => acc + curr.value, 0);

	return (
		<Card className="bg-white flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle className="text-foreground">
					Task Status Distribution
				</CardTitle>
				<CardDescription className="text-muted-foreground">
					All Tasks
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1">
				<ChartContainer
					config={pieChartConfig}
					className="mx-auto aspect-square h-[300px]"
				>
					<PieChart className="h-[300px]">
						<ChartTooltip
							content={({ payload }) => {
								if (payload?.length) {
									const data = payload[0];
									return (
										<div className="rounded-lg border bg-background p-2 shadow-sm">
											<div className="grid grid-cols-2 gap-2">
												<div className="flex flex-col">
													<span className="text-[0.70rem] uppercase text-muted-foreground">
														Status
													</span>
													<span className="font-bold text-muted-foreground">
														{data.name}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="text-[0.70rem] uppercase text-muted-foreground">
														Tasks
													</span>
													<span className="font-bold">{data.value}</span>
												</div>
											</div>
										</div>
									);
								}
								return null;
							}}
						/>
						<Pie
							data={taskStatusData}
							dataKey="value"
							nameKey="name"
							innerRadius={60}
							outerRadius={80}
							paddingAngle={2}
							cornerRadius={4}
						>
							<Label
								content={({ viewBox }) => {
									// @ts-expect-error
									const { cx, cy } = viewBox;
									return (
										<text
											x={cx}
											y={cy}
											textAnchor="middle"
											dominantBaseline="middle"
										>
											<tspan
												x={cx}
												y={cy}
												className="fill-foreground text-2xl font-bold"
											>
												{totalTasks}
											</tspan>
											<tspan
												x={cx}
												y={cy + 20}
												className="fill-muted-foreground text-sm"
											>
												Total Tasks
											</tspan>
										</text>
									);
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
