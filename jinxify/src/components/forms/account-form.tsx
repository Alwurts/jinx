"use client";

import type { Session } from "next-auth";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { VscAccount } from "react-icons/vsc";
import { toast } from "@/hooks/use-toast";

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

export const AccountForm = ({ session }: Props) => {
	const [isLoading, setIsLoading] = useState(false);

	const { data: userData, error: userError } = useQuery({
		queryKey: ["user"],
		queryFn: fetchUserData,
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (userError) {
		// Trigger a toast notification and render an error message
		toast({
			title: "Failed to load user data",
		});

		return (
			<div className="pt-8 pb-2">
				<p className="text-red-500">
					Failed to load user data. Please try again later.
				</p>
			</div>
		);
	}

	return (
		<div className="pb-8">
			<div className="pt-8 pb-2">
				<div className="flex items-center space-x-2">
					<VscAccount className="w-6 h-6" />
					<h3 id="account-form" className="text-2xl font-semibold">
						Account
					</h3>
				</div>
				<p className="text-sm text-muted-foreground">
					Check your profile data:
				</p>
				<div className="text-sm mt-4 space-y-4">
					<p>
						<span className="font-semibold">Name:</span>{" "}
						{userData?.user?.name || "User"}
					</p>
					<p>
						<span className="font-semibold">Email:</span>{" "}
						{userData?.user?.email || "User Email"}
					</p>
				</div>
			</div>
		</div>
	);
};
