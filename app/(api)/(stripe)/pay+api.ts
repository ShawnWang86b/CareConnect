import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, amount } = body();

  if (!name || !email || !amount) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid email", status: 400 })
    );
  }
}
