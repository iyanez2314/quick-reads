import { User } from "@/app/api/webhook/create-user/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUserInDb(data: User) {
  try {
    const createUser = await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        name: data.name,
        email: data.email,
      },
    });

    if (!createUser) {
      return { message: "User not created", status: 400 };
    }

    await prisma.$disconnect();

    console.log("User created: ", createUser);
    return { message: "User created", status: 201 };
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    return { message: "Error creating user", status: 500 };
  } finally {
    await prisma.$disconnect();
  }
}

export async function usersQuotes(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { message: "User not found", status: 404 };
    }

    const quotes = await prisma.quotesOnUsers.findMany({
      where: { userId: user?.id },
      include: { quote: true },
      orderBy: {
        quote: {
          quote: "asc",
        },
      },
    });

    if (!quotes) {
      return { message: "Quotes not found", status: 404 };
    }

    await prisma.$disconnect();

    return quotes;
  } catch (error) {
    console.error("Error searching for book: ", error);
    await prisma.$disconnect();
    return { message: "Error searching for book", status: 500 };
  } finally {
    await prisma.$disconnect();
  }
}
