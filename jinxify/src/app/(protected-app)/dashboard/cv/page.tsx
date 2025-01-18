"use client";

interface ContentItem {
	type: "text";
	text: {
		value: string;
		annotations: {
			type: "file_citation";
			text: string;
			start_index: number;
			end_index: number;
			file_citation: {
				file_id: string;
			};
		}[];
	};
}

interface ResponseData {
	role: "assistant";
	content: ContentItem[];
}

import React, { type FormEvent, useState } from "react";
import { toast } from "react-toastify";

function page() {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<ResponseData | null>(null);

	async function submitHandler(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		try {
			setIsLoading(true);
			const response = await fetch("/api/cv", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result: ResponseData = await response.json();
			setResult(result);
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong!" + error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="container w-full flex flex-col justify-center align-center ">
			<form onSubmit={submitHandler} className="flex flex-col justify-center">
				<label htmlFor="">CV</label>
				<input type="file" name="pdf-file" className="border-2 border-black" />
				<input
					type="text"
					name="job-description"
					className="border-2 border-black"
				/>
				<button type="submit" className="border-2 border-black">
					Submit
				</button>
			</form>

			{result && (
				<div>
					{/* Display the result here */}
					{result.content.map((item, index) => (
						<div key={index}>
							{item.text.value}
							{/* Optionally display annotations here */}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default page;
