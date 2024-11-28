"use client";
import type { FormEvent } from "react";
import { Separator } from "@/components/ui/separator";

export default function Page() {
	async function formHandler(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await fetch("/api/contact", {
			method: "POST",
			body: JSON.stringify(Object.fromEntries(formData)),
		});
		console.log(Object.fromEntries(formData));
	}
	return (
		<main className="container mx-auto px-4 py-8 sm:py-16">
			<div className="mx-auto max-w-2xl">
				<div className="text-center mb-10">
					<h1 className="mb-10 text-4xl lg:text-5xl tracking-tight text-center font-bold">
						We're Just a Click Away
					</h1>
					<Separator className="mt-4" />
				</div>

				<form className="space-y-12" onSubmit={formHandler}>
					<div>
						<label
							htmlFor="email"
							className="block mb-2 text-lg text-secondary-foreground font-medium"
						>
							Enter Your Email
						</label>
						<input
							type="email"
							name="email"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
							placeholder="name@flowbite.com"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="subject"
							className="block mb-2 text-lg text-secondary-foreground font-medium"
						>
							Leave A Subject
						</label>
						<input
							type="text"
							name="subject"
							className="block p-3 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
							placeholder="Let us know how we can help"
							required
						/>
					</div>
					<div className="sm:col-span-2">
						<label
							htmlFor="message"
							className="block mb-2 text-lg text-secondary-foreground font-medium"
						>
							Share Your Message
						</label>
						<textarea
							name="message"
							rows={6}
							className="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="Leave a comment..."
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full items-center justify-center px-5 py-3 text-primary-foreground text-base font-semibold rounded-xl bg-primary hover:bg-primary/80 focus:ring-2 focus:ring-primary dark:hover:bg-primary/80"
					>
						Submit
					</button>
				</form>
			</div>
		</main>
	);
}
