"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const pathname = usePathname();
	const navigationLinks = [
		{
			href: "/",
			label: "Home",
		},
		{
			href: "/blog",
			label: "Blog",
		},
	];
	return (
		<nav className="bg-white/10 backdrop-blur-lg p-4">
			<ul className="w-fit flex space-x-4 mx-auto">
				{navigationLinks.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className={cn(
								"text-white text-lg hover:underline",
								pathname === link.href && "font-bold underline",
							)}
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
