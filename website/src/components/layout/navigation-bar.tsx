"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/theme-toggle";
import LogoIconMystical from "@/components/icons/logo-icon-mystical";

export default function Navbar({
	navigationLinks = [],
}: { navigationLinks: { href: string; label: string }[] }) {
	const pathname = usePathname();
	return (
		<nav className="p-4 bg-card">
			<div className="container mx-auto flex justify-between items-center">
				<ul className="flex items-center justify-center space-x-4">
					<LogoIconMystical className="h-8 w-full text-foreground" />
					{navigationLinks.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className={cn(
									"text-lg hover:underline whitespace-nowrap",
									pathname === link.href && "font-bold underline",
								)}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}

Navbar.defaultProps = {
	navigationLinks: [
		{ href: "/", label: "Home" },
		{ href: "/blog", label: "Blog" },
		{ href: "/about", label: "About Us" },
		{ href: "/contact", label: "Contact" },
	],
};
