import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tiffinz",
    short_name: "Tiffinz",
    description: "Tiffinz",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/admin-dashboard-desktop.png",
        sizes: "1431x849",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshots/wallet-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}
