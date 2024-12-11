"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/theme-toggle";
import LogoIconMystical from "@/components/icons/logo-icon-mystical";
import { Button } from "@/components/ui/button";
import { FaGripLines } from "react-icons/fa6";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import Navbar from "./navigation-bar";

export default function Header() {
	const pathname = usePathname();
	const [open, setOpen] = React.useState(false);
	const navigationLinks = [
		{
			href: "/",
			label: "Home",
		},
		{
			href: "/blog",
			label: "Blog",
		},
		{
			href: "/about",
			label: "About Us",
		},
		{
			href: "/contact",
			label: "Contact",
		},
	];

	return (
		<nav className="p-4 lg:p-0 bg-card">
			<div className="container mx-auto flex justify-between items-center">
				{/* Logo and Navigation for Desktop */}
				<div className="flex items-center space-x-4">
					<LogoIconMystical className="h-8 w-full text-foreground" />
					<div className="hidden md:flex items-center space-x-4">
						{/*pass nav links as props*/}
						<Navbar navigationLinks={navigationLinks} />
					</div>
				</div>

				{/* Theme Toggle think of styling... */}
				<ThemeToggle />

				{/* Mobile Menu Button */}
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						<Button
							variant="ghost"
							className="-ml-2 mr-2 h-8 w-8 px-0 text-base focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
						>
							<FaGripLines className="!size-6" />
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</DrawerTrigger>

					<DrawerContent
						className="max-h-[60svh] p-0"
						aria-describedby={undefined}
					>
						<div className="overflow-auto p-6">
							<div className="flex flex-col space-y-3 p-1 text-center">
								{navigationLinks.map((link) => (
									<MobileLink
										key={link.href}
										href={link.href}
										onOpenChange={setOpen}
										className={cn(
											"p-1 text-lg hover:underline whitespace-nowrap",
											pathname === link.href &&
												"p-1 rounded-md bg-secondary font-bold underline",
										)}
									>
										{link.label}
									</MobileLink>
								))}
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</nav>
	);
}

interface MobileLinkProps {
	href: string;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
}

function MobileLink({
	href,
	onOpenChange,
	className,
	children,
}: MobileLinkProps) {
	return (
		<Link
			href={href}
			onClick={() => {
				onOpenChange?.(false); // Close the drawer when a link is clicked
			}}
			className={cn("text-base", className)}
		>
			{children}
		</Link>
	);
}
