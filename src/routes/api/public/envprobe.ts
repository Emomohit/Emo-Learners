import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/api/public/envprobe')({
  server: { handlers: { GET: async () => new Response(JSON.stringify({
    firebase: Boolean(process.env['FIREBASE_API_KEY']),
    google: Boolean(process.env['GOOGLE_API_KEY']),
    lovable: Boolean(process.env['LOVABLE_API_KEY']),
  })) } },
})
