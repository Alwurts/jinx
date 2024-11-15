import React from "react";
import { AiOutlineCluster } from "react-icons/ai";
import { FaHandshake } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdPeopleOutline } from "react-icons/md";
import { RiCustomerService2Fill, RiSpeedLine } from "react-icons/ri";
const data = [
	{
		id: 1,
		title: "Innovation-Driven",
		icon: <HiOutlineLightBulb size={30} />,
		description:
			"We believe in pushing the boundaries of business process management by integrating cutting-edge AI and automation. Innovation is at the core of everything we do to empower businesses to work smarter and faster.",
	},
	{
		id: 2,
		title: "Customer-Centric Solutions",
		icon: <RiCustomerService2Fill size={30} />,
		description:
			"Our customers are our inspiration. We design every feature with their needs in mind, delivering intuitive, user-centered solutions that simplify complex workflows and drive real results.",
	},
	{
		id: 3,
		title: "Efficiency and Scalability",
		icon: <AiOutlineCluster size={30} />,
		description:
			"We prioritize efficiency to help organizations streamline their processes effortlessly. Our solutions are built to scale, enabling businesses of all sizes to achieve optimized workflows at every stage of growth.",
	},
	{
		id: 4,
		title: "Transparency and Trust",
		icon: <FaHandshake size={30} />,
		description:
			"We operate with integrity and transparency, building trust with our clients through honest communication and reliable solutions that they can depend on as they scale their operations.",
	},
	{
		id: 5,
		title: "Agile Adaptation",
		icon: <RiSpeedLine size={30} />,
		description:
			"In a fast-paced world, adaptability is key. We are committed to continuously evolving and enhancing our tools to meet the dynamic needs of modern businesses, always staying one step ahead.",
	},
	{
		id: 6,
		title: "Empowering Collaboration",
		icon: <MdPeopleOutline size={30} />,
		description:
			"Collaboration is at the heart of business success. Our solutions foster seamless teamwork, enabling cross-functional collaboration to turn complex processes into cohesive, productive workflows.",
	},
];

export default function page() {
	return (
		<section>
			<div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
				<div className="max-w-screen-md mb-8 lg:mb-16">
					<h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
						Jinx with you all the way
					</h2>
					<p className="text-gray-500 sm:text-xl dark:text-gray-400">
						Our values, missions, and perspective
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
					{data?.map((item) => (
						<div className="space-y-8" key={item.id}>
							<div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 border-2 border-slate-600 dark:border-white">
								{item.icon}
							</div>
							<h3 className="mb-2 text-xl font-bold dark:text-white">
								{item.title}
							</h3>
							<p className="text-gray-500 dark:text-gray-400">
								{item.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
