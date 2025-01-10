import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Convert a string like "LayoutSpacing" to "Layout Spacing"
 * @param text
 * @returns
 */
export function pascalToSentence(text: string): string {
	return (
		text
			// Add space before capital letters
			.replace(/([A-Z])/g, " $1")
			// Trim extra spaces and capitalize first letter
			.trim()
	);
}

/**
 * Convert a string like "layout-spacing" to "Layout Spacing"
 * @param idToConvert
 * @returns
 */
export const idToReadableText = (idToConvert: string) => {
	return idToConvert
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};
