import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

serve(async (req) => {
  try {
    const payload = await req.json()
    // 'record' is the new row from your 'posts' table
    const { record } = payload

    // Build the Brutalist/Terminal style message
    const identity = record.posted_by ? `👤 BY: ${record.posted_by.toUpperCase()}` : '👤 BY: ANONYMOUS'
    
    let sourceInfo = ''
    if (record.youtube_url) {
      sourceInfo = `🔗 URL: ${record.youtube_url}`
    } else if (record.embed_code) {
      sourceInfo = `📦 SOURCE: RAW_EMBED_CODE`
    }

    const message = [
      `-- NEW_TRANSMISSION_RECEIVED --`,
      `ARTIST: ${record.artist.toUpperCase()}`,
      `TITLE: ${record.title.toUpperCase()}`,
      identity,
      sourceInfo,
      `\n SYSTEM_NOTES:`,
      record.description || 'EMPTY_DESCRIPTION',
      `\n------------------------------`
    ].join('\n')

    // Send to Telegram API
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `\`\`\`\n${message}\n\`\`\``, // Terminal look with backticks
        parse_mode: 'MarkdownV2',
      }),
    })

    return new Response(JSON.stringify({ status: 'done' }), { 
      headers: { 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
})
