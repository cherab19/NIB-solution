import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message } = await req.json();

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      message: message.trim(),
    });

    if (error) throw error;

    // Send Telegram notification
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (LOVABLE_API_KEY && TELEGRAM_API_KEY && TELEGRAM_CHAT_ID) {
      const text = `📩 <b>New Contact Message</b>\n\n<b>Name:</b> ${name.trim()}\n<b>Email:</b> ${email.trim()}\n<b>Phone:</b> ${phone?.trim() || 'N/A'}\n<b>Message:</b>\n${message.trim()}`;

      const tgResponse = await fetch(`${GATEWAY_URL}/sendMessage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': TELEGRAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      });

      const tgData = await tgResponse.json();
      if (!tgResponse.ok) {
        console.error(`Telegram API error [${tgResponse.status}]:`, JSON.stringify(tgData));
      }
    } else {
      console.warn('Telegram notification skipped: missing env vars');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Contact message saved and notification sent' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error processing contact:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
