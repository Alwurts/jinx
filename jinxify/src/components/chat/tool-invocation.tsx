import { Card } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { idToReadableText, pascalToSentence } from "@/lib/utils";
import type { ToolInvocation } from "ai";
import { ChevronDown } from "lucide-react";

export function renderObjectAsListItems(obj: unknown, level = 0) {
	if (typeof obj !== "object" || obj === null) {
		return <span>{String(obj)}</span>;
	}

	return (
		<ul className={`list-disc ${level === 0 ? "" : "ml-4"}`}>
			{Object.entries(obj).map(([key, value]) => (
				<li key={key} className="mt-1">
					<span className="font-medium">{idToReadableText(key)}:</span>{" "}
					{renderObjectAsListItems(value, level + 1)}
				</li>
			))}
		</ul>
	);
}

export function ToolInvocationComponent({
	toolInvocation,
}: { toolInvocation: ToolInvocation }) {
	if ("result" in toolInvocation) {
		return <ToolInvocationResultDefault toolInvocation={toolInvocation} />;
	}
	return <ToolInvocationCallDefault toolInvocation={toolInvocation} />;
}

export function ToolInvocationResultDefault({
	toolInvocation,
}: {
	toolInvocation: Exclude<ToolInvocation, { state: "call" | "partial-call" }>;
}) {
	return (
		<Card className="w-fit p-4">
			<Collapsible>
				<div className="flex flex-col gap-2">
					<CollapsibleTrigger className="flex items-center gap-2 hover:text-accent-foreground transition-colors">
						<div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
						<span className="font-medium">
							Used {pascalToSentence(toolInvocation.toolName)}:
						</span>
						<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
					</CollapsibleTrigger>
					<CollapsibleContent className="pl-4">
						{typeof toolInvocation.result === "string" ? (
							<span className="text-sm">{toolInvocation.result}</span>
						) : (
							<div className="text-sm">
								{renderObjectAsListItems(toolInvocation.result)}
							</div>
						)}
					</CollapsibleContent>
				</div>
			</Collapsible>
		</Card>
	);
}

export function ToolInvocationCallDefault({
	toolInvocation,
}: { toolInvocation: ToolInvocation }) {
	return (
		<Card className="w-fit p-4">
			<div className="flex items-center gap-2">
				<div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
				<span className="text-sm font-medium">
					Using {pascalToSentence(toolInvocation.toolName)}...
				</span>
			</div>
		</Card>
	);
}
