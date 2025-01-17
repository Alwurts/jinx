"use client";
import { Folder, Heart, Home, Search } from "lucide-react";
import { TbHelpSquare } from "react-icons/tb";
import { FaRegLightbulb } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { GrTask } from "react-icons/gr";
import { FiEdit } from "react-icons/fi";
import { CgLogOut } from "react-icons/cg";
import { VscSettings } from "react-icons/vsc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

type DiagramType = {
	id: string;
	title: string;
	content: string;
	type: "diagram";
	directoryId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
};

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Logo from "../icons/logo-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const applicationItems = [
	{
		title: "Dashboard",
		url: "/dashboard/home",
		icon: Home,
	},
	{
		title: "Files",
		url: "/dashboard/files",
		icon: Folder,
	},
	{
		title: "Task Manager",
		url: "/dashboard/task-manager",
		icon: GrTask,
	},
	{
		title: "Favorites",
		url: "#",
		icon: Heart,
	},
	{
		title: "Search",
		url: "#",
		icon: Search,
	},
];

const settingsItems = [
	{
		title: "Preferences",
		url: "/dashboard/preferences",
		icon: VscSettings,
	},
	{
		title: "FAQs",
		url: "/dashboard/faq",
		icon: FaRegLightbulb,
	},
	{
		title: "About jinx",
		url: "https://jinx-team.vercel.app/about",
		icon: GoPeople,
	},
];

type Props = {
	session: Session | null;
};

async function fetchUserData() {
	const response = await fetch("/api/get-user");
	if (!response.ok) {
		throw new Error("Failed to fetch user data");
	}
	return response.json();
}

