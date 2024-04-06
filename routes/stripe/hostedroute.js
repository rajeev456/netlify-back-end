const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

const express = require("express");
// const stripe = require("stripe")(
//   "sk_test_51OyW8kFeO7aw5wH94zmD7uVAHDdl4nDA20QyglMPicPVn88yPcKSEcUhBRyUe6fx2fFdRmHc0eG3b3DzO7u1pPB900LFzBrFJP"
// );
const router = express();

router.post("/create-checkout-session", async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: req.body.product_name,
    });

    if (product) {
      var price = await stripe.prices.create({
        product: `${product?.id}`,
        unit_amount: req.body.amount * 100,
        currency: "usd",
      });
    }
    if (price.id) {
      var session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: `${price.id}`,
            quantity: 1,
          },
        ],
        customer_email: "codesense24@gmail.com",
        mode: "payment",
        success_url: "https://httpbin.org/get?status=success",
cancel_url: "https://httpbin.org/get?status=cancel",

      });
      console.log(session);
      return res.redirect(303, session?.url);
    }
  } catch (err) {
    console.log("error in create-checkout-session", err);
    return res.status(500), json({ message: "internal server error" });
  }
});

router.get("/success", async (req, res) => {
  try {
    return res.redirect("http://localhost:3000/success");
  } catch (error) {
    console.log("error in success", err);
    return res.status(500), json({ message: "internal server error" });
  }
});

router.get("/cancel", async (req, res) => {
  try {
    return res.redirect("http://localhost:3000/failure");
  } catch (error) {
    console.log("error in success", err);
    return res.status(500), json({ message: "internal server error" });
  }
});

module.exports = router;
