"use client";

import React, { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface ContentItem {
	type: "text";
	text: {
		value: string;
		annotations: {
			type: "file_citation";
			text: string;
			start_index: number;
			end_index: number;
			file_citation: {
				file_id: string;
			};
		}[];
	};
}

interface ResponseData {
	role: "assistant";
	content: ContentItem[];
}

function Page() {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<ResponseData | null>(null);

	async function submitHandler(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		try {
			setIsLoading(true);
			const response = await fetch("/api/cv", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result: ResponseData = await response.json();
			setResult(result);
		} catch (error) {
			console.error(error);
			toast.error(`Something went wrong!${error}`);
		} finally {
			setIsLoading(false);
		}
	}

	console.log("result", result);

	return (
		<div className="container mx-auto max-w-2xl py-10">
			<Card>
				<CardHeader>
					<CardTitle>CV Analysis</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={submitHandler} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="cv-file">Upload CV</Label>
							<Input id="cv-file" type="file" name="pdf-file" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="job-description">Job Description</Label>
							<Input
								id="job-description"
								type="text"
								name="job-description"
								placeholder="Enter job description"
							/>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Analyzing...
								</>
							) : (
								"Submit"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>

			{result && (
				<Card className="mt-6">
					<CardHeader>
						<CardTitle>Analysis Result</CardTitle>
					</CardHeader>
					<CardContent>
						{result.content.map((item, index) => (
							<MarkdownContent
								content={item.text.value}
								key="render-markdown"
								id="test"
							/>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default Page;
