import "./globals.css";

export const metadata = {
  title: "OG Image Generator",
  description: "Create beautiful OpenGraph images for your content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
