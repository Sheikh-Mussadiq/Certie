// Edge Function: run-service-due-notifications
// Manually trigger service due notifications generation.
// Deploy with: supabase functions deploy run-service-due-notifications
// Invoke (service key): curl -L -X POST 'https://<project>.functions.supabase.co/run-service-due-notifications' -H 'Authorization: Bearer SERVICE_ROLE_KEY'

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!url || !serviceKey) {
      return new Response(JSON.stringify({ error: 'Missing env SUPABASE_URL or SERVICE_ROLE_KEY' }), { status: 500 })
    }

    const resp = await fetch(`${url}/rest/v1/rpc/run_service_due_notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify({})
    })

    const data = await resp.json()

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'RPC failed', details: data }), { status: 500 })
    }

    return new Response(JSON.stringify({ inserted: data }), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
})
