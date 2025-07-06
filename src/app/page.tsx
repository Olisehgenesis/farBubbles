import { Metadata } from "next";
import App from "./app";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "farBubbles - Explore Celo Network Tokens",
    description: "Discover and explore tokens on the Celo network with beautiful animated bubbles. View Ubeswap token list with interactive animations.",
    openGraph: {
      title: "farBubbles - Explore Celo Network Tokens",
      description: "Discover and explore tokens on the Celo network with beautiful animated bubbles.",
      type: "website",
    },
  };
}

export default function Home() {
  return <App />;
}
