import Link from "next/link";

export default function HeroSection() {
	return (
		<section className="mx-auto p-4 lg:p-0 py-10">
			<div className="flex flex-row-reverse py-8 mx-auto items-center justify-between gap-4 lg:py-4">
				<div className="lg:w-[35%] lg:max-h-full w-full relative">
					{/* Image with Overlay */}
					<div className="absolute bg-primary/55 opacity-50 dark:opacity-0 dark:bg-primary/15 inset-0 rounded-l-lg" />

					<img
						src="/hero_hr.png"
						alt="mockup"
						className="w-full h-full object-cover rounded-l-lg shadow-lg"
					/>
				</div>

				{/* Content */}
				<div className="pl-32 place-self-center">
					<h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
						Smartified AI-Driven HR Processes
					</h1>

					<p className="max-w-2xl lg:max-w-2xl mb-6 font-light text-secondary-foreground lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
						We are your partner in the future of HR, transforming your
						traditional recruitment processes into efficient, automated
						workflows powered by BPMN, Forms, and Markdown.
					</p>

					<div className="mt-8 flex flex-wrap gap-4 text-center">
						<Link
							href="https://jinxify-app.vercel.app/dashboard/home"
							className="inline-flex items-center justify-center px-5 py-3 text-primary-foreground text-base font-semibold rounded-xl bg-primary hover:bg-primary/80 focus:ring-2 focus:ring-primary dark:hover:bg-primary/80"
						>
							Try Our jinxify Portal
						</Link>

						<Link
							href="/about"
							className="inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-center border border-gray-300 rounded-xl hover:border-secondary hover:underline focus:ring-4 focus:ring-secondary dark:focus:ring-secondary"
						>
							Learn More About Us
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
