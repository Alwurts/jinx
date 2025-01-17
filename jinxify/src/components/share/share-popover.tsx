import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface SharePopoverProps {
	url: string;
}

export function SharePopover({ url }: SharePopoverProps) {
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
				<Button variant="outline" size="icon" title="Share form">
					<Share2 className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="space-y-4">
					<h4 className="font-medium leading-none">Share form</h4>
					<div className="flex space-x-2">
						<Input value={url} readOnly className="h-9" />
						<Button
							size="sm"
							variant="outline"
							className="h-9 px-3"
							onClick={handleCopy}
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
