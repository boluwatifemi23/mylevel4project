import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import Navbar from "./components/shared/Navbar";
import ToastProvider from "./components/providers/ToastProvider";

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParentCircle - Connect, Share, and Grow Together",
  description: "A social platform for parents to share milestones and connect",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentUser = null;

  try {
    const session = await getSession();
    
    if (session?.userId) {
      await connectDB();

      const user = await User.findById(session.userId)
        .select("-password")
        .lean();

      if (user) {
        currentUser = {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          profile: user.profile,
          stats: user.stats,
        };
      }
    }
  } catch (error) {
    console.error('Layout auth check failed:', error);
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider />
        <Navbar user={currentUser} />
        <main className="min-h-screen bg-linear-to-br from-pink-50 via-white to-blue-50">
          {children}
        </main>
      </body>
    </html>
  );
}