import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

// Use service role key for webhook — bypasses RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Get full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ['line_items'] }
    )

    const userId = fullSession.metadata?.user_id
    const itemIds = fullSession.metadata?.item_ids?.split(',') || []
    const itemTypes = fullSession.metadata?.item_types?.split(',') || []

    if (userId && itemIds.length > 0) {
      for (let i = 0; i < itemIds.length; i++) {
        const isBundle = itemTypes[i] === 'bundle'

        if (isBundle) {
          // Get all videos in the bundle
          const { data: bundleVideos } = await supabase
            .from('bundle_videos')
            .select('video_id')
            .eq('bundle_id', itemIds[i])

          if (bundleVideos) {
            for (const bv of bundleVideos) {
              await supabase.from('purchases').insert({
                user_id: userId,
                video_id: bv.video_id,
                stripe_payment_id: session.payment_intent as string,
                amount_paid: 0,
              })
            }
          }
        } else {
          await supabase.from('purchases').insert({
            user_id: userId,
            video_id: itemIds[i],
            stripe_payment_id: session.payment_intent as string,
            amount_paid: session.amount_total || 0,
          })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}