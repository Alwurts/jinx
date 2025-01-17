"use client";

import { Form } from "@bpmn-io/form-js";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { TForm } from "@/types/db";
import { toast } from "@/hooks/use-toast";

export default function Viewer({ form }: { form: TForm }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [viewer, setViewer] = useState<Form | null>(null);

	const submitForm = useMutation({
		mutationFn: async (values: Record<string, unknown>) => {
			const res = await fetch(`/api/form/${form.id}/submission`, {
				method: "POST",
				body: JSON.stringify(values),
			});
			if (!res.ok) {
				throw new Error("Failed to submit form");
			}
			return res.json();
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Form submitted successfully",
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const importSchema = useCallback(
		async (schema: unknown, viewerRef?: Form) => {
			const viewerToUse = viewerRef ?? viewer;
			if (!viewerToUse) {
				throw new Error("Viewer not initialized");
			}

			try {
				await viewerToUse.importSchema(schema);
			} catch (error) {
				console.error(error);
			}
		},
		[viewer],
	);

	let viewerInitializationInstance: Form | null = null;
	const initViewer = async () => {
		if (!containerRef.current || viewerInitializationInstance) {
			return;
		}

		try {
			viewerInitializationInstance = new Form({
				container: containerRef.current,
			});

			viewerInitializationInstance.on(
				"submit",
				(event: { data: Record<string, unknown> }) => {
					console.log(event.data);
					submitForm.mutate(event.data);
				},
			);

			await importSchema(form.schema, viewerInitializationInstance);

			setViewer(viewerInitializationInstance);
		} catch (error) {
			console.error(error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		initViewer();

		return () => {
			viewer?.destroy();
		};
	}, []);

	return (
		<div
			className="flex-1 h-full w-full max-h-screen dark:invert"
			ref={containerRef}
		/>
	);
}
