"use client";
import Image from "next/image";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
	question: string;
	answer: string;
	id: number;
	image?: string;
}

export default function FAQs() {
	const faqData = [
		{
			id: "1",
			question: "What is jinxify?",
			answer:
				"Jinxify is an innovative workflow management tool that combines BPMN diagram creation with AI capabilities. You can create diagrams using ChatGPT, organize them in folders, and convert your processes into actionable tasks. It's designed to streamline your business process management from conception to execution.",
			image: "/images/BPMN.png",
		},
		{
			id: "2",
			question: "How do I create and organize folders?",
			answer:
				"Creating folders in Jinxify is straightforward:\n\n• Click the 'Files' button on your dashboard\n• Then click the 'New Item' to create a new folder.\nYou can create unlimited folders to keep your workflows organized and easily accessible.",
		},
		{
			id: "3",
			question: "How does the AI-powered diagram creation work?",
			answer:
				"Creating diagrams with our AI is simple:\n\n• Open a folder and click 'New Diagram'\n• Describe your process in natural language (e.g., 'Create a customer onboarding process')\n• AI will generate a BPMN diagram based on your description\n• Review and edit the generated diagram as needed\nThe AI assistant helps you create professional BPMN diagrams quickly, even if you're new to process modeling.",
		},
		{
			id: "4",
			question: "How can I convert my diagrams into tasks?",
			answer:
				"Jinxify's task management feature allows you to turn your process diagrams into actionable tasks:\n\n• Click 'Task Manager' button\n• By clicking Each process step becomes a task automatically\n• Set deadlines and priorities\n• Track progress in the task management dashboard\nThis seamless integration ensures your process designs translate directly into executable work items.",
		},
		{
			id: "5",
			question: "What types of diagrams can I create?",
			answer:
				"Jinxify support BPMN 2.0 process diagrams\n• Workflow diagrams\n• Custom diagram templates.",
		},
	];
	return (
		<div className="w-full max-w-4xl mx-auto p-4 md:p-6 overflow-hidden overflow-y-auto">
			<h2 className="text-3xl font-bold mb-6 text-center text-foreground">
				Frequently Asked Questions
			</h2>
			<p className="text-muted-foreground mb-8 text-center">
				Learn how to create, manage, and transform your workflows with jinxify
			</p>

			<Accordion type="single" collapsible className="space-y-4">
				{faqData.map((faq) => (
					<AccordionItem
						key={faq.id}
						value={faq.id}
						className="border border-border rounded-lg p-2 bg-white hover:bg-accent/50 transition-colors"
					>
						<AccordionTrigger className="text-left font-semibold px-2 text-foreground">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent className="px-2">
							<div className="prose max-w-none">
								<p className="text-foreground whitespace-pre-line mb-4">
									{faq.answer}
								</p>
								{faq.image && (
									<div className="mt-4 max-w-full">
										<Image
											src={faq.image}
											alt={faq.question}
											width={500}
											height={300}
										/>
									</div>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
