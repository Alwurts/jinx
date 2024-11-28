const XIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="30"
			height="30"
			viewBox="0 0 30 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title
				style={{
					position: "absolute",
					width: "1px",
					height: "1px",
					padding: "0",
					margin: "-1px",
					overflow: "hidden",
					clip: "rect(0, 0, 0, 0)",
					whiteSpace: "nowrap",
					borderWidth: "0",
				}}
			>
				X
			</title>
			<path
				fill="currentColor"
				d="M6 4C4.895 4 4 4.895 4 6v18c0 1.105.895 2 2 2h18c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2H6zm2.648 5h4.611l2.692 3.848L19.281 9h1.451l-4.129 4.781L21.654 21h-4.611l-2.987-4.27L10.369 21H8.895l4.506-5.205L8.648 9zm2.23 1.184l6.754 9.627h1.789l-6.756-9.627h-1.787z"
			/>
		</svg>
	);
};

export default XIcon;
