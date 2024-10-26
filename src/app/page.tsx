import Image from "next/image";
import { Card, CardContent, CardMemberInfo } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LogoText from "@/components/icons/logo-text";

const teamMembers = [
	{
		name: "Alejandro Wurts",
		role: "CEO",
		image: "/alwurts_adult.jpg",
		coffeeOrder: "Dirty Latte",
		techTool: "",
		techToolLink: "",
		instaLink: "",
		linkedInLink: "",
	},
	{
		name: "Ilse Löhr",
		role: "PM & CCO",
		image: "/ilse_adult.jpg",
		coffeeOrder: "Pumpkin Spice Latte",
		techTool: "Tailwind CSS",
		techToolLink: "https://tailwindcss.com/",
		instaLink: "https://www.instagram.com/ilseloehr/?hl=de",
		linkedInLink:
			"https://de.linkedin.com/in/ilse-l%C3%B6hr-687b681b8?trk=people-guest_people_search-card",
	},
	{
		name: "Ketjona Lepuri",
		role: "CFO & HoS",
		image: "/ketjona_adult.jpg",
		coffeeOrder: "Latte Grand",
		techTool: "",
		techToolLink: "",
		instaLink: "",
		linkedInLink: "",
	},
	{
		name: "Xhesika Samarxhiu",
		role: "CMO",
		image: "/xhesika_adult.jpg",
		coffeeOrder: "Cappucino",
		techTool: "",
		techToolLink: "",
		instaLink: "",
		linkedInLink: "",
	},
	{
		name: "Amirali Shaban Khamseh",
		role: "CTO",
		image: "/amir_adult.jpg",
		coffeeOrder: "Americano",
		techTool: "",
		techToolLink: "",
		instaLink: "",
		linkedInLink: "",
	},
];

export default function Home() {
	return (
		<main className="container mx-auto px-4 py-4">
			<div className="text-center mb-12">
				<LogoText className="w-full h-44 mx-auto text-foreground" />
				<h1 className="sr-only">Jinx</h1>
				<p className="text-xl">
					Pioneering AI Web Applications - We’re the Ones Solving the Unsolved.
				</p>
			</div>

			<Separator className="mt-4" />

			<div className="mt-24 mb-16 text-center">
				<p className="scroll-m-20 text-lg font-extrabold tracking-tight mb-1.5">
					The Investigators
				</p>
				<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
					Meet Our Team
				</h1>
			</div>

			<div className="flex flex-col items-start mb-5">
				{teamMembers.map((member) => (
					<Card
						key={member.name}
						className="mb-10 w-full max-w-2xl mx-auto py-10"
					>
						<CardContent className="flex flex-col lg:flex-row items-center lg:space-x-8 space-y-6 lg:space-y-0 px-2 lg:px-0">
							{/* Profile Picture */}
							<div className="relative lg:w-1/3 w-full flex justify-center lg:justify-start">
								<Image
									src={member.image}
									alt={member.name}
									width={220}
									height={220}
									className="rounded-full border-2 border-border shadow-lg lg:-ml-12"
								/>
							</div>

							{/* Member Info */}
							<CardMemberInfo {...member} />
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
