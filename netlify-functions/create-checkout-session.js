const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    // Only allow POST requests
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
      headers: { "Allow": "POST" },
    };
  }

  try {
    const body = JSON.parse(event.body);
    const product_name = body.product_name;
    const amount = body.amount;

    // Validate the input
    if (!product_name || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad Request: Missing parameters" }),
      };
    }

    // Create a new product
    const product = await stripe.products.create({
      name: product_name,
    });

    // Create a price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount * 100,
      currency: 'usd',
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: "https://httpbin.org/get?status=success",
cancel_url: "https://httpbin.org/get?status=cancel",
    });

    // Redirect to the Stripe checkout page
    return {
      statusCode: 303,
      headers: { Location: session.url },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Error creating checkout session: ", err);

    // Internal Server Error response for unhandled exceptions
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
