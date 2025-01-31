import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import type { TDiagram, TDirectory, TForm, TDocument } from "@/types/db";
import { boolean } from "drizzle-orm/pg-core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDirectory } from '@/context/directory-context';

type Props = {
	item: TDiagram | TDirectory | TForm | TDocument | null;
	close: (open: boolean) => void;
};

export function DeleteDialog({ item, close }: Props) {
	const queryClient = useQueryClient();
	const { directoryUrlId } = useDirectory();

	const deleteMutation = useMutation({
		mutationFn: async (values: {
			id: string | undefined;
			type: "diagram" | "directory" | "form" | "document";
		}) => {
			await fetch(`/api/workspace/${values.id}`, {
				method: "DELETE",
				body: JSON.stringify({ type: values.type }),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["directory", directoryUrlId],
			});
			if (item?.directoryId) {
				queryClient.invalidateQueries({
					queryKey: ["directory", item.directoryId],
				});
			}
			close(false);
		},
	});
	return (
		<AlertDialog open={Boolean(item)} onOpenChange={close}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						{item?.type === "directory"
							? " folder"
							: item?.type === "diagram"
								? " diagram"
								: item?.type === "form"
									? " form"
									: " document"}{" "}
						and remove it from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							if (!item?.id || !item?.type) {
								return;
							}
							deleteMutation.mutate({
								id: item?.id,
								type: item?.type,
							});
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
