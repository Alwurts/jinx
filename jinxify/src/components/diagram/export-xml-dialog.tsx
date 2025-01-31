"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Check, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExportXmlDialogProps {
	getXml: () => Promise<string>;
	fileName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ExportXmlDialog({
	getXml,
	fileName,
	open,
	onOpenChange,
}: ExportXmlDialogProps) {
	const [xml, setXml] = useState("");
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setIsLoading(true);
			setError(null);
			getXml()
				.then((content) => {
					if (!content) {
						throw new Error("No diagram content available");
					}
					setXml(content);
				})
				.catch((error) => {
					console.error("Error getting XML:", error);
					setError(
						error instanceof Error
							? error.message
							: "Failed to get diagram content",
					);
					onOpenChange(false);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			setXml("");
			setError(null);
		}
	}, [open, getXml, onOpenChange]);

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
		<>
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Dialog open={open} onOpenChange={onOpenChange}>
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
							<Button variant="outline" onClick={handleCopy} disabled={!xml}>
								{copied ? (
									<>
										<Check className="mr-2 h-4 w-4" />
										Copied!
									</>
								) : (
									"Copy to Clipboard"
								)}
							</Button>
							<Button onClick={handleDownload} disabled={!xml}>
								<Download className="mr-2 h-4 w-4" />
								Download
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
