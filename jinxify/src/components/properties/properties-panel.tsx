import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { TTask } from "@/types/db";
import { useQuery } from "@tanstack/react-query";

interface PropertiesPanelProps {
	fileId: string;
	fileType: "document" | "diagram" | "form";
	title: string;
	createdAt: Date;
	updatedAt: Date;
}

export function PropertiesPanel({
	fileId,
	fileType,
	title,
	createdAt,
	updatedAt,
}: PropertiesPanelProps) {
	const { data: tasks } = useQuery<TTask[]>({
		queryKey: ["tasks", fileId],
		queryFn: async () => {
			const response = await fetch(`/api/tasks/${fileType}/${fileId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch tasks");
			}
			return response.json();
		},
	});

	return (
		<div className="w-[350px] border-l bg-background">
			<div className="p-4 border-b">
				<h2 className="font-semibold">Properties</h2>
			</div>
			<ScrollArea className="h-[calc(100vh-3.5rem)]">
				<div className="p-4 space-y-4">
					<div>
						<h3 className="text-sm font-medium mb-2">File Details</h3>
						<div className="space-y-2">
							<div>
								<span className="text-sm text-muted-foreground">Title:</span>
								<p className="text-sm">{title}</p>
							</div>
							<div>
								<span className="text-sm text-muted-foreground">Type:</span>
								<p className="text-sm capitalize">{fileType}</p>
							</div>
							<div>
								<span className="text-sm text-muted-foreground">Created:</span>
								<p className="text-sm">
									{new Date(createdAt).toLocaleString()}
								</p>
							</div>
							<div>
								<span className="text-sm text-muted-foreground">
									Last modified:
								</span>
								<p className="text-sm">
									{new Date(updatedAt).toLocaleString()}
								</p>
							</div>
						</div>
					</div>

					<Separator />

					<div>
						<h3 className="text-sm font-medium mb-2">Related Tasks</h3>
						{tasks && tasks.length > 0 ? (
							<div className="space-y-2">
								{tasks.map((task) => (
									<div
										key={task.id}
										className="p-2 rounded-md border bg-muted/50"
									>
										<p className="text-sm font-medium">{task.title}</p>
										<p className="text-xs text-muted-foreground">
											Status: {task.status}
										</p>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">No related tasks</p>
						)}
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
