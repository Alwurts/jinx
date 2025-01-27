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
				"jinxify is an advanced, AI-powered tool designed to streamline HR recruitment processes.\nCombining BPMN diagrams, AI-generated Forms, and Markdown, jinxify automates and simplifies key recruitment tasks—such as job offer creation, interview preparation, and onboarding workflows—ensuring efficiency, consistency, and ease for HR managers, especially in SMEs."
		},
		{
			id: "2",
			question: "How does jinxify help HR managers in SMEs?",
			answer:
				"jinxify is specifically built to address the unique challenges faced by HR managers in small to medium-sized enterprises (SMEs). By automating key recruitment tasks using AI-powered tools, HR professionals can save time, reduce errors, and ensure consistency across processes. It offers specialized solutions for: \n\n• Job Offer Creation: Generate detailed, professional, and role-specific job offers with AI-driven Markdown templates. \n\n• Interview Preparation: Create role-specific and competency-focused interview questionnaires using AI-generated forms. \n\n• Onboarding Process Automation: Design clear, automated onboarding workflows with BPMN, streamlining tasks like mentor assignments, training schedules, and document distribution.",
		},
		{
			id: "3",
			question: "How do I create and organize folders?",
			answer:
				"Creating folders in jinxify is straightforward: \n1. On the sidebar, select Files. \n2. At the top, click the 'New Item' button and then select New Folder. \n\nTo add additional files inside a folder: \n1. Open the folder where you want to add the file. \n2. At the top of the folder, click the 'New Item' button again. \n3. Choose from the following options to add: \n• New Document \n• New Diagram \n• New Form \n\n This allows you to easily manage and organize job offers, interview forms, onboarding workflows, and other HR resources, ensuring everything is stored and accessible in a structured way.",
		},
		{
			id: "4",
			question: "How does AI-powered job offer creation work?",
			answer:
				"To create a job offer using AI: \n\n1. Inside your folder, click the 'New Item' button at the top. \n2. Select the 'New Document' option. \n3. Click on the newly created document card element. \n4. You will automatically be directed to the Document Editor. \n5. In the editor, use our AI Chat to enter prompts and generate your job offer. (e.g., 'Write me a job offer for the following role as AI Engineer') \n6. If needed, make adjustments to the offer inside the editor view.",
			image: "/images/job-offer-creation.png",
		},
		{
			id: "5",
			question: "How does AI-powered interview preparation work?",
			answer:
				"To prepare for interviews: \n\n1. Inside your folder, click the 'New Item' button at the top. \n2. Select the 'New Form' option. \n3. Click on the newly created form card element. \n4. You will automatically be directed to the Form Editor. \n5. In the editor, use our AI Chat to create personalized, competency-based interview questions tailored to each role. (e.g., 'Make me a form with interview questions for an AI Engineer.') \n6. If needed, make adjustments to the questions inside the editor view.",
			image: "/images/prepare-interview.png",
		},
		{
			id: "6",
			question: "How do I automate my onboarding process with BPMN?",
			answer:
				"Creating onboarding processes with our AI is simple:\n\n1. Open a folder and click 'New Diagram'\n2. Describe your process in natural language (e.g., 'Create a onboarding process for a new hired AI Engineer')\n3. AI will generate a BPMN diagram based on your description\n4. Review and edit the generated diagram as needed \n\nThe AI assistant helps you create professional BPMN diagrams quickly, even if you're new to process modeling.",
			image: "/images/onboarding-process.png",
		},
		{
			id: "7",
			question: "How can I convert my diagrams into tasks?",
			answer:
				"jinxify's task management feature allows you to turn your process diagrams into actionable tasks:\n\n• Click 'Task Manager' button\n• By clicking Each process step becomes a task automatically\n• Set deadlines and priorities\n• Track progress in the task management dashboard\nThis seamless integration ensures your process designs translate directly into executable work items.",
		},
		{
			id: "8",
			question: "What types of diagrams can I create with jinxify?",
			answer:
				"jinxify supports the creation of BPMN 2.0 process diagrams, including: \n\n• Workflow diagrams for recruiting and onboarding processes. \n• Custom the generated diagram personalized to your organization’s needs.",
		},
	];
	return (
		<div className="bg-background w-full max-w-4xl mx-auto p-4 md:p-6 overflow-hidden overflow-y-auto">
			<h2 className="text-3xl font-bold mb-2 text-center text-foreground">
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
						className="border border-border rounded-lg p-2 bg-background hover:bg-accent/50 transition-colors"
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
