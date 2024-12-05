"use client";
import React, { useEffect, useRef, useState } from "react";
import type { TDiagram } from "@/types/db";
import { useMutation, useQuery } from "@tanstack/react-query";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { Button } from "../ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { normalizeXML } from "@/lib/bpmn";
import { GenerateDiagramSidebar } from "./generate-diagram-sidebar";
import { DiagramChatSidebar } from "./diagram-chat-sidebar";
type Props = {
	id: string;
};

export default function Editor({ id }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const modelerRef = useRef<BpmnModeler | null>(null);
	const isMounted = useRef(false);

	const { isError, isLoading, data } = useQuery<TDiagram>({
		queryKey: ["diagram", id],
		queryFn: async () => {
			const response = await fetch(`/api/diagram/${id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch diagram");
			}
			return response.json();
		},
	});

	const updateDiagram = useMutation({
		mutationFn: async (values: { diagramId: string; xmlState: string }) => {
			const res = await fetch(`/api/diagram/${values.diagramId}`, {
				method: "PATCH",
				body: JSON.stringify({ content: values.xmlState }),
			});
			return await res.json();
		},
	});

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

	useEffect(() => {
		if (data?.content) {
			setTimeout(() => {
				if (data?.content) {
					importXml(data.content);
				}
			}, 200);
		}
	}, [data]);

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

	const saveDocument = async () => {
		if (!modelerRef.current) {
			throw new Error("Modeler not initialized");
		}
		const { xml } = await modelerRef.current.saveXML();

		if (!xml || !data?.id) {
			/* toast({
				title: "Failed to save document",
				description: "Please try again.",
				duration: 800,
			}); */
			return;
		}

		await updateDiagram.mutateAsync({
			diagramId: data?.id,
			xmlState: xml,
		});
		/* toast({
			title: "Document saved successfully!",
			description: "Your changes have been saved.",
			duration: 800,
		}); */
	};

	return (
		<div className="w-screen h-screen flex flex-col">
			<div className="flex justify-between items-center h-14 px-4 border-b">
				<div className="flex items-center gap-4">
					<Button variant="outline" asChild>
						<Link href={`/dashboard?directoryId=${data?.directoryId}`}>
							Back
						</Link>
					</Button>
					<Separator orientation="vertical" />
					<h1 className="text-2xl font-bold">
						{isLoading ? "Loading..." : data?.title}
					</h1>
				</div>

				<div className="flex items-center gap-2">
					<Button disabled={updateDiagram.isPending} onClick={saveDocument}>
						Save
					</Button>
				</div>
			</div>

			<div className="flex-1 flex relative overflow-hidden">
				{isLoading && (
					<div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
						Loading document...
					</div>
				)}
				<div ref={containerRef} className="flex-1" />
				<DiagramChatSidebar onGenerated={importXml} />
			</div>
		</div>
	);
}
