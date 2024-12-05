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
import type { TDiagram, TDirectory } from "@/types/db";
import { boolean } from "drizzle-orm/pg-core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
type Props = {
	item: TDiagram | TDirectory | null;
	close: (open: boolean) => void;
};

export default function DeleteDiagram({ item, close }: Props) {
	const queryClient = useQueryClient();
	const deleteMutation = useMutation({
		mutationFn: async (values: {
			id: string | undefined;
			type: "diagram" | "directory";
		}) => {
			await fetch(`/api/workspace/${values.id}`, {
				method: "DELETE",
				body: JSON.stringify({ type: values.type }),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["directory", item?.directoryId],
			});
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
						account and remove your data from our servers.
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
