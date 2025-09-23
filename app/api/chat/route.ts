import { prisma } from "@/shared/lib/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

function cleanResponse(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const LLM_HOST = process.env.LLM_HOST;
    if (!LLM_HOST) {
      return NextResponse.json({
        error: true,
        message: "LLM_HOST is not defined",
      });
    }

    const body = await req.json();
    const { prompt, model, chatId } = body;
    if (!prompt) {
      return NextResponse.json({
        error: true,
        message: "User prompt is missing",
      });
    }

    const promptWithMarkdown = `
Please respond in proper Markdown format:
- No extra spaces inside words or around apostrophes.
- Preserve correct punctuation and spacing.
...
User prompt: ${prompt}
`;

    const postResult = await prisma.messages.create({
      data: {
        text: prompt,
        chatId,
        owner: "user",
        loading: "succeeded",
        model,
      },
    });

    if (!postResult) {
      throw new Error(`[DB_POST_ERROR] for question in Chat: ${chatId}`);
    }

    const ollamaPayload = { model, prompt: promptWithMarkdown, stream: true };
    const ollamaRes = await fetch(`${LLM_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ollamaPayload),
    });

    if (!ollamaRes.ok) {
      const error = await ollamaRes.text();
      await prisma.messages.update({
        data: { loading: "failed" },
        where: { id: postResult.id },
      });
      throw new Error(`[OLLAMA_FETCH_GENERATE] Server Error: ${error}`);
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaRes.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const json = JSON.parse(line);

              if (json.response) {
                const clean = cleanResponse(json.response);
                fullResponse += (fullResponse ? "\n" : "") + clean;
                controller.enqueue(encoder.encode(clean));
              }

              if (json.done) {
                await prisma.messages.create({
                  data: {
                    text: fullResponse,
                    chatId,
                    owner: "ai",
                    loading: "succeeded",
                    model,
                  },
                });
                controller.close();
              }
            } catch (e) {
              console.error("JSON parse error", e, line);
            }
          }
        }
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
