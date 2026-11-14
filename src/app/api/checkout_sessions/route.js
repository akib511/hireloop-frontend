import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { getSession } from '../core/server'

export async function POST() {
  const userSession = await getSession()

  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1UbhoWE5M9GRAbzoj1QGpvTq',
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userSession?.user?.email,

      metadata: {
        userId: userSession?.user?.id,
        userName: userSession?.user?.name,
      },

      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      integration_identifier: 'hire_loop_web_001',
    })

    return NextResponse.redirect(session.url, 303)

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}