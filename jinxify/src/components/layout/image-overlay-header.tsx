import React, { type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";
import { Button } from "../ui/button";

type ImageOverlayHeaderProps = {
	title: string;
	className?: string;
	leftToolbar?: ReactNode;
	rightToolbar?: ReactNode;
	icon?: ReactNode;
};

export default function ImageOverlayHeader({
	title,
	className,
	icon,
	leftToolbar,
	rightToolbar,
}: ImageOverlayHeaderProps) {
	return (
		<div className="relative flex items-center justify-between p-10 gap-4">
			<Image
				src="/images/diamonds_3d_photo.png"
				width={1200}
				height={200}
				alt="Background Image"
				className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg opacity-90 dark:opacity-95"
			/>
			<div className="flex z-20 gap-4">
				{leftToolbar}
				<div
					className={cn(
						"absolute inset-0 rounded-t-lg bg-primary/95 dark:bg-primary/85",
						className,
					)}
				/>
				{icon}

				<h1 className="text-primary-foreground text-3xl z-10 font-bold">
					{title}
				</h1>
			</div>
			<div className="z-20">{rightToolbar}</div>
		</div>
	);
}
