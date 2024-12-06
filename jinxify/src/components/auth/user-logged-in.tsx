"use client";

import * as React from "react";
import { useRouter } from 'next/navigation' 
import { Button } from "../ui/button";

export function UserLoggedIn() { 
  const router = useRouter()

	return (
		<div className="w-full">
         <Button
            variant="default"
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full"
            >
            Enter Your jinxify Portal
         </Button>
		</div>
	);
}