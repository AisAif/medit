import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  srcDir: "app",
  modules: ["@nuxt/image", "shadcn-nuxt", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/components/ui",
  },
  app: {
    head: {
      title: "MEDIT - Media Editor",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Your creative playground for image editing. Edit, crop, resize, and enhance your photos with powerful tools. Upload images, apply filters, adjust colors, and export in multiple formats.",
        },
        {
          name: "keywords",
          content:
            "photo editor, image editor, online photo editing, crop image, resize image, photo filters, image tools, creative editing",
        },
        { name: "author", content: "MEDIT Team" },
        { name: "robots", content: "index, follow" },
        // Open Graph meta tags
        {
          property: "og:title",
          content: "Media Editor - Creative Photo Editing Tool",
        },
        {
          property: "og:description",
          content:
            "Your creative playground for image editing. Edit, crop, resize, and enhance your photos with powerful tools.",
        },
        { property: "og:type", content: "website" },
        {
          property: "og:image",
          content: "/logo.png",
        },
        { property: "og:url", content: "https://media-editor.com" },
        // Twitter Card meta tags
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Media Editor - Creative Photo Editing Tool",
        },
        {
          name: "twitter:description",
          content:
            "Your creative playground for image editing. Edit, crop, resize, and enhance your photos with powerful tools.",
        },
        {
          name: "twitter:image",
          content: "/logo.png",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://media-editor.com" },
        // Preload important resources
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
      ],
    },
  },
});

