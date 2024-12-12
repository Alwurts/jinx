"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Download } from "lucide-react";
import { useState } from "react";

interface ExportXmlDialogProps {
	getXml: () => Promise<string>;
	fileName: string;
}

export function ExportXmlDialog({ getXml, fileName }: ExportXmlDialogProps) {
	const [open, setOpen] = useState(false);
	const [xml, setXml] = useState("");
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleOpen = async (isOpen: boolean) => {
		if (isOpen) {
			setIsLoading(true);
			try {
				const content = await getXml();
				setXml(content);
			} catch (error) {
				console.error("Error getting XML:", error);
			} finally {
				setIsLoading(false);
			}
		}
		setOpen(isOpen);
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(xml);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownload = () => {
		const blob = new Blob([xml], { type: "text/xml" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Export</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Export BPMN XML</DialogTitle>
					<DialogDescription>
						View, copy, or download the BPMN XML content
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="h-[400px] flex items-center justify-center">
						Loading...
					</div>
				) : (
					<ScrollArea className="h-[400px] w-full rounded-md border p-4">
						<pre className="text-sm">{xml}</pre>
					</ScrollArea>
				)}

				<DialogFooter>
					<div className="flex gap-2">
						<Button variant="outline" onClick={handleCopy}>
							{copied ? (
								<>
									<Check className="mr-2 h-4 w-4" />
									Copied!
								</>
							) : (
								"Copy to Clipboard"
							)}
						</Button>
						<Button onClick={handleDownload}>
							<Download className="mr-2 h-4 w-4" />
							Download
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 