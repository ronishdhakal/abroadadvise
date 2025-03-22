"use client";

import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";

import LearnHeader from "./LearnHeader";
import LearnCard from "./LearnCard";
import LearnZero from "./LearnZero";

export default function LearnMorePage() {
  return (
    <>
      {/* ✅ SEO Meta */}
      <Head>
        <title>Learn More | Showcase Your Consultancy or University</title>
        <meta
          name="description"
          content="Claim your consultancy or university on Abroad Advise and reach thousands of students. Increase visibility, build trust, and grow applications."
        />
      </Head>

      {/* ✅ Header */}
      <Header />

      {/* ✅ Page Content */}
      <main className="flex flex-col bg-white">
        <LearnHeader />
        <LearnCard />
        <LearnZero />
      </main>

      {/* ✅ Footer */}
      <Footer />
    </>
  );
}
