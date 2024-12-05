"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
	return (
		<div className="flex h-screen w-screen bg-gray-50">
			<Skeleton className="w-64 h-full" />
			<main className="flex-1 ml-4 mr-4 mt-4 mb-4 p-4 bg-white shadow-xl rounded-lg border border-gray-200">
				<Skeleton className="h-8 w-1/4 mb-6" />
				<div className="space-y-8">
					{Array.from({ length: 2 }).map((_, sectionIndex) => (
						<div
							key={`section-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								sectionIndex
							}`}
						>
							<Skeleton className="h-6 w-1/6 mb-4" />
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{Array.from({ length: 4 }).map((_, cardIndex) => (
									<Skeleton
										key={`card-${sectionIndex}-${
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											cardIndex
										}`}
										className="h-24"
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}
