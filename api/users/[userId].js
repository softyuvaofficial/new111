import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  if (req.method === "GET") {
    // Get user details
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return res.status(404).json({ error: error.message });
    return res.status(200).json(data);
  }

  else if (req.method === "PUT") {
    // Update user info
    const updatedUser = req.body;
    if (!updatedUser || Object.keys(updatedUser).length === 0) {
      return res.status(400).json({ error: "No data to update" });
    }

    const { data, error } = await supabase
      .from("users")
      .update(updatedUser)
      .eq("id", userId)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  else if (req.method === "DELETE") {
    // Delete user
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "User deleted successfully" });
  }

  else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