export function AppSidebar({ session }: Props) {
	const [searchBoxOpen, setSearchBoxOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [searchResults, setSearchResults] = useState<DiagramType[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const { data: userData, error: userError } = useQuery({
		queryKey: ["user"],
		queryFn: fetchUserData,
	});
	const pathname = usePathname();

	async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		try {
			const response = await fetch("/api/search", {
				method: "POST",
				body: JSON.stringify(e.target.value),
			});
			if (!response.ok) {
				throw new Error("Something went wrong!");
			}
			const result = await response.json();
			setSearchResults(result.data);
		} catch (error) {
			console.log(error);
		}
	}

	const handleNext = () => {
		if (currentIndex + 5 < searchResults.length) {
			setCurrentIndex(currentIndex + 5);
		}
	};

	const handlePrevious = () => {
		if (currentIndex - 5 >= 0) {
			setCurrentIndex(currentIndex - 5);
		}
	};

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await signOut({
				callbackUrl: "/",
			});
		} catch (error) {
			console.error("Logout failed", error);
			setIsLoading(false);
		}
	};

	const isActive = (url: string) => {
		return pathname === url;
	};

	useEffect(() => {
		if (userError) {
			toast.error("Failed to load user data");
		}
	}, [userError]);

	return (
		<Sidebar className="h-screen rounded-tr-lg flex flex-col bg-background border-r border-border">
			<div className="flex flex-col h-full bg-background">
				{searchBoxOpen && (
					<Dialog open={searchBoxOpen} onOpenChange={setSearchBoxOpen}>
						<DialogContent className="bg-background">
							<DialogHeader>
								<DialogTitle>Search</DialogTitle>
							</DialogHeader>
							<input
								type="text"
								onChange={handleSearch}
								className="bg-background"
							/>
							<div>
								<ul>
									{searchResults
										.slice(currentIndex, currentIndex + 5)
										.map((result, index) => (
											<li key={result.id} className="mb-2">
												<Link
													href={`/dashboard/home/${result.id}`}
													className="dark:text-white"
												>
													{currentIndex + index} : {result.title}
												</Link>
											</li>
										))}
								</ul>
								<div className="mt-4 flex justify-between gap-2">
									<button
										type="button"
										onClick={handlePrevious}
										disabled={currentIndex === 0}
										className="group/item flex-1 flex items-center justify-center space-x-3 px-4 py-2 font-semibold text-gray-700 dark:text-white hover:bg-primary/5 cursor-pointer rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<span className="group-hover/item:text-purple-700 disabled:group-hover/item:text-gray-700 dark:group-hover/item:text-white dark:text-white">
											Previous
										</span>
									</button>
									<button
										type="button"
										onClick={handleNext}
										disabled={currentIndex + 5 >= searchResults.length}
										className="group/item flex-1 flex items-center justify-center space-x-3 px-4 py-2 font-semibold text-gray-700 dark:text-white hover:bg-primary/5 cursor-pointer rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<span className="group-hover/item:text-purple-700 disabled:group-hover/item:text-gray-700 dark:group-hover/item:text-white dark:text-white">
											Next
										</span>
									</button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				)}

				<SidebarHeader className="relative rounded-tr-lg">
					<div className="relative w-full h-full p-9 ">
						<Image
							src="/images/diamonds_3d_photo.png"
							width={260}
							height={120}
							alt="Background Image"
							className="absolute top-0 left-0 w-full h-full object-cover rounded-tr-lg opacity-90 dark:opacity-95"
						/>
						<div className="flex z-20 gap-4">
							<div
								className={cn(
									"absolute inset-0 rounded-tr-lg bg-primary/95 dark:bg-primary/85",
								)}
							/>
							<div className="flex items-center space-x-3 text-foreground relative z-10">
								<Logo className="w-10 h-10 text-primary-foreground" />
								<h1 className="text-xl font-semibold text-primary-foreground">
									jinxify Portal
								</h1>
							</div>
						</div>
					</div>
				</SidebarHeader>

				<SidebarSeparator />

				<SidebarContent className="flex-1 bg-background">
					<SidebarGroup>
						<SidebarGroupLabel className="text-mystical/65 text-xs px-4 py-2 mb-2 font-semibold dark:text-white/40">
							Application
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{applicationItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<Link
												href={item.url}
												className={`group/item flex items-center space-x-3 px-4 py-2 cursor-pointer w-full rounded-lg ${
													isActive(item.url)
														? "text-royal-purple dark:text-creamy"
														: "text-mystical dark:text-creamy hover:bg-creamy dark:hover:text-primary"
												}`}
												onClick={() =>
													item.title === "Search" &&
													setSearchBoxOpen((prev) => !prev)
												}
											>
												<span
													className={`${
														isActive(item.url)
															? "text-royal-purple dark:text-primary"
															: "text-mystical dark:text-creamy group-hover/item:text-royal-purple dark:group-hover/item:text-primary"
													}`}
												>
													<item.icon className="w-5 h-5" />
												</span>
												<span
													className={`text-md ${
														isActive(item.url)
															? "text-royal-purple dark:text-primary"
															: "group-hover/item:text-royal-purple dark:group-hover/item:text-primary"
													}`}
												>
													{item.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarGroup className="mt-20">
						<SidebarGroupLabel className="text-mystical/65 text-xs px-4 py-2 mb-2 font-semibold dark:text-white/40">
							Settings
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{settingsItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<a
												href={item.url}
												className={`group/item flex items-center space-x-3 px-4 py-2 cursor-pointer w-full rounded-lg ${
													isActive(item.url)
														? "text-royal-purple dark:text-primary"
														: "text-mystical dark:text-creamy  hover:bg-creamy dark:hover:text-primary"
												}`}
											>
												<span
													className={`${
														isActive(item.url)
															? "text-royal-purple dark:text-primary"
															: "text-mystical dark:text-creamy group-hover/item:text-royal-purple dark:group-hover/item:text-primary"
													}`}
												>
													<item.icon className="w-5 h-5" />
												</span>
												<span
													className={`text-md ${
														isActive(item.url)
															? "text-royal-purple dark:text-primary"
															: "group-hover/item:text-royal-purple  dark:group-hover/item:text-primary"
													}`}
												>
													{item.title}
												</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<div className="py-3 px-3">
					<SidebarSeparator />
				</div>

				<SidebarFooter className="p-6 mb-4">
					<SidebarGroupLabel className="text-mystical/65 text-xs px-2 py-2 font-semibold dark:text-white/40">
						Profile
					</SidebarGroupLabel>
					<DropdownMenu>
						<DropdownMenuTrigger className="w-full rounded-lg focus:outline-none">
							<div className="flex items-center space-x-3 p-4 mb-3 rounded-md bg-white dark:bg-accent/50 border border-border shadow-md transition-shadow hover:bg-gray-50 cursor-pointer">
								<Avatar>
									<AvatarImage
										src={session?.user?.image ?? "/images/jinx.png"}
										alt="User Avatar"
									/>
									<AvatarFallback>User</AvatarFallback>
								</Avatar>
								<div className="flex-1 text-left">
									<p className="text-sm font-medium text-mystical dark:text-white">
										{userData?.user?.name || "User"}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-300">
										My Workspace
									</p>
								</div>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-56 mb-12 bg-white dark:bg-background"
							side="right"
							align="start"
							alignOffset={-70}
							sideOffset={10}
						>
							<div className="flex items-center space-x-3 p-4 mb-1 rounded-md bg-[url('/images/diamond.png')] bg-cover bg-center  shadow-sm hover:bg-purple-50 cursor-pointer transition-all duration-200 hover:shadow-md">
								<div className="flex-1 text-center">
									<p className="text-sm font-medium text-white">User Profile</p>
								</div>
							</div>

							<Link href="/dashboard/preferences/#account-form">
								<DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-background dark:text-white">
									<VscAccount className="w-4 h-4" />
									<span>Account</span>
								</DropdownMenuItem>
							</Link>

							<DropdownMenuSeparator />

							<div className="py-1">
								<Link href="/dashboard/preferences/#edit-profile-form">
									<DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 dark:text-white cursor-pointer">
										<FiEdit className="w-4 h-4" />
										<span>Edit Profile</span>
									</DropdownMenuItem>
								</Link>

								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="flex items-center space-x-2 px-3 py-2 dark:text-white cursor-pointer"
									onClick={handleLogout}
								>
									<CgLogOut className="w-4 h-4 space-x-2" />
									<span>{isLoading ? "Logging out..." : "Log out"}</span>
								</DropdownMenuItem>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarFooter>
			</div>
		</Sidebar>
	);
}
