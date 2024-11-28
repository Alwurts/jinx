"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormMessage,
	FormDescription,
	FormControl,
	FormLabel,
	FormItem,
	FormField,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

export function GenerateDiagramDialog({
	open,
	onOpenChange,
	onGenerated,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onGenerated: (xml: string) => Promise<void>;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Generate BPMN Diagram</DialogTitle>
					<DialogDescription>
						Describe the process you want to create and AI will generate a BPMN
						diagram for you.
					</DialogDescription>
				</DialogHeader>
				<GenerateDiagramForm setOpen={onOpenChange} onGenerated={onGenerated} />
			</DialogContent>
		</Dialog>
	);
}

const generateDiagramSchema = z.object({
	input: z.string().min(1, "Prompt is required"),
});

function GenerateDiagramForm({
	setOpen,
	onGenerated,
}: {
	setOpen: (open: boolean) => void;
	onGenerated: (xml: string) => Promise<void>;
}) {
	const form = useForm<z.infer<typeof generateDiagramSchema>>({
		resolver: zodResolver(generateDiagramSchema),
		defaultValues: {
			input: "",
		},
	});

	const generateDiagramMutation = useMutation({
		mutationFn: async (values: z.infer<typeof generateDiagramSchema>) => {
			const res = await fetch("/api/ai", {
				method: "POST",
				body: JSON.stringify(values),
			});
			return await res.json();
		},
		onSuccess: async ({ xml }) => {
			console.log("xml", xml);
			await onGenerated(xml);
			form.reset();
			setOpen(false);
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((values) =>
					generateDiagramMutation.mutate(values),
				)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="input"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Your idea</FormLabel>
							<FormControl>
								<Textarea
									disabled={generateDiagramMutation.isPending}
									placeholder="Example..."
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Describe the process you want to create.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					disabled={generateDiagramMutation.isPending}
					type="submit"
					className={cn(
						"w-full",
						generateDiagramMutation.isPending && "animate-pulse",
					)}
				>
					{generateDiagramMutation.isPending ? "Generating..." : "Generate"}
				</Button>
			</form>
		</Form>
	);
}
