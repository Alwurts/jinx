"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/theme-toggle";

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
		<nav className="p-4 bg-card">
			<div className="container mx-auto flex justify-between items-center">
				<ul className="flex space-x-4">
					{navigationLinks.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className={cn(
									"text-lg hover:underline",
									pathname === link.href && "font-bold underline",
								)}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
				<ThemeToggle />
			</div>
		</nav>
	);
}
