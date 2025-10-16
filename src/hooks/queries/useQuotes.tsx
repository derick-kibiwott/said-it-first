"use client";

import { ApiResponse, Quote } from "@/types/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export function useQuotesQuery() {
  return useQuery<ApiResponse<Quote[]>, AxiosError<ApiResponse<null>>>({
    queryKey: ["quotes"],
    queryFn: async () => {
      const res = await axios.get("/api");
      return res.data;
    },
  });
}

export function useAddQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    any, //Mutation result type
    Error, //Mutation error type
    { quote: string; author: string }, //Variables type
    { previousQuotes?: ApiResponse<Quote[]>; tempQuote: Quote }
  >({
    mutationFn: async (quote) => {
      const res = await axios.post("/api", quote);
      return res.data;
    },
    onMutate: async ({ quote, author }) => {
      //cancelling any outgoing request so that they don't affect the optimistic query
      await queryClient.cancelQueries({ queryKey: ["quotes"] });
      //Getting previous data so that when if an error occurs we can just roll back to that
      const previousQuotes = queryClient.getQueryData<ApiResponse<Quote[]>>([
        "quotes",
      ]);

      //creating a temporary quote for the optimistic update to the cache
      const tempQuote: Quote = {
        id: Math.floor(Math.random() * 1010000), //This is just a temporary id for optimistic update
        quote,
        author,
        created_at: new Date().toISOString(),
      };
      //Optimistically updating the query cache to include the new data
      queryClient.setQueryData<ApiResponse<Quote[]>>(["quotes"], (old) => {
        if (!old) return { success: true, message: "", data: [tempQuote] };
        return {
          ...old,
          data: [tempQuote, ...(old.data ?? [])],
        };
      });

      //Returning the snapshot of the previous items to enable rollback
      return { previousQuotes, tempQuote };
    },
    onError: (_err, _newQuote, onMutateResult) => {
      toast.error("An error occurred while trying to create your quote");
      if (onMutateResult?.previousQuotes) {
        queryClient.setQueryData(["quotes"], onMutateResult.previousQuotes);
      }
    },
    onSuccess: (newQuote, _variables, onMutateResult) => {
      //Removing the old item and replacing with that from the database
      queryClient.setQueryData<ApiResponse<Quote[]>>(["quotes"], (old) => {
        if (!old || !old.data) return old;
        const filtered = old.data.filter(
          (q) => q.id !== onMutateResult?.tempQuote.id
        );
        // Add the real quote from the server
        return {
          ...old,
          data: [newQuote.data, ...filtered],
        };
      });

      toast.success("Added successfuly", {
        description: "Your Quote was added successfully",
      });
    },
  });
}

export function useUpdateQuoteMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    { id: number; quote: string; author: string },
    { previousQuotes?: ApiResponse<Quote[]> }
  >({
    mutationFn: async (quote) => {
      const res = await axios.patch("/api", quote);
      return res.data;
    },
    onMutate: async (quote) => {
      //stopping all that are currently running to prevent them from interfering with the optimistic update
      await queryClient.cancelQueries({ queryKey: ["quotes"] });
      //Taking a snapshots of the previous quotes for rollback
      const previousQuotes = queryClient.getQueryData<ApiResponse<Quote[]>>([
        "quotes",
      ]);
      //Updating the cache for the optimistic update
      queryClient.setQueryData<ApiResponse<Quote[]>>(["quotes"], (old) => {
        if (!old || !old.data) return old;
        const updated = old.data.map((q) =>
          q.id === quote.id ? { ...quote, created_at: q.created_at } : q
        );
        return {
          ...old,
          data: updated,
        };
      });
      return { previousQuotes };
    },
    onError: (_err, _vars, context) => {
      toast.error("An error occurred while trying to update the quotes!");
      if (context?.previousQuotes) {
        queryClient.setQueryData(["quotes"], context.previousQuotes);
      }
    },
    onSuccess: (_data, variable) => {
      queryClient.invalidateQueries({ queryKey: ["quote", variable.id] });
      toast.success("Quote updated successfully!");
    },
  });
}

export function useDeleteQuoteMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    number,
    { previousQuotes?: ApiResponse<Quote[]> }
  >({
    mutationFn: async (id) => {
      const res = await axios.delete("/api", { data: { id } });
      return res.data;
    },
    onMutate: async (id) => {
      //This will then change the cache immediately and optimistically update it
      await queryClient.cancelQueries({ queryKey: ["quotes"] });
      //Getting the previous data so that I can rollback later
      const previousQuotes = queryClient.getQueryData<ApiResponse<Quote[]>>([
        "quotes",
      ]);
      //Removing the quote with the id from the cache
      if (previousQuotes && previousQuotes.data) {
        queryClient.setQueryData<ApiResponse<Quote[]>>(["quotes"], {
          ...previousQuotes,
          data: previousQuotes.data.filter((q) => q.id !== id),
        });
      }
      //Returning the previous quotes so that the server can later on return
      return { previousQuotes };
    },
    onError: (_err, _id, onMutateResult) => {
      // Rollback to previous data if something goes wrong
      if (onMutateResult?.previousQuotes) {
        queryClient.setQueryData(["quotes"], onMutateResult.previousQuotes);
      }
      toast.error("An error occurred while deleting your quote");
    },
    onSuccess: () => {
      toast.success("Quote Deleted successfully!");
    },
  });
}
