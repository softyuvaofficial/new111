import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();

    const { test_id, user_id, answers, submitted_at } = body;

    if (!test_id || !user_id || !answers) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400 }
      );
    }

    // Upsert attempt (insert or update)
    const { data, error } = await supabase
      .from("test_attempts")
      .upsert(
        {
          test_id,
          user_id,
          answers,
          submitted_at: submitted_at || null,
        },
        {
          onConflict: ["test_id", "user_id"],
          returning: "representation",
        }
      );

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ attempt: data[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
