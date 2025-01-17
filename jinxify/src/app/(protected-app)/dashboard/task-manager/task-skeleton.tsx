"use client";

import { Skeleton } from "@/components/ui/skeleton";

const statusColumns = [
	{ id: "TODO", label: "To Do" },
	{ id: "IN_PROGRESS", label: "In Progress" },
	{ id: "IN_REVIEW", label: "In Review" },
	{ id: "DONE", label: "Done" },
] as const;

export function TaskLoadingSkeleton() {
	return (
		<div className="flex-1 overflow-x-auto p-4 bg-background">
			<div className="flex gap-4 h-full min-h-[calc(100vh-12rem)]">
				{statusColumns.map((column) => (
					<div
						key={column.id}
						className="flex-1 min-w-[280px] bg-muted/50 dark:bg-muted/50 rounded-lg p-4"
					>
						<div className="flex items-center justify-between mb-4">
							<Skeleton className="h-6 w-24 dark:bg-accent" />
							<Skeleton className="h-6 w-8 rounded-full dark:bg-accent" />
						</div>
						<div className="space-y-3 min-h-[200px]">
							{Array.from({ length: 3 }).map((_, index) => (
								<div key={`${column.id}-skeleton-${index}`} className="w-full">
									<div className="bg-background dark:bg-background rounded-lg p-4 border dark:border-border">
										<div className="space-y-4">
											<div>
												<Skeleton className="h-4 w-3/4 mb-2 dark:bg-muted" />
												<Skeleton className="h-3 w-1/2 dark:bg-muted" />
											</div>
											<div className="flex items-center gap-1">
												<Skeleton className="h-3 w-3 dark:bg-muted" />
												<Skeleton className="h-3 w-24 dark:bg-muted" />
											</div>
											<div className="flex justify-between items-center pt-2">
												<Skeleton className="h-3 w-20 dark:bg-muted" />
												<Skeleton className="h-3 w-16 dark:bg-muted" />
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
