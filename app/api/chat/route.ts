import { NextRequest, NextResponse } from "next/server";
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
    const { prompt, model } = body;
    if (!prompt) {
      return NextResponse.json({
        error: true,
        message: "User prompt is missing",
      });
    }
    const ollamaPayload = {
      model,
      prompt,
      stream: false,
    };

    const ollamaRes = await fetch(`${LLM_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ollamaPayload),
    });

    if (!ollamaRes.ok) {
      const error = await ollamaRes.text();
      throw new Error(`[OLLAMA_FETCH_GENERATE] Server Error: ${error}`);
    }

    const result = await ollamaRes.json();

    return NextResponse.json(result);
  } catch (e) {
    console.error(
      NextResponse.json(
        {
          message: e,
        },
        { status: 500 }
      )
    );
    return NextResponse.json(
      {
        message: e,
      },
      { status: 500 }
    );
  }
}
