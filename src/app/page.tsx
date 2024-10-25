import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const teamMembers = [
	{ name: "Alejandro Wurts", role: "CEO", image: "/alwurts_adult.jpg" },
	{
		name: "Ilse Löhr",
		role: "Product Manager and CCO",
		image: "/ilse_adult.jpg",
	},
	{
		name: "Ketjona Lepuri",
		role: "CFO and Head of Sales",
		image: "/ketjona_adult.jpg",
	},
	{
		name: "Xhesika Samarxhiu",
		role: "CMO and Communication",
		image: "/xhesika_adult.jpg",
	},
	{
		name: "Amirali Shaban Khamseh",
		role: "CTO",
		image: "/amir_adult.jpg",
	},
];

export default function Home() {
	return (
		<main className="container mx-auto px-4 py-4">
			<div className="text-center mb-10">
				<Image
					src="/jinx_logo_white_big.svg"
					alt="Jinx Logo"
					width={150}
					height={150}
					className="mx-auto"
				/>

				<p className="text-xl text-purple-100">
					Pioneering AI Web Applications - We are solving the unresolved.
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
