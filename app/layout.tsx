import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spot Clean",
  description: "주변 쓰레기를 신고하고 청결한 거리를 만들어요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="h-screen overflow-hidden">{children}</body>
    </html>
  );
}
