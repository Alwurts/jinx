import { Separator } from "@/components/ui/separator";
import React from "react";
import { AiOutlineBulb } from "react-icons/ai";
import { FaGem } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { MdGroup, MdTrendingUp } from "react-icons/md";

const data = [
	{
		id: 1,
		title: "Our Vision",
		icon: <AiOutlineBulb size={30} />,
		description:
			"Smartify Your HR recrutment processes! means automating job offers, interview processes, and onboarding through AI-driven workflows. We envision a world where HR professionals can focus on talent, not tasks, with seamless, intelligent, and efficient hiring experiences.",
	},
	{
		id: 2,
		title: " Our Mission",
		icon: <FiTarget size={30} />,
		description:
			"We empower HR teams with AI-powered solutions that automate job offers, streamline interview workflows, and optimize onboarding. By integrating intelligent automation, centralized dashboards, and organized document management, we help businesses build a smarter, faster, and more effective hiring process.",
	},
	{
		id: 3,
		title: "Our Purpose",
		icon: <MdTrendingUp size={30} />,
		description:
			"We simplify recruitment with an AI-powered platform that enhances decision-making, candidate engagement, and operational efficiency. Our solution empowers HR professionals to manage job offers, conduct interviews, and onboard talent effortlessly, ensuring a structured and stress-free hiring experience.",
	},
	{
		id: 4,
		title: "Our Values",
		icon: <FaGem size={30} />,
		description:
			"Our values drive us to communicate openly, transform challenges into innovations, work diligently while enjoying the process, exceed expectations, and maintain a confident, 'act-as-if' mindset to fuel our creative and strategic advancements.",
	},
	{
		id: 5,
		title: "Our Principles",
		icon: <MdGroup size={30} />,
		description:
			"We streamline HR processes with AI-powered automation for job offers, interviews, and onboarding, enabling seamless collaboration between recruiters, hiring managers, and candidates. Our bias-free AI tools ensure fair hiring, while scalable solutions adapt to teams of all sizes. With centralized and secure data management, HR assets stay organized, protected, and easily accessible.",
	},
];

export default function page() {
	return (
		<section>
			<div className="container mx-auto px-4 py-8 sm:py-16">
				<div className="text-center mb-10">
					<h1 className="text-4xl md:text-5xl font-bold mb-8">
						What drives jinx
					</h1>
					<Separator className="mt-4" />
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{data?.map((item) => (
						<div className="space-y-6" key={item.id}>
							<div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 border-2 border-slate-600 dark:border-white">
								{item.icon}
							</div>
							<h3 className="mb-2 text-xl font-bold dark:text-white">
								{item.title}
							</h3>
							<p className="text-secondary-foreground dark:text-gray-400">
								{item.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
