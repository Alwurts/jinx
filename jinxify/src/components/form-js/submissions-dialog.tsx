import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { TFormSubmission } from "@/types/db";
import { useQuery } from "@tanstack/react-query";

export function FormSubmissionsDialog({ formId }: { formId: string }) {
	const { data: submissions, isLoading } = useQuery<TFormSubmission[]>({
		queryKey: ["form-submissions", formId],
		queryFn: async () => {
			const response = await fetch(`/api/form/${formId}/submission`);
			if (!response.ok) {
				throw new Error("Failed to fetch submissions");
			}
			return response.json();
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">View Submissions</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl max-h-[80vh]">
				<DialogHeader>
					<DialogTitle>Form Submissions</DialogTitle>
				</DialogHeader>
				<div className="overflow-y-auto">
					{isLoading && <div>Loading submissions...</div>}
					{submissions?.length === 0 && (
						<div className="text-center py-4">No submissions yet</div>
					)}
					<div className="space-y-4">
						{submissions?.map((submission) => (
							<div
								key={submission.id}
								className="border rounded-lg p-4 space-y-2"
							>
								<div className="text-sm text-muted-foreground">
									Submitted on {new Date(submission.createdAt).toLocaleString()}
								</div>
								<div className="space-y-2">
									{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
									{Object.entries(submission.data as Record<string, any>).map(
										([key, value]) => (
											<div key={key}>
												<span className="font-medium">{key}:</span>{" "}
												<span>{String(value)}</span>
											</div>
										),
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
