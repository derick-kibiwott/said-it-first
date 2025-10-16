import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

type ApiResponse<T> = {
  message: string;
  data: T | null;
  success: boolean;
};

// Helper to generate consistent responses
function createResponse<T>(
  status: number,
  message: string,
  data: T | null = null,
  success: boolean = true
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ message, data, success }, { status });
}

// Create a quote
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quote, author } = body;

    if (!quote) return createResponse(400, "Quote is required", null, false);

    const { data, error } = await supabase
      .from("quotes")
      .insert([{ quote, author }])
      .select()
      .single();

    if (error) return createResponse(500, error.message, null, false);

    return createResponse(201, "Quote added successfully", data, true);
  } catch (err: any) {
    return createResponse(500, err.message, null, false);
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // ✅ Fetch single quote
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return createResponse(500, error.message, null, false);
      if (!data) return createResponse(404, "Quote not found", null, false);

      return createResponse(200, "Fetched quote successfully", data, true);
    }

    // ✅ Otherwise, fetch all quotes
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return createResponse(500, error.message, null, false);

    return createResponse(200, "Fetched all quotes successfully", data, true);
  } catch (err: any) {
    return createResponse(500, err.message, null, false);
  }
}

// Update a quote
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, quote, author } = body;

    if (!id) return createResponse(400, "Quote ID is required", null, false);

    const { data, error } = await supabase
      .from("quotes")
      .update({ quote, author })
      .eq("id", id)
      .select()
      .single();

    if (error) return createResponse(500, error.message, null, false);

    return createResponse(200, "Quote updated successfully", data, true);
  } catch (err: any) {
    return createResponse(500, err.message, null, false);
  }
}

// Delete a quote
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return createResponse(400, "Quote ID is required", null, false);

    const { data, error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) return createResponse(500, error.message, null, false);

    return createResponse(200, "Quote deleted successfully", data, true);
  } catch (err: any) {
    return createResponse(500, err.message, null, false);
  }
}
