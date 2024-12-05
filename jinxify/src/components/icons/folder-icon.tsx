export function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			className="w-5 h-5 mr-2 text-purple-900"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			{...props}
		>
			<title id="folderIconTitle">Folder Icon</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M3 7v4h1.586a1 1 0 00.707-.293l1.414-1.414A1 1 0 017.414 9H20a1 1 0 011 1v6a1 1 0 01-1 1H3v-8z"
			/>
		</svg>
	);
}
