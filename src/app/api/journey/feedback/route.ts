import { NextResponse } from "next/server";

/**
 * Journey Feedback API — Stub
 *
 * MVP: Acknowledges user feedback. In future iterations this will:
 * 1. Pass feedback + original journey to Claude for re-generation
 * 2. Store feedback in the database for journey refinement
 * 3. Return an updated journey with adjustments
 */

const ACKNOWLEDGMENTS = [
  "Got it — I've noted that. When we enable journey re-generation, this feedback will be used to adjust your map.",
  "Thanks for sharing that. This kind of detail makes the journey much more accurate. We'll incorporate it soon.",
  "Noted! Real-world context like this is exactly what makes CX mapping valuable. Stay tuned for journey updates.",
  "That's helpful context. Your feedback is saved and will inform the next version of your journey.",
  "Understood. Every company is different — your input helps us tailor the journey to how things actually work.",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Pick a contextual acknowledgment
    const reply = ACKNOWLEDGMENTS[Math.floor(Math.random() * ACKNOWLEDGMENTS.length)];

    return NextResponse.json({ reply, status: "acknowledged" });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
