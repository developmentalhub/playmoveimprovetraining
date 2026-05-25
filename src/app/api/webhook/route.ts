import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

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

    const userId = session.metadata?.user_id
    const itemIds = session.metadata?.item_ids?.split(',') || []
    const itemTypes = session.metadata?.item_types?.split(',') || []

    console.log('Webhook received:', { userId, itemIds, itemTypes })

    if (userId && itemIds.length > 0) {
      for (let i = 0; i < itemIds.length; i++) {
        const isBundle = itemTypes[i] === 'bundle'

        if (isBundle) {
          const { data: bundleVideos } = await supabase
            .from('bundle_videos')
            .select('video_id')
            .eq('bundle_id', itemIds[i])

          console.log('Bundle videos found:', bundleVideos?.length)

          if (bundleVideos && bundleVideos.length > 0) {
            for (const bv of bundleVideos) {
              const { error } = await supabase.from('purchases').insert({
                user_id: userId,
                video_id: bv.video_id,
                stripe_payment_id: session.payment_intent as string,
                amount_paid: 0,
              })
              if (error) console.error('Insert error:', error)
            }
          } else {
            console.log('No bundle videos found for bundle:', itemIds[i])
            const { error } = await supabase.from('purchases').insert({
              user_id: userId,
              video_id: null,
              stripe_payment_id: session.payment_intent as string,
              amount_paid: session.amount_total || 0,
            })
            if (error) console.error('Insert error:', error)
          }
        } else {
          const { error } = await supabase.from('purchases').insert({
            user_id: userId,
            video_id: itemIds[i],
            stripe_payment_id: session.payment_intent as string,
            amount_paid: session.amount_total || 0,
          })
          if (error) console.error('Insert error:', error)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}