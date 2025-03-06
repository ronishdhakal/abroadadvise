// app/layout.js

"use client"; // Ensures this is a client-side rendered component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
