import Link from "next/link";

export default function HeroSection() {
	return (
		<section className="mx-auto lg:p-0 py-10">
			<div className="lg:flex lg:flex-row-reverse py-8 lg:items-center lg:justify-between lg:gap-2 lg:py-4">
				<div className="hidden lg:block relative lg:w-[35%] lg:max-h-full w-full">
					{/* Image with Overlay */}
					<div className="absolute bg-primary/35 opacity-50 dark:opacity-0 dark:bg-primary/25 inset-0 rounded-lg" />

					<img
						src="/hero_hr.png"
						alt="mockup"
						className="w-full h-full object-cover shadow-xl rounded-lg"
					/>
				</div>

				{/* Content */}
				<div className="place-self-center">
					<h1 className="max-w-sm md:max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
						Smartified AI-Driven <span className="text-primary">HR Processes</span>
					</h1>

					<p className="max-w-sm md:max-w-xl lg:max-w-2xl mb-6 font-light text-secondary-foreground lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
						We are your partner in the future of HR, transforming your
						traditional recruitment processes into efficient, automated
						workflows powered by BPMN, Forms, and Markdown.
					</p>

					<div className="mt-8 flex flex-wrap gap-6 text-center">
						<Link
							href="https://jinxify-app.vercel.app"
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
