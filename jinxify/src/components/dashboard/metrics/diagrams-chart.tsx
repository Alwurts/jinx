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
import type { ChartConfig } from "@/components/ui/chart";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { TDiagram, TDocument, TForm } from "@/types/db";

const chartConfig = {
	diagrams: {
		label: "Diagrams",
		color: "hsl(var(--chart1))",
	},
	documents: {
		label: "Documents",
		color: "hsl(var(--chart2))",
	},
	forms: {
		label: "Forms",
		color: "hsl(var(--chart3))",
	},
} satisfies ChartConfig;

export function DiagramsChart() {
	const { data: diagrams = [] } = useQuery({
		queryKey: ["diagrams"],
		queryFn: async () => {
			const response = await fetch("/api/diagram");
			if (!response.ok) throw new Error("Failed to fetch diagrams");
			return (await response.json()) as TDiagram[];
		},
	});

	const { data: documents = [] } = useQuery({
		queryKey: ["documents"],
		queryFn: async () => {
			const response = await fetch("/api/document");
			if (!response.ok) throw new Error("Failed to fetch documents");
			return (await response.json()) as TDocument[];
		},
	});

	const { data: forms = [] } = useQuery({
		queryKey: ["forms"],
		queryFn: async () => {
			const response = await fetch("/api/form");
			if (!response.ok) throw new Error("Failed to fetch forms");
			return (await response.json()) as TForm[];
		},
	});

	const today = new Date().toLocaleDateString();
	type DataItem = { createdAt: Date };

	const aggregateByMonth = (items: DataItem[]): Record<string, number> =>
		items.reduce((acc: Record<string, number>, item: DataItem) => {
			const month = new Date(item.createdAt).toLocaleString("default", {
				month: "long",
			});
			acc[month] = (acc[month] || 0) + 1;
			return acc;
		}, {});

	const diagramsByMonth = aggregateByMonth(diagrams);
	const documentsByMonth = aggregateByMonth(documents);
	const formsByMonth = aggregateByMonth(forms);

	const barChartData = Object.entries(diagramsByMonth).map(
		([month, count]) => ({
			month,
			diagrams: count,
			documents: documentsByMonth[month] || 0,
			forms: formsByMonth[month] || 0,
		}),
	);

	return (
		<Card className="bg-background">
			<CardHeader>
				<CardTitle className="text-foreground">Creation of Files</CardTitle>
				<CardDescription className="text-muted-foreground">
					{today}
				</CardDescription>
			</CardHeader>
			<CardContent className="text-foreground">
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={barChartData}>
						<CartesianGrid vertical={false} stroke="hsl(var(--border))" />
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
							stroke="hsl(var(--muted-foreground))"
						/>
						<YAxis hide />
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									hideLabel
									className="bg-popover border-border text-foreground"
								/>
							}
						/>
						<Bar
							dataKey="diagrams"
							fill={chartConfig.diagrams.color}
							stackId="a"
							radius={[0, 0, 4, 4]}
						/>
						<Bar
							dataKey="documents"
							fill={chartConfig.documents.color}
							stackId="a"
							radius={[0, 0, 0, 0]}
						/>
						<Bar
							dataKey="forms"
							fill={chartConfig.forms.color}
							stackId="a"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="leading-none text-muted-foreground">
					Shows files created per month for {new Date().getFullYear()}
				</div>
			</CardFooter>
		</Card>
	);
}
