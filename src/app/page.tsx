import { Metadata } from "next";
import App from "./app";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "OrbitalVerse - Explore the Crypto Universe",
    description: "A futuristic crypto indexing app where planets represent cryptocurrencies. Watch as they grow and shrink with market movements in this immersive space environment.",
    openGraph: {
      title: "OrbitalVerse - Explore the Crypto Universe",
      description: "A futuristic crypto indexing app where planets represent cryptocurrencies. Watch as they grow and shrink with market movements in this immersive space environment.",
      type: "website",
    },
  };
}

export default function Home() {
  return <App />;
}
