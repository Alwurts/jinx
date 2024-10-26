const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
        LinkedIn Icon
      </title>
      <path
        fill="currentColor"
        d="M24 4H6C4.895 4 4 4.895 4 6v18c0 1.105.895 2 2 2h18c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zM10.954 22h-2.95v-9.492h2.95V22zM9.449 11.151c-.951 0-1.72-.771-1.72-1.72 0-.949.77-1.719 1.72-1.719.948 0 1.719.771 1.719 1.719 0 .949-.771 1.72-1.719 1.72zm12.555 10.849h-2.948v-4.616c0-1.101-.02-2.517-1.533-2.517-1.535 0-1.771 1.199-1.771 2.437V22h-2.948v-9.492h2.83v1.297h.04c.394-.746 1.356-1.533 2.791-1.533 2.987 0 3.539 1.966 3.539 4.522V22z"
      />
    </svg>
  );
};

export default LinkedInIcon;
