"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ToggleEditor() {
	const router = useRouter();
	const pathname = usePathname();

	const activeTab = pathname.startsWith("/dashboard/files/forms")
		? "form"
		: "bpmn";

	const [previousBpmnUrl, setPreviousBpmnUrl] = useState("");

	useEffect(() => {
		if (pathname.startsWith("/diagram")) {
			setPreviousBpmnUrl(pathname); // Save the current BPMN Editor URL
			localStorage.setItem("previousBpmnUrl", pathname); // Persist it for reloads
		}
	}, [pathname]);

	const handleTabChange = (value: string) => {
		if (value === "form") {
			setPreviousBpmnUrl(pathname); // Save the current BPMN URL before switching
			localStorage.setItem("previousBpmnUrl", pathname); // Persist it for reloads
			router.push("/dashboard/files/forms"); // Navigate to Form Editor
		} else if (value === "bpmn") {
			const savedBpmnUrl =
				previousBpmnUrl || localStorage.getItem("previousBpmnUrl");
			if (savedBpmnUrl) {
				router.push(savedBpmnUrl); // Navigate back to the saved BPMN Editor URL
			} else {
				router.push("/diagram"); // Fallback to a default BPMN Editor URL
			}
		}
	};

	return (
		<div>
			<Tabs
				defaultValue={activeTab}
				onValueChange={handleTabChange}
				className="w-[600px]"
			>
				<TabsList>
					<TabsTrigger value="bpmn">BPMN Editor</TabsTrigger>
					<TabsTrigger value="form">Form Editor</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
