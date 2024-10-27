"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Clock, Clock10Icon } from "lucide-react";

interface MemberImageProps {
	currentImage: string;
	youngImage: string;
	name: string;
}

export function MemberImage({
	currentImage,
	youngImage,
	name,
}: MemberImageProps) {
	const [showYoungImage, setShowYoungImage] = useState(false);

	return (
		<div className="relative w-[220px] h-[220px]">
			<div className="aspect-square w-full h-full rounded-full overflow-hidden border-2 border-border shadow-lg">
				<div className="relative w-full h-full">
					<Image
						src={showYoungImage ? youngImage : currentImage}
						alt={name}
						quality={100}
						fill
						sizes="220px"
						className="rounded-full object-cover transition-opacity duration-300"
						priority
					/>
				</div>
			</div>

			<Button
				size="icon"
				variant="secondary"
				className="absolute bottom-2 right-2 rounded-full h-10 w-10 shadow-lg"
				onClick={() => setShowYoungImage(!showYoungImage)}
			>
				{showYoungImage ? (
					<Clock className="h-5 w-5" />
				) : (
					<Clock10Icon className="h-5 w-5" />
				)}
			</Button>
		</div>
	);
}
