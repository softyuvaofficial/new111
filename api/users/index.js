import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // List users with pagination and optional search
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from("users").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({
      users: data,
      page: Number(page),
      limit: Number(limit),
      total: count,
    });
  }

  else if (req.method === "POST") {
    // Create new user
    const newUser = req.body;

    if (!newUser.email || !newUser.name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase.from("users").insert([newUser]).single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data);
  }

  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
