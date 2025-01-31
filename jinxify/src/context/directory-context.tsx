import { createContext, useContext } from "react";

type DirectoryContextType = {
	directoryUrlId: string;
};

const DirectoryContext = createContext<DirectoryContextType | undefined>(
	undefined,
);

export function DirectoryProvider({
	children,
	directoryUrlId,
}: DirectoryContextType & { children: React.ReactNode }) {
	return (
		<DirectoryContext.Provider value={{ directoryUrlId }}>
			{children}
		</DirectoryContext.Provider>
	);
}

export function useDirectory() {
	const context = useContext(DirectoryContext);
	if (context === undefined) {
		throw new Error("useDirectory must be used within a DirectoryProvider");
	}
	return context;
}
