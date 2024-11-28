"use client";

import React, { useEffect, useRef, useState } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

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
		}

		// Small delay to ensure the container is properly mounted
		setTimeout(initModeler, 100);

		return () => {
			if (modelerRef.current) {
				modelerRef.current.destroy();
			}
		};
	}, []);

	return <div className="w-screen h-screen" ref={containerRef} />;
}
