"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import type { Session } from "next-auth";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FiEdit } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

type Props = {
	session: Session | null;
};

const profileFormSchema = z.object({
	username: z
		.string()
		.min(2, {
			message: "Username must be at least 2 characters.",
		})
		.max(30, {
			message: "Username must not be longer than 30 characters.",
		}),
	email: z
		.string({
			required_error: "Please enter an email.",
		})
		.email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ session }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	async function fetchUserData() {
		const response = await fetch("/api/get-user");
		if (!response.ok) {
			throw new Error("Failed to fetch user data");
		}
		return response.json();
	}

	const { data: userData, error: userError } = useQuery({
		queryKey: ["user"],
		queryFn: fetchUserData,
	});
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		mode: "onChange",
		values: {
			email: userData?.user?.email,
			username: userData?.user?.name,
		},
	});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);

		if (!session || !session.user) {
			toast({
				title: "Unauthorized",
				description: "Please log in to update your profile.",
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		const formData = new FormData(event.currentTarget);
		const payload = {
			id: session.user?.id, // Fetch the user's ID from the session
			name: formData.get("username") as string, // Map "username" to "name"
		};

		try {
			if (!payload.id) {
				toast({
					title: "Error",
					description: "Invalid session. Unable to update profile.",
					variant: "destructive",
				});
				setIsLoading(false);
				return;
			}

			const response = await fetch("/api/user-update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				toast({
					title: "Update failed",
					description: errorData.message || "An error occurred.",
					variant: "destructive",
				});
				return;
			}

			const responseData = await response.json();
			toast({
				title: "Profile updated",
				description: `Your username has been updated to ${responseData.user.name}`,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "An error occurred",
				description: "Unable to update your profile at this time.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div>
			<div className="pt-8 pb-2">
				<div className="flex items-center space-x-2">
					<FiEdit className="w-6 h-6 dark:text-secondary" />
					<h3 id="edit-profile-form" className="text-2xl font-semibold dark:text-secondary">
						Edit Profile
					</h3>
				</div>
				<p className="text-sm text-muted-foreground">
					Manage your profile data.
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={handleSubmit} className="py-4 space-y-8">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username*</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter new username"
										{...field}
										type="text"
										name="username"
										required
									/>
								</FormControl>
								<FormDescription>
									This is your public display name. It can be your real name or
									a pseudonym.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder={userData?.user?.email || "User Email"}
										{...field}
										type="email"
										name="email"
										disabled
									/>
								</FormControl>
								<FormDescription>
									We're sorry, but for authentication reasons, you're unable to
									update your email address at this time.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Updating..." : "Update profile"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
