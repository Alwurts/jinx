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
		content: "",
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
