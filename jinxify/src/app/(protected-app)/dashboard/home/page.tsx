"use client";

import { HomeIcon } from "lucide-react";
import ImageOverlayHeader from "@/components/layout/image-overlay-header";
import { StatsCards } from "./components/stats-cards";
import { RecentDiagrams } from "./components/recent-diagrams";
import { TaskStatusChart } from "./components/task-status-chart";
import { DiagramsChart } from "./components/diagrams-chart";

export default function Home() {
	return (
		<div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden ">
			<ImageOverlayHeader
				title="Dashboard"
				icon={<HomeIcon className="size-8 text-secondary z-20" />}
			/>
			<div className="flex-1 overflow-y-auto px-4 pb-8">
				<StatsCards />
				<div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
					<RecentDiagrams />
					<TaskStatusChart />
					<DiagramsChart />
				</div>
			</div>
		</div>
	);
}
