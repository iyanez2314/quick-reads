"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();

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

    const quote = await prisma.quotesOnUsers.delete({
      where: {
        userId_quoteId: {
          userId: user.id,
          quoteId: quoteId as string,
        },
      },
    });

    if (!quote) {
      throw new Error("Quote not found");
    }

    await prisma.$disconnect();

    revalidatePath("/dashboard");

    return { message: "Quote Deleted", status: 200 };
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    return { message: "Error Deleting Quote", status: 500 };
  } finally {
    await prisma.$disconnect();
  }
}
