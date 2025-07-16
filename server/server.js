import express from "express"
import cors from "cors"
import Stripe from "stripe"
import dotenv from "dotenv"
import { sendPaymentEmail } from "./mailer.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const orders = []

app.post("/create-checkout-session", async (req, res) => {
  const { product, userEmail } = req.body

  if (!product || !userEmail) {
    return res.status(400).json({ error: "Product or user email missing." })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    })

    if (session?.url) {
      orders.push({
        productName: product.name,
        buyerEmail: userEmail,
        price: product.price,
        date: new Date(),
      })

      try {
        await sendPaymentEmail(product, userEmail)
        console.log("Payment email sent successfully.")
      } catch (mailError) {
        console.error("Email sending failed:", mailError)
      }

      res.json({ url: session.url })
    } else {
      console.error("Stripe session URL missing.")
      res.status(500).json({ error: "Failed to create Stripe session." })
    }
  } catch (error) {
    console.error("Stripe Error:", error)
    res.status(500).json({ error: "Something went wrong with Stripe." })
  }
})

app.get("/orders", (req, res) => {
  res.json(orders)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
