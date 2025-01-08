"use client";
import { Folder, Heart, Home, Search } from "lucide-react";
import { TbHelpSquare } from "react-icons/tb";
import { GiSettingsKnobs } from "react-icons/gi";
import { GoPeople } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { GrTask } from "react-icons/gr";
import { FiEdit } from "react-icons/fi";
import { CgLogOut } from "react-icons/cg";
import { VscSettings } from "react-icons/vsc";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Logo from "../icons/logo-icon";
import Link from "next/link";

// Menu items.
const applicationItems = [
	{
		title: "Dashbord",
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
		title: "Help",
		url: "https://jinx-team.vercel.app/contact",
		icon: TbHelpSquare,
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
	const [isLoading, setIsLoading] = useState(false);
	const { data: userData, error: userError } = useQuery({
		queryKey: ["user"],
		queryFn: fetchUserData,
	});

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

	useEffect(() => {
		if (userError) {
			toast.error("Failed to load user data", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		}
	}, [userError]);
	return (
		<Sidebar className="h-screen rounded-tr-lg flex flex-col">
			<SidebarHeader className="p-9 bg-[url('/images/diamond.png')] bg-cover bg-top rounded-tr-lg">
				<div className="flex items-center space-x-3">
					<Logo className="w-10 h-10 brightness-0 invert" />
					<h1 className="text-xl font-semibold text-white">jinxify Portal</h1>
				</div>
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent className="flex-1">
				<SidebarGroup>
					<SidebarGroupLabel className="text-gray-400 text-sm px-4 py-2 mt-2 mb-2 font-semibold">
						Application
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{applicationItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link
											href={item.url}
											className="group/item  flex items-center space-x-3 px-4 py-2 font-semibold text-gray-700 hover:bg-primary/5 cursor-pointer w-full rounded-lg transition-all duration-200"
										>
											<span className="text-gray-700 group-hover/item:text-purple-700">
												<item.icon className="w-5 h-5" />
											</span>
											<span className="group-hover/item:text-purple-700">
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
					<SidebarGroupLabel className="text-gray-400 text-sm px-4 py-2 mb-2 font-semibold">
						Settings
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{settingsItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a
											href={item.url}
											className="group/item  flex items-center space-x-3 px-4 py-2 font-semibold text-gray-700 hover:bg-primary/5 cursor-pointer w-full rounded-lg"
										>
											<div className="text-gray-700 group-hover/item:text-purple-700">
												<item.icon className="w-5 h-5" />
											</div>
											<span className="group-hover/item:text-purple-700">
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
			<SidebarFooter className="p-6 mb-4 ">
				<SidebarGroupLabel className="text-gray-400 text-sm px-4 py-5 font-semibold">
					Profile
				</SidebarGroupLabel>
				<DropdownMenu>
					<DropdownMenuTrigger className="w-full rounded-lg focus:outline-none">
						<div className="flex items-center space-x-3 p-4 mb-3 rounded-md bg-gray-50 border border-gray-200 shadow-md hover:bg-purple-50 cursor-pointer transition-all duration-200 hover:shadow-md">
							<Avatar>
								<AvatarImage
									src={session?.user?.image ?? "/images/jinx.png"}
									alt="User Avatar"
								/>
								<AvatarFallback>User</AvatarFallback>
							</Avatar>
							<div className="flex-1 text-left">
								<p className="text-sm font-medium">
									{userData?.user?.name || "User"}
								</p>
								<p className="text-xs text-gray-500">My Workspace</p>
							</div>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-56 mb-12 bg-gray-50"
						side="right"
						align="start"
						alignOffset={-70}
						sideOffset={10}
					>
						<div className="flex items-center space-x-3 p-4 mb-1  rounded-md bg-[url('/images/diamond.png')] bg-cover bg-center border border-gray-50 shadow-sm hover:bg-purple-50 cursor-pointer transition-all duration-200 hover:shadow-md">
							<div className="flex-1 text-center">
								<p className="text-sm font-medium text-white">User Profile</p>
							</div>
						</div>

						<Link href="/dashboard/preferences/#account-form">
							<DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 ">
								<VscAccount className="w-4 h-4" />
								<span>Account</span>
							</DropdownMenuItem>
						</Link>

						<DropdownMenuSeparator />

						<div className="py-1">
							<Link href="/dashboard/preferences/#edit-profile-form">
								<DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 ">
									<FiEdit className="w-4 h-4" />
									<span>Edit Profile</span>
								</DropdownMenuItem>
							</Link>

							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="flex items-center space-x-2 px-3 py-2 "
								onClick={handleLogout}
							>
								<CgLogOut className="w-4 h-4 space-x-2" />
								<span>{isLoading ? "Logging out..." : "Log out"}</span>
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
