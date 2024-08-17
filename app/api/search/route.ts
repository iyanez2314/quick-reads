import { NextResponse, NextRequest } from "next/server";
import openai from "@/app/services/openai";

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
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that will search for a entreprenurial books if the information given to you is not about books you need to let the user know that you are ONLY designed to give in depth details about books. If the information given to you is about books you will retrun 5 quotes from the book. You will also return in depth details about the book.",
        },
        {
          role: "user",
          content: `Please give me quotes from this book ${book}`,
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
