import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { quizzes, tests } from "@/lib/learn-data";

const BASE_URL = "https://emotion-spark-unlimited.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/resources", "/internships", "/quizzes", "/tests", "/about"];
        const quizPaths = quizzes.map((q) => `/quizzes/${q.slug}`);
        const testPaths = tests.map((t) => `/tests/${t.slug}`);
        const all = [...staticPaths, ...quizPaths, ...testPaths];
        const urls = all
          .map(
            (p) => `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
