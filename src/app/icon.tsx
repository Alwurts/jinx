import LogoIcon from "@/components/icons/logo-icon";
import Image from "next/image";
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
	return new ImageResponse(
		// ImageResponse JSX element
		<LogoIcon
			style={{
				color: "white",
				backgroundColor: "#723FDF",
				borderRadius: "20%",
				width: "100%",
				height: "100%",
			}}
		/>,
		// ImageResponse options
		{
			// For convenience, we can re-use the exported icons size metadata
			// config to also set the ImageResponse's width and height.
			...size,
		},
	);
}
