import { createWebhooksHandler } from "@brianmmdev/clerk-webhooks-handler";
import { Stripe } from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handler = createWebhooksHandler({
  onUserCreated: async (user) => {
    const { cardToken, priceId } = user.unsafe_metadata;

    if (!cardToken || !priceId) {
      return;
    }

    console.log("Creating subscription for user", user.id);
    console.log("Card token", cardToken);

    console.log("Creating payment method");

    const pm = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: cardToken as string,
      },
    });

    const customer = await stripe.customers.create({
      email: user?.email_addresses[0].email_address,
      payment_method: pm.id,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      default_payment_method: pm.id,
      items: [
        {
          price: priceId as string,
        },
      ],
    });

    await clerkClient.users.updateUser(user.id, {
      publicMetadata: {
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
      },
    });
  },
});

export const POST = handler.POST;
