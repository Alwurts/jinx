import { Separator } from "@/components/ui/separator";
import React from "react";
import { AiOutlineBulb } from "react-icons/ai";
import { FaGem } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { MdGroup, MdTrendingUp } from "react-icons/md";

const data = [
	{
		id: 1,
		title: "Our Vission",
		icon: <AiOutlineBulb size={30} />,
		description:
			"Smartify Your Business Processes! means upgrading your traditional workflows with smart, AI-driven solutions that enhance efficiency and decision-making. We help businesses automate repetitive tasks, optimize operations, and utilize data-driven insights to stay ahead in a competitive market.",
	},
	{
		id: 2,
		title: " Our Mission",
		icon: <FiTarget size={30} />,
		description:
			"We transform business processes into successful, AI-enhanced automated workflows by incorporating advanced AI technologies. This allows companies to streamline operations, reduce errors, and improve efficiency.",
	},
	{
		id: 3,
		title: "Our Purpose",
		icon: <MdTrendingUp size={30} />,
		description:
			"We help businesses seamlessly optimize their core processes to achieve their strategic objectives by implementing tailored, intelligent solutions. This enables more efficient operations, better resource allocation, and enhanced productivity, aligning everyday activities with long-term goals.",
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
			"We commit to transparent communication, value diverse perspectives, and embrace learning from mistakes to foster continuous growth and respect among all stakeholders.",
	},
];

export default function page() {
	return (
		<section>
			<div className="container mx-auto px-4 py-8 sm:py-16">
				<div className="text-center mb-10">
					<h1 className="text-4xl md:text-5xl font-bold mb-8">What drives jinx</h1>
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
