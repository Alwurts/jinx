"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { TForm } from "@/types/db";
import { QuerySpinner } from "@/components/query/query-spinner";
import dynamic from "next/dynamic";

const FormViewer = dynamic(() => import("@/components/form-js/viewer"), {
	ssr: false,
	loading: () => (
		<div className="flex-1 flex items-center justify-center">Loading...</div>
	),
});

export default function FormView({ params }: { params: { id: string } }) {
	const { isLoading, data } = useQuery<TForm>({
		queryKey: ["form", params.id],
		queryFn: async () => {
			const response = await fetch(`/api/form/${params.id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch form");
			}
			return response.json();
		},
	});

	return (
		<div className="w-screen h-screen flex flex-col">
			<div className="flex justify-between items-center h-14 px-4 border-b">
				<div className="flex items-center gap-4">
					<h1 className="text-2xl">
						Submit data for:{" "}
						<span className="font-bold">{data?.title || "Form"}</span>
					</h1>
				</div>

				<div className="flex items-center gap-2">
					<QuerySpinner />
				</div>
			</div>
			<div className="flex-1 flex relative overflow-hidden container mx-auto">
				{isLoading && !data && (
					<div className="flex-1 flex items-center justify-center">
						Loading...
					</div>
				)}
				{data && <FormViewer form={data} />}
			</div>
		</div>
	);
}
