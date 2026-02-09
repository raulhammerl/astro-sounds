import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// 1. Grab all secrets from the environment
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')
const BLOG_BASE_URL = Deno.env.get('BLOG_BASE_URL')

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    const postUrl = `${BLOG_BASE_URL}/posts/${record.slug}`

    const message = `
<b>-- NEW_SOUND_DETECTED --</b>

<b>ARTIST:</b> ${record.artist?.toUpperCase() || 'UNKNOWN'}
<b>TITLE:</b> ${record.title?.toUpperCase() || 'UNTITLED'}
<b>BY:</b> ${record.posted_by || 'ANON'}

<a href="${postUrl}">LISTEN ON THE BLOG</a>
------------------------------`.trim()

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML', // Using HTML to avoid character escaping issues
      }),
    })

    const result = await response.json()
    
    // Log the result so we can see it in the Supabase Dashboard
    console.log("TELEGRAM_API_RESPONSE:", JSON.stringify(result))

    if (!result.ok) {
      return new Response(JSON.stringify({ error: result.description }), { status: 400 })
    }

    return new Response(JSON.stringify({ status: "success" }), { status: 200 })

  } catch (err) {
    console.error("FUNCTION_CRASHED:", err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
