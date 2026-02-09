import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    // Constructing a robust HTML message
    const message = `
<b>-- NEW_TRANSMISSION --</b>
<b>ARTIST:</b> ${record.artist?.toUpperCase() || 'UNKNOWN'}
<b>TITLE:</b> ${record.title?.toUpperCase() || 'UNTITLED'}
<b>BY:</b> ${record.posted_by || 'ANON'}
${record.youtube_url ? `🔗 <b>URL:</b> ${record.youtube_url}` : '📦 <b>SOURCE:</b> RAW_EMBED'}

<b>NOTES:</b>
<i>${record.description || 'SYSTEM_READY'}</i>
------------------------------`.trim()

    // 1. We MUST 'await' this and check the result
    const telRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML', // HTML is much safer than Markdown
      }),
    })

    const telData = await telRes.json()

    // 2. Log exactly what Telegram says back to us
    console.log("TELEGRAM_API_RESPONSE:", JSON.stringify(telData))

    if (!telData.ok) {
      // If Telegram failed, we return an error so it shows up in Supabase Logs
      return new Response(JSON.stringify({ error: telData.description }), { status: 400 })
    }

    return new Response(JSON.stringify({ status: 'sent' }), { status: 200 })

  } catch (err) {
    console.error("EDGE_FUNCTION_CRASH:", err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
