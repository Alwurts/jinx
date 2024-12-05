"use client";
import {
	Calendar,
	Folder,
	Heart,
	Home,
	Inbox,
	Search,
	Settings,
} from "lucide-react";
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
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
	EditProfile,
	type User,
} from "@/app/(protected-app)/dashboard/editProfile";
import { toast } from "react-toastify";

// Menu items.
const items = [
	{
		title: "Home",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Recent files",
		url: "#",
		icon: Folder,
	},
	{
		title: "Search",
		url: "#",
		icon: Search,
	},
	{
		title: "Favorites",
		url: "#",
		icon: Heart,
	},
];
type Props = {
	session: Session | null;
};

export function AppSidebar({ session }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState<User>();
	useEffect(() => {
		const userData = async () => {
			try {
				const response = await fetch("/api/get-user");
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}
				const userData = await response.json();
				setUser(userData.user);
			} catch (error) {
				console.error("Failed to fetch user data:", error);
				toast.error("Something went wrong!", {
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
		};

		userData();
	}, []);
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
	return (
		<Sidebar className=" h-screen flex flex-col">
			<SidebarHeader className="p-4 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<img
						src="/images/logo_icon_single.svg"
						alt="Logo"
						className="w-6 h-6"
					/>
					<h1 className="text-lg font-semibold">jinxify</h1>
				</div>
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent className="flex-1 overflow-y-auto">
				<SidebarGroup>
					<SidebarGroupLabel className="text-gray-400 text-xs uppercase px-4 py-2">
						Application
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a
											href={item.url}
											className="flex items-center space-x-2 p-2 rounded-md"
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator />

			<SidebarFooter className=" p-4 flex flex-col items-center">
				<Avatar>
					<AvatarImage
						src={session?.user?.image ?? "/images/jinx.png"}
						alt="User Avatar"
						className="w-20 h-15 rounded-full"
					/>
					<AvatarFallback>User</AvatarFallback>
				</Avatar>
				<div className="mt-2 text-center">
					<p className="text-sm font-medium">{user?.name}'s workspace</p>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger className="mt-2 text-sm w-full " asChild>
						<Button
							variant="outline"
							className="px-2 py-1 text-xs rounded-md w-full"
						>
							User Profile
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="bg-white text-black border border-gray-200 shadow-lg rounded-md ml- 4 mb-14"
						side="right"
						align="start"
					>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<EditProfile />

						<DropdownMenuItem>
							<Dialog>
								<DialogTrigger className="w-full text-left">
									Delete Account
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Are you absolutely sure?</DialogTitle>
										<DialogDescription>
											This action cannot be undone. This will permanently delete
											your account and remove your data from our servers.
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						</DropdownMenuItem>
					</DropdownMenuContent>
					<Button
						className="px-2 py-1 text-xs rounded-md w-full"
						onClick={handleLogout}
						disabled={isLoading}
						variant="destructive"
					>
						{isLoading ? "Logging out..." : "Logout"}
					</Button>
				</DropdownMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
