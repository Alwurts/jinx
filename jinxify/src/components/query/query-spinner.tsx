import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export function QuerySpinner() {
	const isMutating = useIsMutating();
	const isFetching = useIsFetching();

	if (isMutating === 0 && isFetching === 0) {
		return null;
	}

	return <Loader2 className="h-4 w-4 animate-spin" />;
}
