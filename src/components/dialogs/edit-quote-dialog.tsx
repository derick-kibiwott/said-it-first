"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { Quote } from "@/app/page";
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
import { Save } from "lucide-react";
import { UpdateProps } from "../quote-list";

interface EditQuoteDialogProps {
  quote: Quote;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: ({ id, quote, author }: UpdateProps) => void;
}

export function EditQuoteDialog({
  quote,
  open,
  onOpenChange,
  onUpdate,
}: EditQuoteDialogProps) {
  const [quoteText, setQuoteText] = useState(quote.quote);
  const [author, setAuthor] = useState(quote.author || "");

  useEffect(() => {
    setQuoteText(quote.quote);
    setAuthor(quote.author || "");
  }, [quote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteText.trim()) {
      onUpdate({
        id: quote.id,
        quote: quoteText.trim(),
        author: author.trim(),
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>
            Make changes to your quote. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                placeholder="Who said it?"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quote">Quote *</Label>
              <Textarea
                id="edit-quote"
                placeholder="Enter the quote..."
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
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
            <Button type="submit" disabled={!quoteText.trim()}>
              <Save />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
