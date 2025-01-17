"use client";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TDiagram } from "@/types/db";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { normalizeXML } from "@/lib/bpmn";
import Modeler from "bpmn-js/lib/Modeler";
import { useDebouncedCallback } from "use-debounce";
import { useMutation } from "@tanstack/react-query";
import { useChatContext } from "../chat/chat-provider";

type Props = {
	diagram: TDiagram;
};

export default function Editor({ diagram }: Props) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [modeler, setModeler] = useState<Modeler | null>(null);
	const { generateDiagram } = useChatContext();

	const updateDiagram = useMutation({
		mutationFn: async (values: { diagramId: string; xmlState: string }) => {
			const res = await fetch(`/api/diagram/${values.diagramId}`, {
				method: "PATCH",
				body: JSON.stringify({ content: values.xmlState }),
			});
			return await res.json();
		},
	});

	const debouncedSave = useDebouncedCallback((content: string) => {
		// Only save if content has actually changed
		console.log("Saving diagram", content);
		updateDiagram.mutate({ diagramId: diagram.id, xmlState: content });
	}, 200);

	// Initialize modeler
	let modelerInitializationInstance: Modeler | null = null;
	const initModeler = async () => {
		if (!containerRef.current || modelerInitializationInstance) {
			return;
		}

		modelerInitializationInstance = new Modeler({
			container: containerRef.current,
			width: "100%",
			height: "100%",
		});

		modelerInitializationInstance.on("commandStack.changed", async () => {
			const result = await modelerInitializationInstance?.saveXML({
				format: true,
			});
			if (result?.xml) {
				debouncedSave(result.xml);
			}
		});

		if (diagram.content) {
			importXML(diagram.content, true, modelerInitializationInstance);
		}

		setModeler(modelerInitializationInstance);
	};

	const importXML = useCallback(
		async (xml: string, fit = true, modelerRef?: Modeler) => {
			const modelerToUse = modelerRef ?? modeler;
			if (!modelerToUse) {
				throw new Error("Modeler not initialized");
			}
			const normalizedXML = normalizeXML(xml);
			if (!normalizedXML) {
				return;
			}
			try {
				const { warnings } = await modelerToUse.importXML(normalizedXML);
				if (warnings.length) {
					console.warn(warnings);
				}
				if (fit) {
					// @ts-expect-error
					modelerToUse.get("canvas").zoom("fit-viewport");
				}
			} catch (_) {
				//console.error(error);
			}
		},
		[modeler],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		initModeler();

		return () => {
			modeler?.destroy();
		};
	}, []);

	useEffect(() => {
		if (generateDiagram.object) {
			importXML((generateDiagram.object as { xml: string }).xml);
			debouncedSave((generateDiagram.object as { xml: string }).xml);
		}
	}, [generateDiagram.object, importXML, debouncedSave]);

	return (
		<div className="flex-1 h-full w-full dark:invert" ref={containerRef} />
	);
}
