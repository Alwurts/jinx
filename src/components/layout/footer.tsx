import LogoText from "@/components/icons/logo-text";
import Link from "next/link";
import InstaIcon from "@/components/icons/logo-insta";
import XIcon from "../icons/logo-x";

export default function Footer() {
	return (
		<footer className="p-4 bg-card mt-auto">
			<div className="container max-w-screen-xl mx-auto p-4 md:py-8">
				<div className="flex flex-col justify-center">
					<div className="flex flex-col items-center sm:justify-between md:flex-row">
						<Link
							href="https://jinx-team.vercel.app/"
							className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
						>
							<LogoText className="w-full h-24 mx-auto text-foreground" />
						</Link>
						<ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
							<li>
								<Link
									href="/"
									className="hover:underline hover:text-foreground me-4 md:me-6"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="hover:underline hover:text-foreground me-4 md:me-6"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/impressum"
									className="hover:underline hover:text-foreground me-4 md:me-6"
								>
									Impressum
								</Link>
							</li>
						</ul>
						<ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
							<li>
								<Link
									href="https://x.com/i/flow/login?redirect_after_login=%2F_JinX_Team"
									className="hover:text-foreground"
								>
									<XIcon className="h-12 lg:h-6" />
								</Link>
							</li>
							<li>
								<Link
									href="https://www.instagram.com/_jinx_team/?igsh=MWUweDRpenJtdnRjag%3D%3D"
									className="hover:text-foreground"
								>
									<InstaIcon className="p-[1px] h-12 lg:h-6" />
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<hr className="my-6 border-border sm:mx-auto lg:my-8" />
				<div className="flex justify-center">
					<span className="text-sm w-fit text-center text-gray-500 dark:text-gray-400">
						University Chemnitz Planspiel Project 2024
					</span>
				</div>
			</div>
		</footer>
	);
}
