//@/app/quote/[id]

"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Quote as QuoteIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type Quote = {
  id: number;
  quote: string;
  author: string | null;
  created_at: string;
};

type ApiResponse<T> = {
  data: T | null;
  message: string;
  success: boolean;
};

export default function QuotePage() {
  // ✅ Get the `id` from the URL
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  // ✅ Fetch that specific quote
  const { data, isPending, isError } = useQuery<ApiResponse<Quote>>({
    queryKey: ["quote", numericId],
    queryFn: async () => {
      const res = await axios.get(`/api?id=${id}`);
      return res.data;
    },
  });

  const quote = data?.data;

  return (
    <main className="min-h-screen bg-background px-4 py-12 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-card border border-border rounded-2xl p-8 shadow-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground mb-6 hover:text-foreground transition"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to all quotes
        </Link>

        {/* Loading State */}
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-10">
            <p className="text-destructive font-medium">
              Failed to load the quote.
            </p>
          </div>
        )}

        {/* Success State */}
        {quote && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-accent text-accent-foreground p-4 rounded-full">
                <QuoteIcon className="w-8 h-8" />
              </div>
            </div>
            <blockquote className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-snug">
              “{quote.quote}”
            </blockquote>
            {quote.author && (
              <p className="text-lg text-muted-foreground mb-2">
                — {quote.author}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Added on{" "}
              {new Date(quote.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
