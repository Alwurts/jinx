import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import LinkedInIcon from "@/components/icons/logo-linkedIn";
import { Card, CardContent } from "@/components/ui/card";
import type { Member } from "@/types/members";
import { MemberImage } from "@/components/members/member-image";
import XIcon from "@/components/icons/logo-x";

export function CardMemberInfo({
	name,
	image,
	youngImage,
	role,
	coffeeOrder,
	techTool,
	techToolLink,
	linkedInLink,
	xLink,
}: Member) {
	return (
		<Card key={name} className="mb-10 w-full max-w-2xl mx-auto py-10">
			<CardContent className="flex flex-col lg:flex-row items-center lg:space-x-8 space-y-6 lg:space-y-0 px-2 lg:px-0">
				<div className="relative lg:w-1/3 w-full flex justify-center lg:justify-start">
					<div className="lg:-ml-12">
						<MemberImage
							currentImage={image}
							youngImage={youngImage}
							name={name}
						/>
					</div>
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
						{linkedInLink && (
							<Link
								href={linkedInLink}
								target="_blank"
								className="hover:text-foreground text-sm"
							>
								<LinkedInIcon className="h-12 lg:h-6" />
							</Link>
						)}
						{xLink && (
							<Link
								href={xLink}
								target="_blank"
								className="hover:text-foreground text-sm"
							>
								<XIcon className="h-12 lg:h-6" />
							</Link>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
