"use client";

import { useEffect, useState } from "react";
import supabase from '../../../lib/supabaseClient';


import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    tests: 0,
    attemptsToday: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      // Total Students
      const { count: studentCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Total Tests
      const { count: testCount } = await supabase
        .from("tests")
        .select("*", { count: "exact", head: true });

      // Attempts Today
      const today = new Date().toISOString().split("T")[0];
      const { count: attemptsCount } = await supabase
        .from("attempts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today);

      // Revenue (sum of payments)
      const { data: payments } = await supabase
        .from("payments")
        .select("amount");

      const totalRevenue = payments?.reduce((acc, p) => acc + p.amount, 0) || 0;

      setStats({
        students: studentCount || 0,
        tests: testCount || 0,
        attemptsToday: attemptsCount || 0,
        revenue: totalRevenue,
      });
    }

    fetchStats();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Students" value={stats.students} color="bg-blue-500" />
        <StatCard title="Total Tests" value={stats.tests} color="bg-green-500" />
        <StatCard title="Attempts Today" value={stats.attemptsToday} color="bg-yellow-500" />
        <StatCard title="Total Revenue" value={`₹${stats.revenue}`} color="bg-indigo-500" />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink title="Create Test" href="/(admin)/tests/create" />
        <QuickLink title="Manage Users" href="/(admin)/users" />
        <QuickLink title="View Reports" href="/(admin)/reports" />
      </div>
    </main>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-lg text-white shadow-md ${color}`}>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function QuickLink({ title, href }) {
  return (
    <Link href={href}>
      <div className="p-5 border rounded-lg hover:bg-gray-100 transition cursor-pointer shadow-sm">
        <h4 className="font-semibold text-center">{title}</h4>
      </div>
    </Link>
  );
}
