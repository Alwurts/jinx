"use client";

import { FormEditor } from "@bpmn-io/form-js-editor";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useChatContext } from "../chat/chat-provider";
import { useMutation } from "@tanstack/react-query";
import type { TForm } from "@/types/db";

interface FormSchema {
	type: string;
	components: Array<{
		type: string;
		[key: string]: unknown;
	}>;
}

export default function Editor({
	form,
	onSubmitButtonChange,
}: {
	form: TForm;
	onSubmitButtonChange?: (hasButton: boolean) => void;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [modeler, setModeler] = useState<FormEditor | null>(null);
	const { generateForm } = useChatContext();
	const [hasSubmitButton, setHasSubmitButton] = useState(true);

	const updateForm = useMutation({
		mutationFn: async (values: { formId: string; schema: FormSchema }) => {
			const res = await fetch(`/api/form/${values.formId}`, {
				method: "PATCH",
				body: JSON.stringify({ schema: values.schema }),
			});
			return await res.json();
		},
	});

	// Check if schema has submit button
	const checkSubmitButton = useCallback(
		(schema: FormSchema) => {
			const components = schema?.components || [];
			const submitExists = components.some(
				(component) => component.type === "button",
			);
			setHasSubmitButton(!!submitExists);
			onSubmitButtonChange?.(!!submitExists);
		},
		[onSubmitButtonChange],
	);

	const debouncedSave = useDebouncedCallback((schema: FormSchema) => {
		// Check for submit button whenever schema changes
		checkSubmitButton(schema);
		// Only save if content has actually changed
		console.log("schema", schema);
		updateForm.mutate({ formId: form.id, schema: schema });
	}, 200);

	const importSchema = useCallback(
		async (schema: FormSchema, modelerRef?: FormEditor) => {
			const modelerToUse = modelerRef ?? modeler;
			if (!modelerToUse) {
				throw new Error("Modeler not initialized");
			}

			try {
				const { warnings } = await modelerToUse.importSchema(schema);
				checkSubmitButton(schema);
				if (warnings.length) {
					console.warn(warnings);
				}
			} catch (error) {
				console.error(error);
			}
		},
		[modeler, checkSubmitButton],
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

			await importSchema(
				form.schema as FormSchema,
				modelerInitializationInstance,
			);

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
