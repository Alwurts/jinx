"use client";

import React, { useEffect, useRef, useState } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import {
	COFFEE_MAKING_PROCESS,
	MANUFACTURING_PROCESS_WITH_LANES,
} from "@/lib/bpmn-examples";
import { normalizeXML } from "@/lib/bpmn";

export default function BPMNEditor() {
	const containerRef = useRef<HTMLDivElement>(null);
	const modelerRef = useRef<BpmnModeler | null>(null);
	const isMounted = useRef(false);

	useEffect(() => {
		async function initModeler() {
			if (!containerRef.current || isMounted.current === true) {
				return;
			}

			const bpmnModeler = new BpmnModeler({
				container: containerRef.current,
				width: "100%",
				height: "100%",
			});

			modelerRef.current = bpmnModeler;
			isMounted.current = true;

			importXml(COFFEE_MAKING_PROCESS);
		}

		// Small delay to ensure the container is properly mounted
		setTimeout(initModeler, 100);

		return () => {
			if (modelerRef.current) {
				modelerRef.current.destroy();
			}
		};
	}, []);

	const importXml = async (xml: string) => {
		if (!modelerRef.current) {
			throw new Error("Modeler not initialized");
		}
		const normalizedXML = normalizeXML(xml);
		try {
			await modelerRef.current.importXML(normalizedXML);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const canvas = modelerRef.current.get("canvas") as any;
			canvas.zoom("fit-viewport");
		} catch (err) {
			console.error("Error importing BPMN diagram:", err);
		}
	};

	return <div className="w-screen h-screen" ref={containerRef} />;
}
