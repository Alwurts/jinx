"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Folder, FileText, Plus, Sidebar } from "lucide-react";
import Link from "next/link";
import type { TDirectory } from "@/types/db";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FaFolder, FaRegFileAlt } from "react-icons/fa";
import { SessionProvider } from "next-auth/react";

import { useSession } from "next-auth/react";
export default function Dashboard() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const directoryId = searchParams.get("directoryId") ?? "root";
  const { data: session, status } = useSession();

  const { data: currentDirectory, isLoading } = useQuery({
    queryKey: ["directory", directoryId],
    queryFn: async () => {
      const response = await fetch(`/api/workspace/${directoryId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch directory");
      }
      return response.json() as Promise<TDirectory>;
    },
  });

  const createWorkspaceItem = useMutation({
    mutationFn: async ({
      type,
      title,
    }: {
      type: "directory" | "diagram";
      title: string;
    }) => {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          directoryId: currentDirectory?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workspace item");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch the current directory data
      queryClient.invalidateQueries({ queryKey: ["directory", directoryId] });
    },
  });

  const handleCreateFolder = () => {
    createWorkspaceItem.mutate({
      type: "directory",
      title: "New Folder", // You might want to add a dialog to get the title from user
    });
  };

  const handleCreateDiagram = () => {
    createWorkspaceItem.mutate({
      type: "diagram",
      title: "New Diagram", // You might want to add a dialog to get the title from user
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const items = [
    ...(currentDirectory?.directories ?? []),
    ...(currentDirectory?.diagrams ?? []),
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <AppSidebar session={session ?? null} />
      <main className="flex-1 flex flex-col ml-4 mr-4 mt-4 mb-4 p-4 bg-white shadow-xl rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {currentDirectory?.title || "My Workspace"}
          </h1>
          <SidebarTrigger className="md:hidden" />
          <div className="space-x-2">
            <Button
              disabled={createWorkspaceItem.isPending}
              variant="outline"
              onClick={handleCreateFolder}
            >
              <FaFolder className="w-5 h-5 text-purple-1000" />
            </Button>
            <Button
              disabled={createWorkspaceItem.isPending}
              onClick={handleCreateDiagram}
            >
              <FaRegFileAlt className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-4">
              No folders or diagrams yet. Create one to get started!
            </p>
            <Button onClick={handleCreateFolder}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Folder
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold">Folders</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items
                  .filter((item) => item.type === "directory")
                  .map((item) => (
                    <Link
                      href={`/dashboard?directoryId=${item.id}`}
                      key={item.id}
                    >
                      <Card className="mt-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <svg
                              className="w-5 h-5 mr-2 text-purple-900"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <title id="folderIconTitle">Folder Icon</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v4h1.586a1 1 0 00.707-.293l1.414-1.414A1 1 0 017.414 9H20a1 1 0 011 1v6a1 1 0 01-1 1H3v-8z"
                              />
                            </svg>
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-400">
                            Folder
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold ">Diagrams</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items
                  .filter((item) => item.type === "diagram")
                  .map((item) => (
                    <Link href={`/dashboard/diagram/${item.id}`} key={item.id}>
                      <Card className="mt-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <svg
                              className="w-5 h-5 mr-2  text-purple-900"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <title id="folderIconTitle">Diagram Icon</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                              />
                            </svg>
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-400">
                            Diagram
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
