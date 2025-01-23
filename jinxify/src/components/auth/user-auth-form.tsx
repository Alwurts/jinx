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
			{/* <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}
			<div className="flex flex-col gap-2 w-full">
				<Button
					variant="default"
					type="button"
					onClick={() => signIn("github", { callbackUrl: "/dashboard/home" })}
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
				<Button
					variant="outline"
					type="button"
					onClick={() => signIn("google", { callbackUrl: "/dashboard/home" })}
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
			</div>
		</div>
	);
}
