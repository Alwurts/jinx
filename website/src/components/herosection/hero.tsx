import Link from "next/link";

export default function HeroSection() {
	return (
		<section className="p-4 lg:p-0 py-10">
			<div className="grid py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-24 lg:grid-cols-12">
				<div className="mr-auto place-self-center lg:col-span-7">
					<h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
						AI-Driven BPMN for Smarter Business
					</h1>
					<p className="max-w-2xl lg:max-w-lg mb-6 font-light text-secondary-foreground lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
						We are the partner of your future transforming legacy business
						processes into efficient, AI-enhanced automated workflows powered by
						BPMN.
					</p>
					<div className="flex space-y-6 flex-col md:space-y-0 md:flex-row md:space-x-3">
						<Link
							href="/about"
							className="inline-flex items-center justify-center px-5 py-3 text-primary-foreground text-base font-semibold rounded-xl bg-primary hover:bg-primary/80 focus:ring-2 focus:ring-primary dark:hover:bg-primary/80"
						>
							Learn More About Us
						</Link>
						<Link
							href="https://www.linkedin.com/in/jinx-team-a3251b338/"
							className="inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-center border border-gray-300 rounded-xl hover:border-secondary hover:underline focus:ring-4 focus:ring-secondary dark:focus:ring-secondary"
						>
							Connect on LinkedIn
						</Link>
					</div>
				</div>
				<div className="hidden lg:mt-0 lg:col-span-5 lg:flex lg:flex-col">
					<img src="/computer.png" alt="mockup" />
				</div>
			</div>
		</section>
	);
}
