import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    let userId = null
    let userEmail = null

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id
      userEmail = user?.email
    }

    if (!userId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail || undefined,
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_MEMBERSHIP_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/members?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/videos`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Subscription failed', details: String(error) },
      { status: 500 }
    )
  }
}