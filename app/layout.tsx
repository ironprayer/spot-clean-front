import type { Metadata } from "next";
import "./globals.css";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";

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
      <body className="h-screen overflow-hidden">
        <GoogleMapsProvider>{children}</GoogleMapsProvider>
      </body>
    </html>
  );
}
