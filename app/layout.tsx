import type { Metadata } from "next";
import { Lunasima } from "next/font/google";
import "./globals.css";
import Container from "./contianer";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { ClerkProvider } from "@clerk/nextjs";

const lunasima = Lunasima({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick Reads",
  description:
    "You haven't had time to read that book? We got you covered with quick reads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html className="bg-white" lang="en">
        <body className={lunasima.className}>
          <Container>
            <Navbar />
            {children}
          </Container>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
