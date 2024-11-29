import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { UserAuthForm } from "../components/auth/user-auth-form"
import Icon from "../components/icons/logo-icon";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function Home() {
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center p-4 md:p-0 grid max-w-full lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute left-6 top-8">
			<Icon className="h-12 w-12 mr-2" />
		</div>
		<Link
          href="/examples/authentication"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-6 top-10 bg-secondary"
          )}
        >
          Login
        </Link> 
        <div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary opacity-85 z-10" />
		  	<Image
				src="/images/business_portal_3d_graphic.png"
				width={1280}
				height={843}
				alt="Business process 3d graphic"
				className="absolute inset-0 w-full h-full object-cover z-0"
			/>
          <div className="relative z-20 flex items-center text-lg font-medium text-secondary">
			<Icon className={"dark:text-primary h-12 w-12 mr-2"} />
          </div>
          <div className="relative z-20 mt-auto text-secondary">
            <blockquote className="space-y-2 italic">
              <p className="text-lg">
                &ldquo;jinxify has streamlined our processes with AI-driven to-dos and workflow automation. 
				By turning BPMN diagrams into actionable tasks and reducing manual work, 
				it has enhanced our efficiency and productivity significantly.&rdquo;
              </p>
              <footer className="text-sm not-italic">Staffbase</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-4xl font-semibold tracking-tight">
                Enter the jinxify Portal
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign up seamlessly with your GitHub credentials
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
