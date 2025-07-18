import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // List tests with pagination and optional filters
    const { page = 1, limit = 10, search = "", category } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from("tests").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({
      tests: data,
      page: Number(page),
      limit: Number(limit),
      total: count,
    });
  }

  else if (req.method === "POST") {
    // Create new test
    const newTest = req.body;

    if (!newTest.title || !newTest.category || !newTest.duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase.from("tests").insert([newTest]).single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
  }

  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
