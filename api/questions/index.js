import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch list of questions with pagination and optional filters
    const { page = 1, limit = 10, search = "", subject, difficulty } = req.query;

    const offset = (page - 1) * limit;

    let query = supabase.from("questions").select("*");

    // Filtering
    if (search) {
      query = query.ilike("question_text", `%${search}%`);
    }
    if (subject) {
      query = query.eq("subject", subject);
    }
    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    // Pagination
    const { data, error, count } = await query.range(offset, offset + limit - 1).order("created_at", { ascending: false }).limit(limit).maybeSingle();

    if (error) return res.status(500).json({ error: error.message });

    // Fetch total count separately if needed
    const { count: totalCount, error: countError } = await supabase
      .from("questions")
      .select("id", { count: "exact", head: true });

    if (countError) return res.status(500).json({ error: countError.message });

    return res.status(200).json({
      questions: data,
      page: Number(page),
      limit: Number(limit),
      total: totalCount,
    });
  }

  else if (req.method === "POST") {
    // Create new question
    const newQuestion = req.body;

    if (!newQuestion.question_text || !newQuestion.options || newQuestion.correct_option === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase.from("questions").insert([newQuestion]).single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
  }

  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
