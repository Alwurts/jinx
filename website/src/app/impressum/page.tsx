import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ImpressumPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<div className="text-center mb-10">
				<h1 className="text-5xl font-bold mb-4">Impressum</h1>
				<Separator className="mt-4" />
			</div>
			<Card className="p-8 max-w-2xl mx-auto">
				<h2 className="text-3xl font-semibold mb-6">Legal Notice</h2>
				<p className="mb-4">This is a university project created by:</p>
				<p className="mb-6">
					<strong className="text-xl">Team Jinx</strong>
				</p>
				<div className="space-y-2 mb-6">
					<p>
						<strong>Institution:</strong> Technische Universität Chemnitz
					</p>
					<p>
						<strong>Program:</strong> Web Engineering Master's Program
					</p>
					<p>
						<strong>Contact:</strong>{" "}
						<a
							href="mailto:jinx.officialfive@gmail.com"
							className="text-blue-600 hover:underline"
						>
							jinx.officialfive@gmail.com
						</a>
					</p>
				</div>
				<Separator className="my-6" />
				<p className="text-sm text-gray-600 italic">
					This is not a real company. All content is fictional and created for
					educational purposes only.
				</p>
			</Card>
		</main>
	);
}
