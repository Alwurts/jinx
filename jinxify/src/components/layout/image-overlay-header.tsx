import React from "react";
import Image from "next/image";

// Define the props for the component
type ImageOverlayHeaderProps = {
	imageSrc: string;
	title: string;
	overlayOpacity?: number;
};

export default function ImageOverlayHeader({
	imageSrc,
	title,
	overlayOpacity = 85,
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
				className="rounded-t-lg absolute inset-0 z-10"
				style={{
					backgroundColor: "#723FDF",
					opacity: overlayOpacity / 100,
				}}
			/>

			<h1 className="relative p-8 text-secondary text-3xl font-bold mb-1 z-20">
				{title}
			</h1>
		</div>
	);
}
