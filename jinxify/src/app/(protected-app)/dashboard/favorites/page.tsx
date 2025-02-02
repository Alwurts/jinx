"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart, HomeIcon } from "lucide-react";
import ImageOverlayHeader from "@/components/layout/image-overlay-header";
import FileCard from "@/components/dashboard/files-view/file-card";
import { FavoriteLoadingSkeleton } from "./favorite-skeleton";
import { DirectoryProvider } from "@/context/directory-context";

export default function Favorites() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["favorites"],
		queryFn: async () => {
			const response = await fetch("/api/favorite");
			const data = await response.json();
			console.log("data: ", data);
			return data;
		},
	});

	if (isLoading) {
		return <FavoriteLoadingSkeleton />;
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center h-full">
				Failed to load favorites.
			</div>
		);
	}

	return (
		<DirectoryProvider directoryUrlId={"root"}>
			<div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
				<ImageOverlayHeader
					title="Favorites"
					icon={<Heart className="size-8 text-primary-foreground z-20" />}
				/>
				<div className="flex-1 overflow-y-auto px-4 pb-8">
					{data.length > 0 ? (
						<ul className="space-y-4 w-full max-w-md">
							{/*@ts-ignore*/}
							{data.map((item) => (
								<FileCard key={item.id} item={item} />
							))}
						</ul>
					) : (
						<div className="text-center text-gray-500 dark:text-creamy mt-8">
							No favorites found. Add items to your favorites by clicking the
							favorite icon in the file menu.
						</div>
					)}
				</div>
			</div>
		</DirectoryProvider>
	);
}
