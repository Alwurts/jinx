"use client";

import ToggleEditor from "@/components/diagram/toogle-editor";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Link } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FormsPage() {
	const pathname = usePathname();

	const subPath = pathname.split("/");
	const formsSubPath = subPath[subPath.length - 1];

	return (
		<div className="h-screen flex flex-col">
			<div className="flex justify-between items-center h-14 px-4 border-b">
				<div className="flex items-center gap-4">
					{/*<Button variant="outline" asChild>
						<Link href={`/dashboard/files?directoryId=${data?.directoryId}`}>
							Back
						</Link>
                    </Button>*/}
					<Separator orientation="vertical" />
					<h1 className="text-2xl font-bold">Your Form</h1>
				</div>

				<div className="flex items-center gap-2">
					<ToggleEditor />
				</div>
			</div>
		</div>
	);
}
