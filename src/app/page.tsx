"use client";
import { useState } from "react";
import { QuoteList } from "@/components/quote-list";
import { AddQuoteDialog } from "@/components/dialogs/add-quote-dialog";
import { Navbar } from "@/components/navbar";
import {
  useAddQuoteMutation,
  useDeleteQuoteMutation,
  useQuotesQuery,
  useUpdateQuoteMutation,
} from "@/hooks/queries/useQuotes";
import { Quote } from "@/types/common";

export default function Home() {
  //This defines the state of the dialog if it's open or not
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  //Defining the mutations that are going to be used
  const { data, isPaused, status, error } = useQuotesQuery();
  const addMutation = useAddQuoteMutation();
  const updateMutation = useUpdateQuoteMutation();
  const deleteMutation = useDeleteQuoteMutation();

  console.log("offline --->", isPaused);
  //Extracting the quotes from the server response;
  const quotes: Quote[] = data?.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar setIsAddDialogOpen={setIsAddDialogOpen} />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-4">
              Your Collection of Wisdom
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Preserve the words that inspire you. Create, edit, and organize
              quotes from the greatest minds.
            </p>
          </div>

          {/* Quotes List */}
          <QuoteList
            error={error ?? undefined}
            status={status}
            quotes={quotes}
            setIsAddDialogOpen={setIsAddDialogOpen}
            onUpdate={updateMutation.mutate}
            onDelete={deleteMutation.mutate}
          />
        </div>
      </main>

      {/* Add Quote Dialog */}
      <AddQuoteDialog
        status={addMutation.status}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={addMutation.mutate}
      />
    </div>
  );
}
