"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwmhSOzgFsx3J_2y3sL_RaaCME6qpLrR2WGTgBeEWTvbSTAp-UmiPgdtBd3hFV_GvHjOg/exec";

const benefits = [
  "Early Access",
  "Exclusive Discounts",
  "First Access to New Product Drops",
  "Founder Updates",
  "Members-only Launch Benefits",
];

interface FormValues {
  name: string;
  email: string;
  phone: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onBlur" });

  const onSubmit = async (data: FormValues) => {
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="waitlist"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-charcoal px-6 py-24"
    >
      <div className="glass-panel relative z-10 w-full max-w-xl rounded-[2rem] px-8 py-12 sm:px-12 sm:py-16 animate-[float_6s_ease-in-out_infinite]">
        <h2 className="font-display text-center text-3xl font-light text-glow sm:text-4xl">
          Join the Waitlist
        </h2>
        <p className="mt-3 text-center text-sm text-ivory/60">
          Be the first to know when Dazzen launches.
        </p>

        {status === "success" ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <span className="text-3xl text-champagne">&#10003;</span>
            <p className="font-display text-xl text-ivory">
              You&apos;re officially on the list.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                className="w-full rounded-xl border border-champagne/25 bg-ivory/5 px-5 py-3.5 text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-champagne/70"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-300">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="w-full rounded-xl border border-champagne/25 bg-ivory/5 px-5 py-3.5 text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-champagne/70"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-300">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Contact Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Contact Number"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                className="w-full rounded-xl border border-champagne/25 bg-ivory/5 px-5 py-3.5 text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-champagne/70"
                {...register("phone", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]{7,20}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-300">{errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 rounded-full bg-champagne px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] text-charcoal transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,196,154,0.5)] disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting…" : "Join the Waitlist"}
            </button>

            {status === "error" && (
              <p className="text-center text-xs text-red-300">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        <ul className="mt-10 grid grid-cols-1 gap-2.5 text-sm text-ivory/70 sm:grid-cols-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="text-champagne">&#10003;</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
