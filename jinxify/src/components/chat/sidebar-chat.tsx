"use client";

import type { Message } from "ai/react";
import { ChatMessageArea } from "../ui/chat-message-area";
import { ChatMessageAvatar } from "../ui/chat-message";
import { ChatMessageContent } from "../ui/chat-message";
import { ChatMessage } from "../ui/chat-message";
import { ChatInputSubmit, ChatInputTextArea } from "../ui/chat-input";
import { ChatInput } from "../ui/chat-input";
import { ToolInvocationComponent } from "./tool-invocation";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const getSuggestions = (pathname: string) => {
	if (pathname.startsWith("/diagram")) {
		return [
			`Design a BPMN process diagram illustrating the onboarding process for new **Mobile App Developers**. The diagram should depict:

- **Start Event:** New Developer Joins
- **Tasks:** 
  - HR Registration
  - IT Setup (Hardware, Software, Access Rights)
  - Orientation Meeting with Team
  - Codebase Introduction Session
  - First Project Assignment
  - Mentorship Pairing
- **Gateways:** Decision points like choosing between iOS or Android focused training
- **End Event:** Developer Fully Onboarded`,
			"Show me how to map the employee onboarding workflow on a diagram",
			"Create a diagram for performance review process",
			"Visualize the employee offboarding procedure on a diagram",
			"Design a workflow for leave request approvals on a diagram",
		];
	}
	if (pathname.startsWith("/form")) {
		return [
			`Create an interview form for the **Mobile App Developer** position where only the following fields are mandatory:

- **Name** (Mandatory)
- **Last Name** (Mandatory)
- **Phone** (Mandatory)

Include these additional optional fields:

- **Email**
- **Technical Skills:** Rate proficiency in Swift, Kotlin, React Native, UI/UX design principles
- **Experience:** Years in mobile development, notable projects, app store links if applicable
- **Problem Solving:** Describe a challenging bug you fixed or an innovative solution you implemented
- **Cultural Fit:** Questions about teamwork, handling feedback, and continuous learning
- **Scenario-Based:** How would you approach optimizing an app for performance across different devices?`,
			"Generate a job application form template",
			"Help me design a performance evaluation form",
			"Make a form for training needs assessment",
			"Create an employee satisfaction form",
		];
	}
	if (pathname.startsWith("/document")) {
		return [
			`Generate a job description document for a **Mobile App Developer** position. Include:

- **Job Title:** Mobile App Developer
- **Job Summary:** Overview of the role and its importance to the company
- **Responsibilities:** Developing, testing, and deploying mobile applications; maintaining code quality, etc.
- **Requirements:** Proficiency in languages like Swift, Kotlin, React Native; experience with iOS/Android SDK
- **Benefits:** Mention company culture, team environment, professional development opportunities`,
			"Help me draft a job description template document",
			"Create a policy for remote work guidelines document",
			"Write a memo about the new benefits program document",
			"Help me outline a training program document",
		];
	}
	return [];
};

function ChatSuggestions({
	onSuggestionClick,
}: { onSuggestionClick: (suggestion: string) => void }) {
	const pathname = usePathname();
	const suggestions = getSuggestions(pathname);

	return (
		<div className="flex-1 p-4 flex flex-col justify-end gap-2">
			{suggestions.map((suggestion) => (
				<Button
					key={suggestion}
					variant="outline"
					size="sm"
					className="whitespace-nowrap h-10 truncate overflow-hidden text-ellipsis text-left justify-start"
					onClick={() => onSuggestionClick(suggestion)}
				>
					{suggestion}
				</Button>
			))}
		</div>
	);
}

export function ChatSidebar({
	messages,
	input,
	setInput,
	handleSubmit,
	isLoading,
	stop,
}: {
	messages: Message[];
	input: string;
	setInput: (input: string) => void;
	handleSubmit: () => void;
	isLoading: boolean;
	stop: () => void;
}) {
	return (
		<div className="w-96 border-l bg-muted/10 flex flex-col h-full">
			{messages.length > 0 ? (
				<ChatMessageArea className="flex-1 p-4 space-y-2">
					{messages.map((message) => (
						<ChatMessage
							key={message.id}
							id={message.id}
							variant={message.role === "user" ? "bubble" : "default"}
							type={message.role === "user" ? "outgoing" : "incoming"}
						>
							{message.role !== "user" && <ChatMessageAvatar />}
							<ChatMessageContent content={message.content}>
								{message.toolInvocations?.map((toolInvocation) => (
									<ToolInvocationComponent
										key={toolInvocation.toolCallId}
										toolInvocation={toolInvocation}
									/>
								))}
							</ChatMessageContent>
						</ChatMessage>
					))}
				</ChatMessageArea>
			) : (
				<ChatSuggestions
					onSuggestionClick={(suggestion) => {
						setInput(suggestion);
					}}
				/>
			)}

			<div className="p-4 border-t">
				<ChatInput
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onSubmit={handleSubmit}
					loading={isLoading}
					onStop={stop}
				>
					<ChatInputTextArea placeholder="Type a message..." />
					<ChatInputSubmit />
				</ChatInput>
			</div>
		</div>
	);
}
