"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { experimental_useObject as useObject } from "ai/react";

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

	const {
		object,
		submit,
		isLoading: isGenerating,
		stop,
	} = useObject({
		api: "/api/stream-ai",
		schema: z.object({
			xml: z
				.string()
				.describe("The BPMN 2.0 XML for the given process description."),
		}),
	});

	useEffect(() => {
		if (object?.xml) {
			onGenerated(object.xml);
		}
	}, [object, onGenerated]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(submit)} className="space-y-8">
				<FormField
					control={form.control}
					name="input"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Your idea</FormLabel>
							<FormControl>
								<Textarea
									disabled={isGenerating}
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

				<div className="h-64 w-[370px] border-2 border-border rounded-lg max-h-64 overflow-y-auto p-2 text-xs">
					<pre>{object?.xml}</pre>
				</div>

				<Button
					disabled={isGenerating}
					type="submit"
					className={cn("w-full", isGenerating && "animate-pulse")}
				>
					{isGenerating ? "Generating..." : "Generate"}
				</Button>
			</form>
		</Form>
	);
}
