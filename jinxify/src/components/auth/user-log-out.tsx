"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";

export function UserLogOut() { 
  const [isLoading, setIsLoading] = useState(false);

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
         <Button
            className="px-1"
            type="button"
			onClick={handleLogout}
			disabled={isLoading}
			variant="link">
			{isLoading ? "Logging out..." : "Logout"}
		  </Button>
	);
}