"use client";

import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { TDiagram } from "@/types/db";

const chartConfig = {
	diagrams: {
		label: "Diagrams",
		color: "hsl(var(--chart1))",
	},
};

export function DiagramsChart() {
	const { data: diagrams = [] } = useQuery({
		queryKey: ["diagrams"],
		queryFn: async () => {
			const response = await fetch("/api/diagram");
			if (!response.ok) throw new Error("Failed to fetch diagrams");
			return (await response.json()) as TDiagram[];
		},
	});

	const diagramsByMonth = diagrams.reduce(
		(acc, diagram) => {
			const month = new Date(diagram.createdAt).toLocaleString("default", {
				month: "long",
			});
			acc[month] = (acc[month] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	const barChartData = Object.entries(diagramsByMonth).map(
		([month, count]) => ({
			month,
			diagrams: count,
		}),
	);

	return (
		<Card className="bg-white border border-gray-200 rounded-lg shadow-md transition-shadow">
			<CardHeader>
				<CardTitle>Bar Chart</CardTitle>
				<CardDescription>{new Date().getFullYear()}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={barChartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<YAxis hide />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							dataKey="diagrams"
							fill={chartConfig.diagrams.color}
							radius={8}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="leading-none text-muted-foreground">
					Showing diagrams created per month for {new Date().getFullYear()}
				</div>
			</CardFooter>
		</Card>
	);
}
