"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type React from "react";
import { ChatSidebar } from "@/components/chat/sidebar-chat";
import { useChatContext } from "@/components/chat/chat-provider";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TForm } from "@/types/db";
import { QuerySpinner } from "@/components/query/query-spinner";
import { SharePopover } from "@/components/share/share-popover";
import { FormSubmissionsDialog } from "@/components/form-js/submissions-dialog";
import { Input } from "@/components/ui/input";
import { HiPencil } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa6";

const Editor = dynamic(() => import("@/components/form-js/editor"), {
	ssr: false,
	loading: () => (
		<div className="flex-1 flex items-center justify-center">Loading...</div>
	),
});

export default function FormEditor({ params }: { params: { id: string } }) {
	const { jinxChat } = useChatContext();
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState("");

	const { isLoading, data } = useQuery<TForm>({
		queryKey: ["form", params.id],
		queryFn: async () => {
			const response = await fetch(`/api/form/${params.id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch diagram");
			}
			return response.json();
		},
	});

	useEffect(() => {
		if (data) {
			setTitle(data?.title);
		}
	}, [data]);

	const queryClient = useQueryClient();
	const shareUrl = `${window.location.origin}/form/view/${params.id}`;

	// Rename mutation
	const renameMutation = useMutation({
		mutationFn: async () => {
			if (!params?.id) return;
			await fetch(`/api/form/${params.id}`, {
				method: "PATCH",
				body: JSON.stringify({ title: title }),
			});
		},
		onSuccess: () => {
			setIsEditing(false);
			queryClient.invalidateQueries({
				queryKey: ["form", params?.id],
			});
		},
		onError: (error) => {
			console.error("Rename failed:", error.message);
		},
	});

	const handleEditTitle = () => {
		setIsEditing(true);
	};

	const handleButtonClick = () => {
		if (isEditing) {
			renameMutation.mutate();
		} else {
			handleEditTitle();
		}
	};

	return (
		<div className="w-screen h-screen flex flex-col">
			<div className="flex justify-between items-center h-14 px-4 border-b">
				<div className="flex items-center gap-4">
					<Button variant="outline" asChild>
						<Link href={`/dashboard/files?directoryId=${data?.directoryId}`}>
							Back
						</Link>
					</Button>

					<div className="flex items-center">
						{isEditing ? (
							<Input
								type="text"
								placeholder="Edit title..."
								defaultValue={data?.title ?? ""}
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="text-2xl"
							/>
						) : (
							<h1 className="text-2xl font-bold">{data?.title}</h1>
						)}
						<Button
							variant="ghost"
							disabled={renameMutation.isPending}
							onClick={handleButtonClick}
							className="ml-2 p-2 bg-white"
							aria-label="Edit title"
						>
							{isEditing ? (
								<FaCheck className="text-primary" />
							) : (
								<HiPencil className="text-primary" />
							)}
						</Button>
					</div>

					<Separator orientation="vertical" />
				</div>

				<div className="flex items-center gap-2">
					<FormSubmissionsDialog formId={params.id} />
					<SharePopover url={shareUrl} />
					<QuerySpinner />
				</div>
			</div>
			<div className="flex-1 flex relative overflow-hidden">
				{isLoading && !data && (
					<div className="flex-1 flex items-center justify-center">
						Loading...
					</div>
				)}
				{data && <Editor form={data} />}
				<ChatSidebar
					messages={jinxChat.messages}
					input={jinxChat.input}
					setInput={jinxChat.setInput}
					handleSubmit={jinxChat.handleSubmit}
					isLoading={jinxChat.isLoading}
					stop={jinxChat.stop}
				/>
			</div>
		</div>
	);
}
