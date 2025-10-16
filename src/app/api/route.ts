import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import type { PostgrestError } from "@supabase/supabase-js";

// --- Types ---
export interface Quote {
  id: number;
  quote: string;
  author: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T | null;
  success: boolean;
}

// --- Helper to create responses ---
function createResponse<T>(
  status: number,
  message: string,
  data: T | null = null,
  success = true
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ message, data, success }, { status });
}

// --- CREATE (POST) ---
export async function POST(req: Request) {
  try {
    const body: { quote: string; author?: string } = await req.json();
    const { quote, author } = body;

    if (!quote) return createResponse(400, "Quote is required", null, false);

    const { data, error } = await supabase
      .from("quotes")
      .insert([{ quote, author }])
      .select()
      .single();

    if (error) return handleSupabaseError(error);

    return createResponse(201, "Quote added successfully", data, true);
  } catch (err) {
    return handleUnexpectedError(err);
  }
}

// --- READ (GET) ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) return handleSupabaseError(error);
      if (!data) return createResponse(404, "Quote not found", null, false);

      return createResponse(200, "Fetched quote successfully", data, true);
    }

    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return handleSupabaseError(error);

    return createResponse(200, "Fetched all quotes successfully", data, true);
  } catch (err) {
    return handleUnexpectedError(err);
  }
}

// --- UPDATE (PATCH) ---
export async function PATCH(req: Request) {
  try {
    const body: { id: number; quote: string; author?: string } =
      await req.json();
    const { id, quote, author } = body;

    if (!id) return createResponse(400, "Quote ID is required", null, false);

    const { data, error } = await supabase
      .from("quotes")
      .update({ quote, author })
      .eq("id", id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);

    return createResponse(200, "Quote updated successfully", data, true);
  } catch (err) {
    return handleUnexpectedError(err);
  }
}

// --- DELETE (DELETE) ---
export async function DELETE(req: Request) {
  try {
    const body: { id: number } = await req.json();
    const { id } = body;

    if (!id) return createResponse(400, "Quote ID is required", null, false);

    const { data, error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);

    return createResponse(200, "Quote deleted successfully", data, true);
  } catch (err) {
    return handleUnexpectedError(err);
  }
}

// --- Error Handling Helpers ---
function handleSupabaseError(
  error: PostgrestError
): NextResponse<ApiResponse<null>> {
  return createResponse(500, error.message, null, false);
}

function handleUnexpectedError(
  error: unknown
): NextResponse<ApiResponse<null>> {
  if (error instanceof Error) {
    return createResponse(500, error.message, null, false);
  }
  return createResponse(500, "An unknown error occurred", null, false);
}
