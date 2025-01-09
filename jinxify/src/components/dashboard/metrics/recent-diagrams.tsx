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

export function RecentDiagrams() {
	const { data: diagrams = [] } = useQuery({
		queryKey: ["diagrams"],
		queryFn: async function fetchDiagrams() {
			const response = await fetch("/api/diagram");
			if (!response.ok) throw new Error("Failed to fetch diagrams");
			const json = await response.json();
			return json as TDiagram[];
		},
	});

	return (
		<Card className="xl:col-span-2 bg-white border border-gray-200 rounded-lg shadow-md transition-shadow">
			<CardHeader className="flex flex-row items-center">
				<div className="grid gap-2">
					<CardTitle>Recent Diagrams</CardTitle>
					<CardDescription>Your most recently updated diagrams</CardDescription>
				</div>
				<Button asChild size="sm" className="ml-auto gap-1">
					<Link href="/dashboard/files">
						View All
						<ArrowUpRight className="h-4 w-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{diagrams.slice(0, 5).map((diagram) => (
						<div key={diagram.id} className="flex items-center gap-4">
							<div className="grid gap-1">
								<p className="text-sm font-medium leading-none">
									{diagram.title}
								</p>
								<p className="text-sm text-muted-foreground">
									Last updated:{" "}
									{new Date(diagram.updatedAt).toLocaleDateString()}
								</p>
							</div>
							<Button asChild size="sm" variant="ghost" className="ml-auto">
								<Link href={`/dashboard/files/${diagram.id}`}>
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
