import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const teamMembers = [
	{ name: "Alejandro Wurts", role: "Teammember", image: "/alwurts.jpg" },
	{
		name: "Ilse Loehr",
		role: "Teammember",
		image: "https://imageplaceholder.net/500",
	},
	{
		name: "Ketjona Lepuri",
		role: "Teammember",
		image: "/ketjona.jpg",
	},
	{
		name: "Xhesika Samarxhiu",
		role: "Teammember",
		image: "/xhesika.jpg",
	},
	{
		name: "Amirali Shaban Khamseh",
		role: "Teammember",
		image: "/amir.jpg",
	},
];

export default function Home() {
	return (
		<main className="container mx-auto px-4 py-4">
			<div className="text-center mb-10">
				<Image
					src="/logo-black.png"
					alt="Jinx Logo"
					width={150}
					height={150}
					className="mx-auto"
				/>
				<h1 className="text-5xl font-bold text-white mb-4">Jinx</h1>
				<p className="text-xl text-purple-100">
					Pioneering AI Web Applications
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{teamMembers.map((member) => (
					<Card
						key={member.name}
						className="bg-white/10 backdrop-blur-lg border-none"
					>
						<CardContent className="p-6 flex flex-col items-center">
							<Image
								src={member.image}
								alt={member.name}
								width={200}
								height={200}
								className="rounded-full mx-auto mb-4 border-4 border-purple-300"
							/>
							<h2 className="text-2xl font-semibold text-white text-center mb-2">
								{member.name}
							</h2>
							<Badge className="bg-purple-500 hover:bg-purple-600 text-white mx-auto">
								{member.role}
							</Badge>
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
