import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LogoText from "@/components/icons/logo-text";

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
				<LogoText className="w-full h-44 mx-auto text-foreground" />
				<h1 className="sr-only">Jinx</h1>
				<p className="text-xl">
					Pioneering AI Web Applications - We are solving the unresolved.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{teamMembers.map((member) => (
					<Card
						key={member.name}
						className=""
					>
						<CardContent className="p-6 flex flex-col items-center">
							<Image
								src={member.image}
								alt={member.name}
								width={200}
								height={200}
								className="rounded-full mx-auto mb-4 border-4 "
							/>
							<h2 className="text-2xl font-semibold text-center mb-2">
								{member.name}
							</h2>
							<Badge className="mx-auto">
								{member.role}
							</Badge>
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
