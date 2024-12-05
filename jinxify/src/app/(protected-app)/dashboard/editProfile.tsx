"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: null | boolean;
	image: string;
};

export function EditProfile() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await fetch("/api/get-user");

				if (!response.ok) {
					throw new Error("Failed to fetch user");
				}

				const data = await response.json();

				setUser(data.user);
				setName(data.user.name || "");
				setEmail(data.user.email || "");

				setIsLoading(false);
			} catch (error) {
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
				console.error("Failed to fetch user data:", error);
				setIsLoading(false);
			}
		};

		getUser();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (user) {
				const response = await fetch("/api/user-update", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: user.id,
						name,
						email,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Failed to update profile");
				}
				toast.success("User Data Updated", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});

				const updatedUser = await response.json();

				setUser(updatedUser.user);
			}
		} catch (error) {
			console.error("Error updating profile:", error);
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

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return <p>No user data available</p>;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Edit Profile</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input
							id="name"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="email" className="text-right">
							Email
						</Label>
						<Input
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="col-span-3"
						/>
					</div>

					<DialogFooter>
						<Button type="submit">Save Changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
