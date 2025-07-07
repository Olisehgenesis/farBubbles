export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  
  // The .well-known/farcaster.json route is used to provide the configuration for the Mini App.
  // You need to generate the accountAssociation payload and signature using this link:
  // https://farcaster.xyz/~/developers/mini-apps/manifest?domain=farbubbles.vercel.app
  const config = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    frame: {
      version: "1",
      name: "Celo Bubbles",
      description: "Create and trade unique digital bubbles on Celo",
      iconUrl: `${appUrl}/celosplash.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/tipme.png`,
      buttonTitle: "Start Bubbling",
      splashImageUrl: `${appUrl}/celosplash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}