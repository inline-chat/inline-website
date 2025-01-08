import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"

import "./style.css"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inline - Messaging for teams that crave high-quality software" />
        <meta
          name="twitter:description"
          content="We're building a native, fast, powerful chat app for teams. It's ultra-low RAM, 120 fps, tranquil and has context-aware notifications."
        />
        <meta name="twitter:image" content="https://inline.chat/twitter-og.jpg" />
        <meta name="og:image" content="https://inline.chat/twitter-og.jpg" />
        <link rel="icon" href="/favicon.ico" />

        <link
          href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@700&family=Reddit+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
