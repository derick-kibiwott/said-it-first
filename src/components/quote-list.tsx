"use client";

import { ApiResponse, Quote } from "@/types/common";
import { QuoteCard } from "@/components/quote/quote-card";
import { QuoteListSkeleton } from "./skeletons/quote-list";
import { QuotesErrorState } from "./quote/quote-error-state";
import { AxiosError } from "axios";
import { UseMutateFunction } from "@tanstack/react-query";
import { QuoteEmptyState } from "./quote/quote-empty-state";
import { NavbarProps } from "./navbar";

export type UpdateProps = {
  id: number;
  quote: string;
  author: string;
};
type QuoteListProps = {
  quotes: Quote[];
  onUpdate: ({ id, quote, author }: UpdateProps) => void;
  onDelete: UseMutateFunction<ApiResponse<Quote>, Error, number, unknown>;
  status: "success" | "pending" | "error";
  error?: AxiosError<{ message: string; success: boolean; data: null }>;
} & NavbarProps;

export function QuoteList({
  quotes,
  onUpdate,
  onDelete,
  status,
  error,
  setIsAddDialogOpen,
}: QuoteListProps) {
  if (status == "pending") {
    return <QuoteListSkeleton />;
  }
  if (status == "error") {
    return (
      <QuotesErrorState
        message={
          error?.response?.data?.message ?? error?.message ?? "Unknown error"
        }
      />
    );
  }
  if (quotes.length === 0) {
    return <QuoteEmptyState setIsAddDialogOpen={setIsAddDialogOpen} />;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground mb-6">
        All Quotes ({quotes.length})
      </h3>
      <div className="space-y-4">
        {quotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
