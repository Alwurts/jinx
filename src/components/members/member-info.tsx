import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import LinkedInIcon from "@/components/icons/logo-linkedIn";
import { Card, CardContent } from "@/components/ui/card";
import type { Member } from "@/types/members";
import Image from "next/image";

export function CardMemberInfo({
	name,
	image,
	role,
	coffeeOrder,
	techTool,
	techToolLink,
	linkedInLink,
}: Member) {
	return (
		<Card key={name} className="mb-10 w-full max-w-2xl mx-auto py-10">
			<CardContent className="flex flex-col lg:flex-row items-center lg:space-x-8 space-y-6 lg:space-y-0 px-2 lg:px-0">
				<div className="relative lg:w-1/3 w-full flex justify-center lg:justify-start">
					<Image
						src={image}
						alt={name}
						width={220}
						height={220}
						className="rounded-full border-2 border-border shadow-lg lg:-ml-12"
					/>
				</div>

				<div className="flex-grow flex flex-col w-full lg:w-2/3 lg:pl-16 border-t lg:border-t-0 lg:border-l-[1.5px] border-border pt-6 lg:pt-0 items-center lg:items-start">
					<div className="flex flex-col items-center lg:items-start mb-2">
						<h2 className="text-2xl font-semibold mb-2">{name}</h2>
						<Badge className="mt-1 mb-4 text-sm">{role}</Badge>
					</div>
					<p className="text-sm">
						<strong>Coffee Order:</strong> {coffeeOrder || "Not provided"}
					</p>
					<p className="text-sm">
						<strong>Favorite Tech-Tool:</strong>{" "}
						{techToolLink ? (
							<Link
								href={techToolLink}
								className="underline hover:text-foreground"
							>
								{techTool}
							</Link>
						) : (
							techTool || "Not provided"
						)}
					</p>
					<div className="flex space-x-1 mt-4 text-gray-500 dark:text-gray-400">
						<Link
							href={linkedInLink || "#"}
							className="hover:text-foreground text-sm"
						>
							<LinkedInIcon className="h-12 lg:h-6" />
						</Link>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
