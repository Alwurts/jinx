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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: null | boolean;
	image: string;
};

export function EditProfile() {
	const queryClient = useQueryClient();

	const [name, setName] = useState("");

	const userQuery = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const response = await fetch("/api/get-user");
			if (!response.ok) {
				throw new Error("Failed to fetch user");
			}
			return response.json();
		},
	});

	useEffect(() => {
		if (userQuery.data) {
			console.log("test", userQuery.data);

			setName(userQuery.data.user.name);
		}
	}, [userQuery.data]);

	const modifyUser = useMutation({
		mutationFn: async (updatedUser: {
			id: string;
			name: string;
		}) => {
			console.log("updatedUser", updatedUser);
			const response = await fetch("/api/user-update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedUser),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to update profile");
			}
			return response.json();
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
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
		},
		onError: (error) => {
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
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("userQuery.data", userQuery.data.user.id);
		if (userQuery.data) {
			modifyUser.mutate({ id: userQuery.data.user.id, name });
		}
	};

	if (userQuery.isLoading) {
		return <p>Loading...</p>;
	}

	if (!userQuery.data) {
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

					<DialogFooter>
						<Button type="submit" disabled={modifyUser.isPending}>
							{modifyUser.isPending ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
