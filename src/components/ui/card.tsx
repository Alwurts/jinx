import * as React from "react";

import { cn } from "@/lib/utils";
import Link from 'next/link'
import { Badge } from "@/components/ui/badge";
import InstaIcon from "@/components/icons/logo-insta";
import LinkedInIcon from "../icons/logo-linkedIn";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"rounded-xl border bg-card text-card-foreground shadow",
			className,
		)}
		{...props}
	/>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col space-y-1.5 p-6", className)}
		{...props}
	/>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn("font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn(className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
CardFooter.displayName = "CardFooter";

//CardMemberInfo Component
const CardMemberInfo = ({
  name,
  role,
  coffeeOrder,
  techTool,
  techToolLink,
  instaLink,
  linkedInLink,
}: {
  name: string;
  role: string;
  coffeeOrder?: string;
  techTool?: string;
  techToolLink?: string;
  instaLink?: string;
  linkedInLink?: string;
}) => (
<div className="flex-grow flex flex-col w-full lg:w-2/3 lg:pl-16 border-t lg:border-t-0 lg:border-l-[1.5px] border-border pt-6 lg:pt-0 items-center lg:items-start">
  <div className="flex flex-col items-center lg:items-start mb-2">
    <h2 className="text-2xl font-semibold mb-2">{name}</h2>
	<Badge className="mt-1 mb-4 text-sm">{role}</Badge>
	</div>
    <p className="text-sm">
      <strong>Coffee Order:</strong> {coffeeOrder || "Not provided"}
    </p>
    <p className="text-sm">
      <strong>Favorite Tech-Tool:</strong>{" "}
      {techToolLink ? (
        <Link href={techToolLink} className="underline hover:text-foreground">
          {techTool}
        </Link>
      ) : (
        techTool || "Not provided"
      )}
    </p>
    <div className="flex space-x-1 mt-4">
      <Link href={instaLink || "#"} className="hover:text-primary text-sm">
        <InstaIcon className="p-[1px] h-12 lg:h-6"/>
      </Link>
      <Link href={linkedInLink || "#"} className="hover:text-primary text-sm">
        <LinkedInIcon className="h-12 lg:h-6"/>
      </Link>
    </div>
</div>	
);
CardMemberInfo.displayName = "CardMemberInfo";

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
	CardMemberInfo
};
