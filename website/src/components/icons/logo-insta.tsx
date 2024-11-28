const InstaIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
				Camera Icon
			</title>
			<path
				fill="currentColor"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10 3C6.14 3 3 6.142 3 10v10c0 3.86 3.142 7 7 7h10c3.86 0 7-3.142 7-7V10c0-3.86-3.142-7-7-7H10zm12 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM15 9a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
			/>
		</svg>
	);
};

export default InstaIcon;
