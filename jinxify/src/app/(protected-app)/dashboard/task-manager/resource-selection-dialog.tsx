import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import type { TDocument, TDiagram, TForm } from "@/types/db";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ResourceType = "document" | "diagram" | "form";
type Resource = TDocument | TDiagram | TForm;

interface ResourceSelectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (resourceId: string) => void;
	type: ResourceType;
	currentResourceId?: string;
}

const resourceTypeConfig = {
	document: {
		title: "Select Document",
		endpoint: "/api/document",
		queryKey: "documents",
	},
	diagram: {
		title: "Select Diagram",
		endpoint: "/api/diagram",
		queryKey: "diagrams",
	},
	form: {
		title: "Select Form",
		endpoint: "/api/form",
		queryKey: "forms",
	},
} as const;

export function ResourceSelectionDialog({
	open,
	onOpenChange,
	onSelect,
	type,
	currentResourceId,
}: ResourceSelectionDialogProps) {
	const config = resourceTypeConfig[type];

	const { data: resources, isLoading } = useQuery<Resource[]>({
		queryKey: [config.queryKey],
		queryFn: async () => {
			const response = await fetch(config.endpoint);
			if (!response.ok) {
				throw new Error(`Failed to fetch ${type}s`);
			}
			return response.json();
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{config.title}</DialogTitle>
				</DialogHeader>
				<ScrollArea className="h-[300px] pr-4">
					<div className="space-y-2">
						{isLoading ? (
							Array(3)
								.fill(0)
								.map((_, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<Skeleton key={i} className="h-12 w-full" />
								))
						) : resources?.length === 0 ? (
							<p className="text-sm text-muted-foreground">No {type}s found</p>
						) : (
							resources?.map((resource) => (
								<Button
									key={resource.id}
									type="button"
									onClick={() => {
										onSelect(resource.id);
										onOpenChange(false);
									}}
									className={cn(
										currentResourceId === resource.id && "bg-muted",
									)}
								>
									<div className="font-medium">
										{resource.title || `Untitled ${type}`}
									</div>
									<div className="text-sm text-muted-foreground">
										Last modified:{" "}
										{new Date(resource.updatedAt).toLocaleDateString()}
									</div>
								</Button>
							))
						)}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
