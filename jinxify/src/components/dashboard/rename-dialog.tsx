"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TDiagram, TDirectory } from "@/types/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";

type Props = {
  item: TDirectory | TDiagram | null;
  close: (state: boolean) => void;
};

export function RenameDialog({ item, close }: Props) {
  const [name, setName] = useState("");
  useEffect(() => {
    if (item) {
      setName(item.title);
    }
  }, [item]);

  const queryClient = useQueryClient();

  const renameMutation = useMutation({
    mutationFn: async () => {
      if (!item?.id) return;
      await fetch(`/api/workspace/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: name, type: item.type }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["directory", item?.directoryId],
      });
      close(false);
    },
  });

  return (
    <Dialog open={!!item} onOpenChange={(state) => close(state)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
          <DialogDescription>
            Make changes to your director or diagram.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={item?.title ?? ""}
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={renameMutation.isPending}
            onClick={() => renameMutation.mutate()}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
