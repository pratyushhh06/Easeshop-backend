const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createAccountSession = async (req, res) => {
    try {
      console.log(req.body);
      const { products } = req.body;
  
      // Construct the line items for each product
      const lineItems = products.map((product) => ({
        price_data: {
          currency: "INR",
          product_data: {
            name: product.name // Assuming 'dish' contains the product name
          },
          unit_amount: product.price * 100, // Stripe expects the amount in the smallest currency unit (e.g., paise for INR)
        },
        quantity: product.quantity // Assuming 'qnty' is the quantity
      }));
  
      // Create the Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success", // Make sure the URL is correct
        cancel_url: "http://localhost:3000/cancel", // Make sure the URL is correct
      });
  
      // Send back the session ID to the client
      res.status(200).json({
        status: true,
        id:session.id,
      });
    } catch (error) {
      console.error("Error while creating the session:", error);
      res.status(500).json({
        status: false,
        message: "Error while session account creation",
      });
    }
  };

module.exports = {
    createAccountSession
}
