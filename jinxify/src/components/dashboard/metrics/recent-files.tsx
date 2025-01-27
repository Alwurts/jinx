"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { TDiagram } from "@/types/db";
import { form } from "@/server/db/schema";

type TFile = {
	id: string;
	title: string;
	updatedAt: string;
};
export function RecentFiles() {
	const diagramsQuery = useQuery({
		queryKey: ["diagrams"],
		queryFn: async function fetchDiagrams() {
			const response = await fetch("/api/diagram");
			if (!response.ok) throw new Error("Failed to fetch diagrams");
			const json = await response.json();
			return json as TFile[];
		},
	});
	const formsQuery = useQuery({
		queryKey: ["forms"],
		queryFn: async function fetchDiagrams() {
			const response = await fetch("/api/form");
			if (!response.ok) throw new Error("Failed to fetch forms");
			const json = await response.json();
			return json as TFile[];
		},
	});
	const documentsQuery = useQuery({
		queryKey: ["documents"],
		queryFn: async function fetchDiagrams() {
			const response = await fetch("/api/document");
			if (!response.ok) throw new Error("Failed to fetch document");
			const json = await response.json();
			return json as TFile[];
		},
	});

	const combinedFiles = [
		...(diagramsQuery.data || []),
		...(formsQuery.data || []),
		...(documentsQuery.data || []),
	]
		.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
		)
		.slice(0, 4);

	return (
		<Card className="xl:col-span-2 bg-white">
			<CardHeader className="flex flex-row items-center">
				<div className="grid gap-2">
					<CardTitle className="text-foreground">Recent Files</CardTitle>
					<CardDescription className="text-muted-foreground">
						Your most recently updated files
					</CardDescription>
				</div>
				<Button asChild size="sm" className="ml-auto gap-1 hover:bg-accent/50">
					<Link href="/dashboard/files">
						View All
						<ArrowUpRight className="h-4 w-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{combinedFiles.map((file) => (
						<div
							key={file.id}
							className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent/50 transition-colors"
						>
							<div className="grid gap-1">
								<p className="text-sm font-medium leading-none text-foreground">
									{file.title}
								</p>
								<p className="text-sm text-muted-foreground">
									Last updated: {new Date(file.updatedAt).toLocaleDateString()}
								</p>
							</div>
							<Button
								asChild
								size="sm"
								variant="ghost"
								className="ml-auto hover:bg-accent/50"
							>
								<Link
									href={
										/*@ts-ignore*/
										file?.type === "form"
											? `/form/${file.id}`
											: /*@ts-ignore*/
												file?.type === "document"
												? `/document/${file.id}`
												: `/diagram/${file.id}`
									}
								>
									Open
									<ArrowUpRight className="h-4 w-4 ml-1" />
								</Link>
							</Button>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
