'use client';
import React from "react";
import next from "next";

export default function AuthLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />

        <p className="mt-4 text-sm font-medium text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
