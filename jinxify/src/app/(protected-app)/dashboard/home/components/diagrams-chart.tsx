"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { TDiagram } from "@/types/db";

const barChartConfig = {
	diagrams: {
		label: "Diagrams",
		color: "hsl(var(--chart1))",
	},
	label: {
		color: "hsl(var(--foreground))",
	},
} satisfies ChartConfig;

export function DiagramsChart() {
	const { data: diagrams = [] } = useQuery({
		queryKey: ["diagrams"],
		queryFn: async () => {
			const response = await fetch("/api/diagram");
			if (!response.ok) throw new Error("Failed to fetch diagrams");
			const json = (await response.json()) as TDiagram[];
			return json;
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
		<Card className="xl:col-span-2">
			<CardHeader>
				<CardTitle>Diagrams Created by Month</CardTitle>
				<CardDescription>{new Date().getFullYear()}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={barChartConfig}>
					<BarChart
						data={barChartData}
						layout="vertical"
						margin={{
							right: 16,
						}}
					>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey="month"
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
							hide
						/>
						<XAxis dataKey="diagrams" type="number" hide />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Bar
							dataKey="diagrams"
							layout="vertical"
							fill={barChartConfig.diagrams.color}
							radius={4}
							stroke="hsl(var(--background))"
						>
							<LabelList
								dataKey="month"
								position="insideLeft"
								offset={8}
								className="fill-foreground"
								fontSize={12}
							/>
							<LabelList
								dataKey="diagrams"
								position="right"
								offset={8}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
