import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
})

export async function sendPaymentEmail(product, buyerEmail) {
  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `Payment Received for ${product.name}`,
    html: `
      <h2>New Payment Received!</h2>
      <p><strong>Product:</strong> ${product.name}</p>
      <p><strong>Price:</strong> ₹${product.price}</p>
      <p><strong>Buyer Email:</strong> ${buyerEmail}</p>
    `,
  })
}
