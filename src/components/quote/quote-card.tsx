"use client";
import { useState } from "react";
import { ApiResponse, Quote } from "@/types/common";
import { Button } from "@/components/ui/button";
import { EditQuoteDialog } from "@/components/dialogs/edit-quote-dialog";
import { Pencil, Trash2 } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getInitials } from "@/helpers/common";
import Link from "next/link";
import { UseMutateFunction } from "@tanstack/react-query";
import { UpdateProps } from "../quote-list";

interface QuoteCardProps {
  quote: Quote;
  onUpdate: ({ id, quote, author }: UpdateProps) => void;
  onDelete: UseMutateFunction<ApiResponse<Quote>, Error, number, unknown>;
}

export function QuoteCard({ quote, onUpdate, onDelete }: QuoteCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Item
        variant="outline"
        className="flex-col max-sm:items-start md:flex-row hover:shadow-md transition-shadow"
      >
        <ItemContent>
          <ItemTitle className="text-lg mb-2 flex items-start gap-3">
            <span className="flex items-center justify-center size-10 font-bold rounded-full bg-accent text-accent-foreground">
              {getInitials(quote.author ?? "")}
            </span>
            <span className="flex-1 text-pretty">
              &ldquo;{quote.quote}&rdquo; {/* Adds quotes around the text */}
            </span>
          </ItemTitle>
          {quote.author && (
            <ItemDescription className="text-sm text-muted-foreground">
              — {quote.author}
            </ItemDescription>
          )}
        </ItemContent>
        <ItemActions className="flex gap-2">
          <Button size="sm" asChild>
            <Link href={`/quote/${quote.id}`}>Details</Link>
          </Button>
          <Button
            size="sm"
            variant={"secondary"}
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size={"sm"}
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </ItemActions>
      </Item>
      <EditQuoteDialog
        quote={quote}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quote? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant={"destructive"}
              onClick={() => onDelete(quote.id)}
              asChild
            >
              <AlertDialogAction>Delete</AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
