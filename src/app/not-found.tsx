import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="container mx-auto flex flex-col items-center justify-center px-4 py-10">
			<Card className="p-6 shadow-lg rounded-lg">
				<h2 className="text-2xl font-bold mb-4">Not Found</h2>
				<p className="text-gray-600 mb-6">Could not find requested resource</p>
				<Link href="/" className="text-primary hover:underline">Return Home</Link>
			</Card>
		</div>
	);
}
