import { NextResponse } from "next/server";
import { getBestProviderForChat, getDemoMode } from "@/lib/providers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message : "";

    if (!message.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide a message to send to Oros."
        },
        { status: 400 }
      );
    }

    if (getDemoMode()) {
      return NextResponse.json({
        ok: true,
        demo: true,
        provider: "demo",
        response:
          "Demo mode is active because no provider API keys are configured. Add OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY in Vercel to enable a live model."
      });
    }

    const provider = getBestProviderForChat(message);
    const output = await provider.generate([
      {
        role: "user",
        content: message
      }
    ]);

    return NextResponse.json({
      ok: true,
      demo: false,
      provider: provider.id,
      response: output
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        error: `The request failed on the server: ${message}`
      },
      { status: 500 }
    );
  }
}
