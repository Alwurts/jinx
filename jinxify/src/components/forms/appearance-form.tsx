"use client";

import { IoInvertModeOutline } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function AppearanceForm() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleThemeChange = (value: "light" | "dark") => {
		setTheme(value);
		toast({
			title: "Theme updated",
			description: `Theme changed to ${value} mode`,
		});
	};

	const currentTheme = mounted ? theme : "light";

	return (
		<div className="pb-8">
			<div className="pb-4">
				<div className="flex items-center space-x-2">
					<IoInvertModeOutline className="h-6 w-6 dark:text-secondary" />
					<h3 className="text-2xl font-semibold dark:text-secondary">
						Appearance
					</h3>
				</div>
				<p className="text-sm text-muted-foreground">Modify the mode.</p>
			</div>

			<div className="grid max-w-md grid-cols-2 gap-8 pt-2">
				<button
					onClick={() => handleThemeChange("light")}
					className="text-left"
					type="button"
				>
					<div
						className={cn(
							"items-center rounded-md border-2 border-muted p-1 hover:border-accent",
							currentTheme === "light" && "border-primary"
						)}
					>
						<div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
							<div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
								<div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
								<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
							</div>
							<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
								<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
								<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
							</div>
							<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
								<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
								<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
							</div>
						</div>
					</div>
					<span className="block w-full p-2 text-center font-normal">Light</span>
				</button>

				<button
					onClick={() => handleThemeChange("dark")}
					className="text-left"
					type="button"
				>
					<div
						className={cn(
							"items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground",
							currentTheme === "dark" && "border-primary"
						)}
					>
						<div className="space-y-2 rounded-sm bg-slate-950 p-2">
							<div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
								<div className="h-2 w-[80px] rounded-lg bg-slate-400" />
								<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
							</div>
							<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
								<div className="h-4 w-4 rounded-full bg-slate-400" />
								<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
							</div>
							<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
								<div className="h-4 w-4 rounded-full bg-slate-400" />
								<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
							</div>
						</div>
					</div>
					<span className="block w-full p-2 text-center font-normal">Dark</span>
				</button>
			</div>
		</div>
	);
}
