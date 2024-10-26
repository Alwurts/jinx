import LogoText from "@/components/icons/logo-text";
import Link from 'next/link'

export default function Footer() {
	return (
		<footer className="p-4 bg-card">
			<div className="container max-w-screen-xl mx-auto p-4 md:py-8">
				<div className="sm:flex sm:items-center sm:justify-between">
					<Link
						href="https://jinx-team.vercel.app/"
						className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
					>
						<LogoText className="w-full h-24 mx-auto text-foreground" />
					</Link>
					<ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
						<li>
							<Link href="/" className="hover:underline hover:text-foreground me-4 md:me-6">
								Home
							</Link>
						</li>
						<li>
							<Link href="/blog" className="hover:underline hover:text-foreground me-4 md:me-6">
								Blog
							</Link>
						</li>
						<li>
							<Link href="/" className="hover:underline hover:text-foreground me-4 md:me-6">
								Impressum
							</Link>
						</li>
					</ul>
				</div>
				<hr className="my-6 border-border sm:mx-auto lg:my-8" />
				<span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
					University Chemnitz Planspiel Project 2024
				</span>
			</div>
		</footer>
	);
}
