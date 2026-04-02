"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const navigate = useRouter();
  return (
    <div className="">
      <button onClick={() => navigate.push("/create-website")} className="p-4">Create website</button>
    </div>
  );
}
