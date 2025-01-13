import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function USPSection() {
	const usps = [
		{
			title: "Automate Processes Effortlessly",
			description:
				"Turn your ideas into reality with our AI-powered Form, Markdown, and BPMN Editor. Create fully automated workflows with just a few inputs—whether it’s designing a job offer, onboarding tasks, or an interview questionnaire.",
			image: "/automate_bpmn.png",
		},
		{
			title: "Centralized Dashbaord",
			description:
				"Use our dedicated dashboard to track and manage task progress effectively, keeping your workflow on track from start to finish. Connect your tasks to BPMN diagrams, forms, or markdown files, providing a centralized view the workflow.",
			image: "/task_management.png",
		},
		{
			title: "Organized Workflows",
			description:
				"Utilize a Google Drive-inspired folder structure to manage your projects effectively. Seamlessly store and manage all your HR assets—forms, markdown files, and BPMN diagrams—in one secure and intuitive workspace.",
			image: "/organized_workflows.png",
		},
	];

	return (
		<section>
			{/* Title Tile */}
			<div className="mt-24 mb-16 text-center">
				<p className="scroll-m-20 text-lg font-extrabold tracking-tight mb-1.5">
					Why HR professionals choose us
				</p>
				<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
					Our Unique Selling Point
				</h1>
			</div>

			{/* USP Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mb-16">
				{usps.map((usp, index) => (
					<Card
						key={usp.title}
						className="rounded-xl border bg-card text-card-foreground shadow mb-10 w-full max-w-2xl mx-auto py-10"
					>
						<CardHeader className="flex flex-col items-center">
							{/* 3D Image */}
							<div className="relative mb-6">
								<Image
									src={usp.image}
									alt={usp.title}
									height={180}
									width={180}
									className="rounded-lg object-cover"
								/>
							</div>
							<Separator className="mt-4" />
						</CardHeader>
						<CardTitle className="text-xl font-semibold text-center mt-4 mb-4">
							{usp.title}
						</CardTitle>
						<CardContent>
							<p className="text-sm text-secondary-foreground text-center dark:text-gray-400">
								{usp.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
