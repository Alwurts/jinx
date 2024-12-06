import React from "react";
import Link from "next/link";
import ImageOverlayHeader from "@/components/layout/image-overlay-header";

export default function LegalPage() {
	return (
		<div className="min-h-screen bg-white p-6 md:p-12">
			<div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
				<ImageOverlayHeader
					imageSrc="/images/diamonds_3d_photo.png"
					title="Legal Information"
				/>

				<div className="p-8">
					<p className="mb-4">
						Welcome to jinxify! Our service was developed as part of a module at
						Technische Universität Chemnitz during the "Planspiel" program. Our
						company jinx is the brand under which jinxify is marketed, but this
						is specifically for university-related purposes.
					</p>
					<p>
						At jinxify, we are committed to empowering businesses by providing
						intelligent automation solutions. Our platform is designed to
						transform your business processes, turning them into AI-driven
						workflows that simplify and streamline operations. Whether you're
						looking to automate tasks, improve efficiency, or reduce manual
						effort, Jinxify is here to help you optimize and accelerate your
						workflow.
					</p>
					<p className="mt-8 mb-4">Navigate through our legal information:</p>

					<ul className="list-disc px-8 flex flex-col gap-4 mb-8">
						<li>
							<Link
								href="#terms"
								className="text-primary hover:underline transition duration-200"
							>
								Terms of Service
							</Link>
						</li>
						<li>
							<Link
								href="#privacy"
								className="text-primary hover:underline transition duration-200"
							>
								Privacy Policy
							</Link>
						</li>
					</ul>

					<div className="border-t border-gray-200 my-10" />

					<section id="terms" className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
						<p className="mb-4">
							By using our platform, you agree to our Terms of Service. jinxify
							provides AI-powered workflow solutions that transform BPMNs into
							actionable tasks and automated processes.
						</p>
						<p className="mb-4">
							Users are responsible for providing accurate information and using
							the platform in compliance with all applicable laws. All content,
							designs, and software are the intellectual property of jinx and
							cannot be reproduced or redistributed without permission.
						</p>
					</section>

					<div className="border-t border-gray-200 my-10" />

					<section id="privacy">
						<h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
						<p className="mb-4">
							At jinxify, your privacy is our priority. We are dedicated to
							safeguarding your personal data, which may include information
							such as your name and email address.
						</p>
						<p className="mb-4">
							While your data may be shared with trusted third parties, such as
							GitHub, for service functionality or legal compliance, rest
							assured that we take every measure to ensure it is securely stored
							and protected.
						</p>
					</section>

					<div className="border-t border-gray-200 my-10" />

					<div>
						<h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
						<p>
							For any inquiries, mail us at{" "}
							<a
								href="mailto:jinx.officialfive@gmail.com"
								className="text-primary hover:underline"
							>
								jinx.officialfive@gmail.com
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
