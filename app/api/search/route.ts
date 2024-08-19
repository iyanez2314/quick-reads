import { NextResponse, NextRequest } from "next/server";
import openai from "@/app/services/openai";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { input } = body;

    if (input.length <= 3) {
      return NextResponse.json({
        message: "Input must be at least 3 characters long",
        status: 400,
      });
    }

    const openApiResponse = await openAiSearch(input);

    if (!openApiResponse) {
      return NextResponse.json({
        message: "No quotes found for this book",
        status: 404,
      });
    }

    return openApiResponse;
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}

async function openAiSearch(book: string) {
  try {
    const { userId } = auth();

    console.log(userId);

    if (!userId) {
      return NextResponse.json({
        message: "unauthorized request made",
        status: 401,
      });
    }

    console.log(userId);

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    const isUserPaid = user?.paid;

    console.log(isUserPaid);

    if (!isUserPaid) {
      console.log("User is not authorized to make this request");
      return NextResponse.json({
        message: "User is not authorized to make this request",
        status: 403,
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that provides in-depth details about entrepreneurial books. When you present quotes, format them using the custom Markdown syntax [quote]...[/quote]. If the information given to you is not about books, inform the user that you are ONLY designed to give in-depth details about books. Please provide 5 quotes from the book and additional details about the book.",
        },
        {
          role: "user",
          content: `Please give me quotes from this book: ${book}`,
        },
      ],
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          controller.enqueue(encoder.encode(text));
        }

        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}
