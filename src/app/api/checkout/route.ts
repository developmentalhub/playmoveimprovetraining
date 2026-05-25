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
    const { cartItems } = await req.json()

    // Get the current user from the auth header
    const authHeader = req.headers.get('authorization')
    let userId = null

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item: {
        title: string
        price_cents: number
      }) => ({
        price_data: {
          currency: 'aud',
          product_data: {
            name: item.title,
          },
          unit_amount: item.price_cents,
        },
        quantity: 1,
      })),
      mode: 'payment',
      metadata: {
        user_id: userId || '',
        item_ids: cartItems.map((item: { id: string }) => item.id).join(','),
        item_types: cartItems.map((item: { type: string }) => item.type).join(','),
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/shop`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}