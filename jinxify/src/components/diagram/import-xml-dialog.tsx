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
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ImportXmlDialogProps {
	onImport: (xml: string) => Promise<void>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ImportXmlDialog({
	onImport,
	open,
	onOpenChange,
}: ImportXmlDialogProps) {
	const [xml, setXml] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) {
			setXml("");
			setError(null);
			setIsLoading(false);
		}
	}, [open]);

	const handleImport = async () => {
		if (!xml.trim()) return;

		setIsLoading(true);
		setError(null);
		try {
			await onImport(xml);
			setXml("");
			onOpenChange(false);
		} catch (error) {
			console.error("Error importing XML:", error);
			setError(error instanceof Error ? error.message : "Failed to import XML");
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async (e) => {
			const xml = e.target?.result as string;
			setIsLoading(true);
			setError(null);
			try {
				await onImport(xml);
				onOpenChange(false);
			} catch (error) {
				console.error("Error importing XML:", error);
				setError(
					error instanceof Error ? error.message : "Failed to import XML",
				);
			} finally {
				setIsLoading(false);
			}
		};
		reader.readAsText(file);
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
						<DialogTitle>Import BPMN XML</DialogTitle>
						<DialogDescription>
							Upload a file or paste your BPMN XML content
						</DialogDescription>
					</DialogHeader>

					<Tabs defaultValue="paste" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="paste">Paste XML</TabsTrigger>
							<TabsTrigger value="upload">Upload File</TabsTrigger>
						</TabsList>
						<div className="border rounded-md mt-2">
							<TabsContent
								value="paste"
								className="h-[400px] data-[state=inactive]:hidden"
							>
								<Textarea
									value={xml}
									onChange={(e) => setXml(e.target.value)}
									placeholder="Paste your BPMN XML here..."
									className="h-full font-mono border-none"
								/>
							</TabsContent>
							<TabsContent
								value="upload"
								className="flex flex-col items-center justify-center h-[400px] data-[state=inactive]:hidden"
							>
								<Input
									type="file"
									accept=".bpmn,.xml"
									onChange={handleFileUpload}
									className="hidden"
									id="dialog-file-upload"
								/>
								<Button
									variant="outline"
									onClick={() =>
										document.getElementById("dialog-file-upload")?.click()
									}
									className="w-48"
									disabled={isLoading}
								>
									<Upload className="mr-2 h-4 w-4" />
									Choose File
								</Button>
							</TabsContent>
						</div>
					</Tabs>

					<DialogFooter>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleImport}
								disabled={!xml.trim() || isLoading}
							>
								Import
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
