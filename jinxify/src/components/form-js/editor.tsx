"use client";

import { FormEditor } from "@bpmn-io/form-js-editor";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useChatContext } from "../chat/chat-provider";

export function Editor() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [modeler, setModeler] = useState<FormEditor | null>(null);
	const { generateForm } = useChatContext();

	const debouncedSave = useDebouncedCallback((content: string) => {
		// Only save if content has actually changed
		console.log("content", content);
	}, 1000);

	const importSchema = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async (schema: Record<string, any>, modelerRef?: FormEditor) => {
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

		modelerInitializationInstance = new FormEditor({
			container: containerRef.current,
		});

		const schema = {
			type: "default",
			components: [
				{
					key: "creditor",
					label: "Creditor",
					type: "textfield",
					validate: {
						required: true,
					},
				},
			],
		};

		modelerInitializationInstance.on("commandStack.changed", () => {
			const schema = modelerInitializationInstance?.saveSchema();
			debouncedSave(schema);
		});

		await importSchema(schema, modelerInitializationInstance);

		setModeler(modelerInitializationInstance);
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
		}
	}, [generateForm.object, importSchema]);

	return (
		<div
			className="flex-1 h-full w-full max-h-screen"
			ref={containerRef}
			style={{ display: containerRef.current ? "block" : "none" }}
		/>
	);
}
