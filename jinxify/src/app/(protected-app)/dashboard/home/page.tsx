"use client";

import { HomeIcon } from "lucide-react";
import ImageOverlayHeader from "@/components/layout/image-overlay-header";
import { StatsCards } from "@/components/dashboard/metrics/stats-cards";
import { RecentFiles } from "@/components/dashboard/metrics/recent-files";
import { TaskStatusChart } from "@/components/dashboard/metrics/task-status-chart";
import { DiagramsChart } from "@/components/dashboard/metrics/diagrams-chart";
import { UpcomingTasks } from "@/components/dashboard/metrics/upcoming-tasks";

export default function Home() {
	return (
		<div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
			<ImageOverlayHeader
				title="Dashboard"
				icon={<HomeIcon className="size-8 text-primary-foreground z-20" />}
			/>
			<div className="flex-1 overflow-y-auto px-4 pb-8">
				<StatsCards />
				<div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
					<UpcomingTasks />
					<div className="grid gap-4 md:gap-8 lg:col-span-1 xl:col-span-2">
						<RecentFiles />
						<div className="grid gap-4 md:gap-8 lg:grid-cols-2">
							<DiagramsChart />
							<TaskStatusChart />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
