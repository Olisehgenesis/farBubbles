"use client";

import dynamic from "next/dynamic";

const TokenBubbles = dynamic(() => import("~/components/TokenBubbles"), {
  ssr: false,
});

export default function App() {
  return <TokenBubbles />;
}
