"use client";

import { FormEditor } from "@bpmn-io/form-js-editor";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useChatContext } from "../chat/chat-provider";
import { useMutation } from "@tanstack/react-query";
import type { TForm } from "@/types/db";

export default function Editor({ form }: { form: TForm }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [modeler, setModeler] = useState<FormEditor | null>(null);
	const { generateForm } = useChatContext();

	const updateForm = useMutation({
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		mutationFn: async (values: { formId: string; schema: any }) => {
			const res = await fetch(`/api/form/${values.formId}`, {
				method: "PATCH",
				body: JSON.stringify({ schema: values.schema }),
			});
			return await res.json();
		},
	});

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const debouncedSave = useDebouncedCallback((schema: any) => {
		// Only save if content has actually changed
		console.log("schema", schema);
		updateForm.mutate({ formId: form.id, schema: schema });
	}, 200);

	const importSchema = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async (schema: any, modelerRef?: FormEditor) => {
			const modelerToUse = modelerRef ?? modeler;
			if (!modelerToUse) {
				throw new Error("Modeler not initialized");
			}

			try {
				const { warnings } = await modelerToUse.importSchema(schema);
				if (warnings.length) {
					console.warn(warnings);
				}
			} catch (error) {
				console.error(error);
			}
		},
		[modeler],
	);

	let modelerInitializationInstance: FormEditor | null = null;
	const initModeler = async () => {
		if (!containerRef.current || modelerInitializationInstance) {
			return;
		}
		try {
			modelerInitializationInstance = new FormEditor({
				container: containerRef.current,
			});

			modelerInitializationInstance.on("commandStack.changed", () => {
				const schema = modelerInitializationInstance?.saveSchema();
				debouncedSave(schema);
			});

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			await importSchema(form.schema as any[], modelerInitializationInstance);

			setModeler(modelerInitializationInstance);
		} catch (error) {
			console.error(error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		initModeler();

		return () => {
			modeler?.destroy();
		};
	}, []);

	useEffect(() => {
		if (Array.isArray(generateForm.object)) {
			importSchema({
				type: "default",
				components: generateForm.object,
			});
			debouncedSave({
				type: "default",
				components: generateForm.object,
			});
		}
	}, [generateForm.object, importSchema, debouncedSave]);

	return (
		<div
			className="flex-1 h-full w-full max-h-screen dark:invert"
			ref={containerRef}
		/>
	);
}
