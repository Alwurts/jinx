"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	return (
		<div className="w-full">
			<div className="flex flex-col gap-2 w-full">
				<Button
					variant="default"
					type="button"
					onClick={() => signIn("google")}
					className="w-full"
					disabled={isLoading}
				>
					{isLoading ? (
						<ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<FaGoogle className="mr-2 h-4 w-4" />
					)}
					Google
				</Button>
				<Button
					variant="outline"
					type="button"
					onClick={() => signIn("github")}
					className="w-full"
					disabled={isLoading}
				>
					{isLoading ? (
						<ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<FaGithub className="mr-2 h-4 w-4" />
					)}
					GitHub
				</Button>
			</div>
		</div>
	);
}
