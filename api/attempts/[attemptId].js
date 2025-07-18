import { supabase } from "@/lib/supabaseClient";

export async function GET(request, { params }) {
  const { attemptId } = params;

  const { data, error } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request, { params }) {
  const { attemptId } = params;
  const body = await request.json();

  const { answers, submitted_at } = body;

  const { data, error } = await supabase
    .from("test_attempts")
    .update({ answers, submitted_at })
    .eq("id", attemptId)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request, { params }) {
  const { attemptId } = params;

  const { error } = await supabase.from("test_attempts").delete().eq("id", attemptId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(null, { status: 204 });
}
