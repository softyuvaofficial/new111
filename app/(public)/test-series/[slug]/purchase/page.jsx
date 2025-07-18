"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import supabase from '@/lib/supabaseClient'
import Link from "next/link";

export default function PurchasePage() {
  const { slug } = useParams();
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", user.id)
        .single();

      setCoins(profile?.coins || 0);

      const { data: testData } = await supabase
        .from("test_series")
        .select("*")
        .eq("slug", slug)
        .single();

      setTest(testData);

      // Check if already purchased
      const { data: purchaseData } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .eq("test_id", testData.id)
        .single();

      setAlreadyPurchased(!!purchaseData);

      setLoading(false);
    }

    init();
  }, [slug]);

  const handleCoinUnlock = async () => {
    if (coins < test.coin_cost) {
      alert("Not enough coins.");
      return;
    }

    const { error: purchaseError } = await supabase.from("purchases").insert([
      {
        user_id: user.id,
        test_id: test.id,
        method: "coins",
      },
    ]);

    if (purchaseError) {
      console.error(purchaseError);
      alert("Error unlocking test.");
      return;
    }

    // Deduct coins
    await supabase
      .from("profiles")
      .update({ coins: coins - test.coin_cost })
      .eq("id", user.id);

    router.push(`/test-series/${slug}/instructions`);
  };

  const handlePayNow = async () => {
    // Redirect to payment API route (e.g. Razorpay / Instamojo)
    router.push(`/api/payments/createOrder?testId=${test.id}`);
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  if (alreadyPurchased) {
    router.push(`/test-series/${slug}/instructions`);
    return null;
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Unlock {test.title}</h1>

      <p className="mb-4 text-gray-600 text-center">{test.description || "Get access to this test now!"}</p>

      <div className="flex flex-col items-center gap-4 mb-6">
        {test.coin_cost > 0 && (
          <button
            onClick={handleCoinUnlock}
            className={`px-6 py-3 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition ${
              coins < test.coin_cost ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={coins < test.coin_cost}
          >
            Unlock with {test.coin_cost} Coins (You have {coins})
          </button>
        )}

        {test.price > 0 && (
          <button
            onClick={handlePayNow}
            className="px-6 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Pay ₹{test.price} & Unlock
          </button>
        )}
      </div>

      <Link href="/test-series">
        <p className="text-center text-gray-500 underline">Back to Test Series</p>
      </Link>
    </main>
  );
}
