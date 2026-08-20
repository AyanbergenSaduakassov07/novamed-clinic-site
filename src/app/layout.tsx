/**
 * Next requires a root layout, but `<html>` and `<body>` are rendered by
 * src/app/[locale]/layout.tsx, which is the first place the locale is known.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
