import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface SharePopoverProps {
	url: string;
	disabled?: boolean;
}

export function SharePopover({ url, disabled }: SharePopoverProps) {
	const { toast } = useToast();

	const handleCopy = () => {
		navigator.clipboard.writeText(url);
		toast({
			title: "Link copied!",
			description: "Form link has been copied to clipboard",
		});
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="gap-2"
					title="Share form"
					disabled={disabled}
				>
					<Share2 className="h-4 w-4" />
					Share with others
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[400px]">
				<div className="space-y-4">
					<div className="space-y-2">
						<h4 className="font-medium text-lg">Share Form</h4>
						<p className="text-sm text-muted-foreground">
							Share this link with others to let them fill out your survey. They
							can access the form directly through the link.
						</p>
					</div>
					<div className="flex space-x-2">
						<Input value={url} readOnly className="h-9" />
						<Button
							size="sm"
							variant="outline"
							className="h-9 gap-2 whitespace-nowrap"
							onClick={handleCopy}
							title="Copy link to clipboard"
						>
							<Copy className="h-4 w-4" />
							Copy
						</Button>
						<Button
							size="sm"
							variant="outline"
							className="h-9 gap-2 whitespace-nowrap"
							onClick={() => window.open(url, "_blank")}
							title="Open form in new tab"
						>
							<ExternalLink className="h-4 w-4" />
							Open Form
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
