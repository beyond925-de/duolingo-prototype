"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [companyId, setCompanyId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyId.trim()) {
      router.push(`/${companyId.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Beyond925</h1>
          <p className="text-gray-600">
            Finde dein Unternehmen und entdecke deinen Traumjob
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Unternehmen
            </label>
            <input
              id="company"
              type="text"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              placeholder="z.B. sollich"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Unternehmen finden
          </button>
        </form>
      </div>
    </div>
  );
}
