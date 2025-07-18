import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { testId } = req.query;

  if (!testId) {
    return res.status(400).json({ error: "Missing testId" });
  }

  if (req.method === "GET") {
    // Fetch test details by ID
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("id", testId)
      .single();

    if (error) return res.status(404).json({ error: error.message });
    return res.status(200).json(data);
  }

  else if (req.method === "PUT") {
    // Update test details
    const updatedTest = req.body;

    if (!updatedTest || Object.keys(updatedTest).length === 0) {
      return res.status(400).json({ error: "No data to update" });
    }

    const { data, error } = await supabase
      .from("tests")
      .update(updatedTest)
      .eq("id", testId)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  else if (req.method === "DELETE") {
    // Delete test by ID
    const { error } = await supabase
      .from("tests")
      .delete()
      .eq("id", testId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Test deleted successfully" });
  }

  else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
