import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Utility types for better type annotations
interface FileResult {
	id: string;
}

export async function POST(req: Request): Promise<Response> {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY || "",
	});

	try {
		const contentType = req.headers.get("content-type") || "";

		if (contentType.includes("multipart/form-data")) {
			const formData = await req.formData();
			const pdfFile = formData.get("pdf-file") as File | null;
			const jobDescription = formData.get("job-description") as string;

			console.log("Received FormData:");

			// Shared function to process a PDF file
			const processPDF = async (filePath: string): Promise<Response> => {
				try {
					const myFile: FileResult = await openai.files.create({
						file: fs.createReadStream(filePath),
						purpose: "assistants",
					});

					console.log("This is the file object: ", myFile, "\n");

					// Create an assistant
					const myAssistant = await openai.beta.assistants.create({
						model: "gpt-4o",
						instructions: `You are an assistant that checks a PDF document and give it a score between 0 to 100 to for this job description :${jobDescription}  `,
						name: "Customer Support Chatbot",
						tools: [{ type: "file_search" }],
					});

					console.log("This is the assistant object: ", myAssistant, "\n");

					// Create a thread
					const myThread = await openai.beta.threads.create();
					console.log("This is the thread object: ", myThread, "\n");

					// Attach thread to a message
					const myThreadMessage = await openai.beta.threads.messages.create(
						myThread.id,
						{
							role: "user",
							content: `Generate a score between 0-100 for the following job description: ${jobDescription} and with respect to the qualifications and data provided in the PDF documents  `,
							attachments: [
								{ file_id: myFile.id, tools: [{ type: "file_search" }] },
							],
						},
					);
					console.log("This is the message object: ", myThreadMessage, "\n");

					// Start the assistance
					const myRun = await openai.beta.threads.runs.create(myThread.id, {
						assistant_id: myAssistant.id,
						instructions: "Please give user the analysis of the PDF.",
					});

					console.log("This is the run object: ", myRun, "\n");

					// Check for completion
					let keepRetrievingRun: { status: string };
					while (true) {
						keepRetrievingRun = await openai.beta.threads.runs.retrieve(
							myThread.id,
							myRun.id,
						);

						console.log(`Run status: ${keepRetrievingRun.status}`);

						if (keepRetrievingRun.status === "completed") {
							console.log("\nRun completed successfully.");
							const allMessages = await openai.beta.threads.messages.list(
								myThread.id,
							);

							console.log(
								"------------------------------------------------------------ \n",
							);
							console.log("User: ", myThreadMessage.content);
							console.log("Assistant: ", allMessages.data[0]?.content);

							return NextResponse.json({
								role: allMessages.data[0]?.role,
								content: allMessages.data[0]?.content,
							});
						}
						if (keepRetrievingRun.status === "failed") {
							console.log("Run failed.");
							break;
						}
					}

					throw new Error("Run failed to complete successfully.");
				} finally {
					fs.unlinkSync(filePath);
				}
			};

			// Handle PDF file upload
			if (pdfFile) {
				console.log("This is the pdfFile: ", pdfFile);

				const tempDir = os.tmpdir();
				const tempFilePath = path.join(tempDir, `upload-${Date.now()}.pdf`);

				// Convert Blob to Buffer and write to temp file
				const buffer = Buffer.from(await pdfFile.arrayBuffer());
				fs.writeFileSync(tempFilePath, buffer);

				return await processPDF(tempFilePath);
			}
		}

		return NextResponse.json(
			{ error: "Unsupported content type" },
			{ status: 400 },
		);
	} catch (error) {
		console.error("Error processing request:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
