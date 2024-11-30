"use client";

import { Button } from "@/components/ui/button";
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
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { experimental_useObject as useObject } from "ai/react";

const generateDiagramSchema = z.object({
    input: z.string().min(1, "Prompt is required"),
});

export function GenerateDiagramSidebar({
    onGenerated,
}: {
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
    } = useObject({
        api: "/api/stream-ai",
        schema: z.object({
            xml: z
				.string()
				.describe(
					"A XML compliant BPMN 2.0 diagram for the given process description.",
				),
		}),
	});

    useEffect(() => {
        if (object?.xml) {
            onGenerated(object.xml);
        }
    }, [object, onGenerated]);

    return (
        <div className="w-96 border-l bg-muted/10 p-6 overflow-y-auto flex flex-col h-full">
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Generate Diagram</h2>
                    <p className="text-sm text-muted-foreground">
                        Describe the process you want to create and AI will generate a BPMN
                        diagram for you.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="input"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Process Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isGenerating}
                                            placeholder="Describe your business process here..."
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Be as detailed as possible for better results.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="rounded-lg border bg-background p-3 text-xs font-mono">
                            <div className="mb-2 text-sm font-semibold text-muted-foreground">
                                Generated XML
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                <pre className="whitespace-pre-wrap break-all">
                                    {object?.xml || "No XML generated yet"}
                                </pre>
                            </div>
                        </div>

                        <Button
                            disabled={isGenerating}
                            type="submit"
                            className={cn("w-full", isGenerating && "animate-pulse")}
                        >
                            {isGenerating ? "Generating..." : "Generate Diagram"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
} 