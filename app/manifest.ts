import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Kept", short_name: "Kept", description: "Promise versus Reality untuk open trip.", start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: "#496af1", lang: "id", icons: [{ src: "/kept-logo.png", sizes: "512x512", type: "image/png" }] };
}
