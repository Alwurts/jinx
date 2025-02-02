import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Template = {
	id: string;
	title: string;
	description: string;
	content: string;
};

const diagramTemplates: Template[] = [
	{
		id: "empty",
		title: "Empty Diagram",
		description: "Start with a blank canvas",
		content: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0qleqp7" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="18.1.1">
  <bpmn:process id="Process_06ut86l" isExecutable="false">
    <bpmn:startEvent id="StartEvent_0q3b2kz" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_06ut86l">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_0q3b2kz">
        <dc:Bounds x="156" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,
	},
	{
		id: "basic-process",
		title: "Basic Process",
		description: "A simple process with start, task, and end",
		content: "", // TODO: Add basic BPMN XML template
	},
];

const formTemplates: Template[] = [
	{
		id: "empty",
		title: "Empty Form",
		description: "Start with a blank form",
		content: "",
	},
	{
		id: "contact",
		title: "Contact Form",
		description: "Basic contact form with name, email, and message",
		content: JSON.stringify({
			type: "default",
			components: [
				{
					type: "text",
					label: "Name",
					required: true,
				},
				{
					type: "email",
					label: "Email",
					required: true,
				},
				{
					type: "textarea",
					label: "Message",
					required: true,
				},
				{
					type: "button",
					label: "Submit",
					action: "submit",
				},
			],
		}),
	},
];

const documentTemplates: Template[] = [
	{
		id: "empty",
		title: "Empty Document",
		description: "Start with a blank document",
		content: "# New Document\n\nStart writing here...",
	},
	{
		id: "readme",
		title: "README",
		description: "Basic README template",
		content: "# Project Title\n\n## Description\n\n## Installation\n\n## Usage",
	},
	{
		id: "hr",
		title: "HR Policy Document",
		description: "HR template in MDX format to get started",
		content: `---
title: "HR Policies"
---

# HR Policies

Welcome to the HR policy document. Use this template to outline guidelines, benefits, and procedures.`,
	},
];

interface TemplateSelectionDialogProps {
	type: "diagram" | "form" | "document";
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (template: Template) => void;
}

export function TemplateSelectionDialog({
	type,
	open,
	onOpenChange,
	onSelect,
}: TemplateSelectionDialogProps) {
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
		null,
	);

	const templates =
		type === "diagram"
			? diagramTemplates
			: type === "form"
				? formTemplates
				: documentTemplates;

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLButtonElement>,
		template: Template,
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setSelectedTemplate(template);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Select a Template</DialogTitle>
					<DialogDescription>
						Choose a template to get started with your new {type}
					</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-4 py-4">
					{templates.map((template) => (
						<button
							key={template.id}
							type="button"
							className={cn(
								"flex flex-col space-y-2 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors text-left w-full",
								selectedTemplate?.id === template.id && "border-primary",
							)}
							onClick={() => setSelectedTemplate(template)}
							onKeyDown={(e) => handleKeyDown(e, template)}
							aria-selected={selectedTemplate?.id === template.id}
						>
							<h3 className="font-medium">{template.title}</h3>
							<p className="text-sm text-muted-foreground">
								{template.description}
							</p>
						</button>
					))}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							if (selectedTemplate) {
								onSelect(selectedTemplate);
								onOpenChange(false);
							}
						}}
						disabled={!selectedTemplate}
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
