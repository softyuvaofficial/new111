import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { questionId } = req.query;

  if (!questionId) {
    return res.status(400).json({ error: "Missing questionId" });
  }

  if (req.method === "GET") {
    // Fetch question by ID
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", questionId)
      .single();

    if (error) return res.status(404).json({ error: error.message });
    return res.status(200).json(data);
  }

  else if (req.method === "PUT") {
    // Update question
    const updatedQuestion = req.body;

    if (!updatedQuestion || Object.keys(updatedQuestion).length === 0) {
      return res.status(400).json({ error: "No data to update" });
    }

    const { data, error } = await supabase
      .from("questions")
      .update(updatedQuestion)
      .eq("id", questionId)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  else if (req.method === "DELETE") {
    // Delete question
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Question deleted successfully" });
  }

  else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
