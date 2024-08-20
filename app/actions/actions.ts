"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

type lineItems = Stripe.Checkout.SessionCreateParams.LineItem;

export interface QuoteArg {
  quote: string;
  book: string;
}

export async function attachQuoteToUser(data: QuoteArg) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const quote = await prisma.quotes.create({
      data: {
        quote: data.quote,
        book: data.book,
      },
    });

    if (!quote) {
      throw new Error("Quote not created");
    }

    const attachToUser = await prisma.quotesOnUsers.create({
      data: {
        userId: user.id,
        quoteId: quote.id,
      },
    });

    if (!attachToUser) {
      throw new Error("Quote not attached to user");
    }

    await prisma.$disconnect();

    revalidatePath("/dashboard");

    return { message: "Quote Attached", status: 201 };
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    return { message: "Error Attaching Quote", status: 500 };
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteQuote(formData: FormData) {
  try {
    const quoteId = formData.get("quote");
    console.log("quoteId:", quoteId);
    const { userId } = auth();

    if (!quoteId) {
      throw new Error("Quote not found");
    }

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const existingRecord = await prisma.quotesOnUsers.findUnique({
      where: {
        userId_quoteId: {
          userId: user.id,
          quoteId: quoteId as string,
        },
      },
    });

    if (!existingRecord) {
      throw new Error("Quote not found before attempting to delete");
    }

    const quote = await prisma.quotesOnUsers.delete({
      where: {
        userId_quoteId: {
          userId: user.id,
          quoteId: quoteId as string,
        },
      },
    });

    console.log("Deleted quote:", quote);

    revalidatePath("/dashboard");

    return { message: "Quote Deleted", status: 200 };
  } catch (error) {
    console.error("Error in deleteQuote:", error);
    return { message: "Error Deleting Quote", status: 500 };
  } finally {
    await prisma.$disconnect();
  }
}

export async function getActiveSub() {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isActiveSub = user.paid;

    await prisma.$disconnect();

    return {
      message: "Subscription Found",
      activeSub: isActiveSub,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    return { message: "Error Getting Subscription", status: 500 };
  } finally {
    await prisma.$disconnect();
  }
}

// Stripe
export async function createStripeCheckout(lineItems: lineItems[]) {
  try {
    const user = await currentUser();

    if (!user) {
      return { sessionId: null, checkoutError: "You need to be signed in" };
    }

    console.log(user);

    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN as string;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      success_url: `${origin}/checkout?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      customer_email: user.emailAddresses[0].emailAddress,
    });

    if (!session) {
      console.error("Error creating checkout session");
      return {
        sessionId: null,
        checkoutError: "Error creating checkout session",
      };
    }

    console.log(session);

    return { sessionId: session.id, checkoutError: null };
  } catch (error) {
    console.error(error);
    return { message: "Error Creating Stripe Checkout", status: 500 };
  }
}

export async function retrieveStripeCheckout(sessionId: string) {
  if (!sessionId) {
    return { message: "No Session ID", status: 400 };
  }
  try {
    const user = await currentUser();

    if (!user) {
      return { message: "You need to be signed in", status: 401 };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      console.error("Error retrieving checkout session");
      return { message: "Error retrieving checkout session", status: 500 };
    }

    const userInDb = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userInDb) {
      return { message: "User not found", status: 404 };
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        paid: true,
      },
    });

    if (!updatedUser) {
      return { message: "User not updated", status: 500 };
    }

    revalidatePath("/dashboard");

    await prisma.$disconnect();

    return { message: "Stripe Checkout Retrieved", status: 200 };
  } catch (error) {
    console.error(error);
    return { message: "Error Retrieving Stripe Checkout", status: 500 };
  } finally {
    await prisma.$disconnect();
  }
}
