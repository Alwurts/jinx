import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Define the props for the component
type ImageOverlayHeaderProps = {
	imageSrc: string;
	title: string;
	className?: string;
};

export default function ImageOverlayHeader({
	imageSrc,
	title,
	className,
}: ImageOverlayHeaderProps) {
	return (
		<div className="relative">
			<Image
				src={imageSrc}
				width={1200}
				height={200}
				alt="Background Image"
				className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
			/>

			<div
				className={cn(
					"absolute inset-0 z-10 rounded-t-lg bg-[#723FDF] opacity-85",
					className,
				)}
			/>

			<h1 className="relative p-8 text-secondary text-3xl font-bold mb-1 z-20">
				{title}
			</h1>
		</div>
	);
}
