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
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportXmlDialogProps {
	onImport: (xml: string) => Promise<void>;
}

export function ImportXmlDialog({ onImport }: ImportXmlDialogProps) {
	const [open, setOpen] = useState(false);
	const [xml, setXml] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleImport = async () => {
		if (!xml.trim()) return;

		setIsLoading(true);
		try {
			await onImport(xml);
			setXml("");
			setOpen(false);
		} catch (error) {
			console.error("Error importing XML:", error);
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
			try {
				await onImport(xml);
				setOpen(false);
			} catch (error) {
				console.error("Error importing XML:", error);
			} finally {
				setIsLoading(false);
			}
		};
		reader.readAsText(file);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Import</Button>
			</DialogTrigger>
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
					<TabsContent value="paste">
						<Textarea
							value={xml}
							onChange={(e) => setXml(e.target.value)}
							placeholder="Paste your BPMN XML here..."
							className="h-[400px] font-mono"
						/>
					</TabsContent>
					<TabsContent
						value="upload"
						className="flex flex-col items-center justify-center h-[400px] border rounded-md"
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
						>
							<Upload className="mr-2 h-4 w-4" />
							Choose File
						</Button>
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleImport} disabled={!xml.trim() || isLoading}>
							Import
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
