import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log(session?.user);
  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <SessionProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </SessionProvider>
  );
}
