"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseMutateFunction } from "@tanstack/react-query";
import { Save } from "lucide-react";
type Quote = {
  author: string;
  quote: string;
};
interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: UseMutateFunction<any, Error, Quote, unknown>;
  status: "success" | "pending" | "error" | "idle";
}

export function AddQuoteDialog({
  open,
  onOpenChange,
  onAdd,
  status,
}: AddQuoteDialogProps) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quote.trim()) {
      onAdd({ quote: quote.trim(), author: author.trim() });
    }
    onOpenChange(false);
  };

  useEffect(() => {
    if (status === "success") {
      setQuote("");
      setAuthor("");
    } else if (status === "error") {
      onOpenChange(true);
    }
  }, [status, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Quote</DialogTitle>
          <DialogDescription>
            Capture a memorable quote and its author. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Who said it?"
                value={author}
                disabled={status === "pending"}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote">Quote *</Label>
              <Textarea
                id="quote"
                placeholder="Enter the quote..."
                value={quote}
                disabled={status === "pending"}
                onChange={(e) => setQuote(e.target.value)}
                className="min-h-[120px] resize-none"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!quote.trim() || status === "pending"}
            >
              <Save /> Save Quote
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
