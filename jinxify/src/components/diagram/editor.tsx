"use client";
import type React from "react";
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";
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

export type EditorRef = {
	importXML: (xml: string) => Promise<void>;
	getXml: () => Promise<string>;
};

const Editor = forwardRef<EditorRef, Props>(({ diagram }, ref) => {
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
		updateDiagram.mutate({ diagramId: diagram.id, xmlState: content });
	}, 200);

	const importXML = useCallback(
		async (xml: string, fit = true, modelerRef?: Modeler) => {
			const modelerToUse = modelerRef ?? modeler;
			if (!modelerToUse) {
				throw new Error("Modeler not initialized");
			}
			const normalizedXML = normalizeXML(xml);
			if (!normalizedXML) {
				throw new Error("Invalid XML content");
			}
			try {
				const { warnings } = await modelerToUse.importXML(normalizedXML);
				if (warnings.length) {
					console.warn("Import warnings:", warnings);
				}
				if (fit) {
					// @ts-expect-error
					modelerToUse.get("canvas").zoom("fit-viewport");
				}
				// Save the imported XML
				debouncedSave(normalizedXML);
			} catch (error) {
				console.error("Import error:", error);
				throw error;
			}
		},
		[modeler, debouncedSave],
	);

	const getXml = useCallback(async () => {
		if (!modeler) {
			throw new Error("Modeler not initialized");
		}
		try {
			const result = await modeler.saveXML({ format: true });
			if (!result.xml) {
				throw new Error("Failed to get XML");
			}
			return result.xml;
		} catch (error) {
			console.error("Export error:", error);
			throw error;
		}
	}, [modeler]);

	useImperativeHandle(
		ref,
		() => ({
			importXML,
			getXml,
		}),
		[importXML, getXml],
	);

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
			try {
				const result = await modelerInitializationInstance?.saveXML({
					format: true,
				});
				if (result?.xml) {
					debouncedSave(result.xml);
				}
			} catch (error) {
				console.error("Save error:", error);
			}
		});

		try {
			// Import initial content or default diagram
			const initialXml = diagram.content;
			await importXML(initialXml, true, modelerInitializationInstance);
		} catch (error) {
			console.error("Initial import error:", error);
			// If initial content fails, try importing default diagram
		}

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
		if (generateDiagram.object) {
			importXML((generateDiagram.object as { xml: string }).xml);
		}
	}, [generateDiagram.object, importXML]);

	return (
		<div className="flex-1 h-full w-full dark:invert" ref={containerRef} />
	);
});

Editor.displayName = "Editor";

export default Editor;
