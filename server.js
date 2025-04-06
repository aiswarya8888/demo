const express = require("express");
const app = express();

const stripe = require("stripe")(
  "sk_test_51RAnBgC6Ommec2ZKyCOnb9PpGbMvA7L20OzXWWrloZKkVdqnEcAG6bE9STHSIXlN9QEi35RvXuD9cVj4L8pIbAX900UX2higsi"
);

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const products = await stripe.products.list({
    limit: 3,
  });

  app.post("/buy/:priceId", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:8000/success",
      line_items: [
        {
          price: req.params.priceId,
          quantity: 2,
        },
      ],
      mode: "payment",
    });
    res.redirect(session.url);
  });

  res.render("products", { data: products.data });
});

app.get("/success", (req, res) => {
  res.send("your purchase is done.");
});

app.listen(8000, () => console.log("server running on port 8000"));
