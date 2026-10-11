"use client";
import Icon from "@/components/Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SliceButton from "@/components/SliceButton";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: new FormData(e.currentTarget).get("password") }),
    });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ocean p-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[2rem] bg-ice p-8 text-ocean shadow-2xl">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-ocean text-peach">
          <Icon name="lock" size={30} />
        </div>
        <h1 className="font-display mt-5 text-center text-2xl font-extrabold">Putin Edit admin</h1>
        <p className="mt-1 text-center text-sm text-ocean/70">Sign in to manage your work and see your visitors.</p>

        <label htmlFor="password" className="mt-7 block text-sm font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 w-full rounded-2xl border border-ocean/20 bg-white px-4 py-3 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20"
        />
        {error && <p role="alert" className="mt-3 text-sm font-medium text-red-700">{error}</p>}
        <SliceButton type="submit" variant="ocean" size="lg" disabled={busy} className="mt-6 w-full">
          {busy ? "Signing in..." : "Sign in"}
        </SliceButton>
      </form>
    </div>
  );
}
