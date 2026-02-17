
export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Fetch some context if needed (e.g. active campaigns)
    const activeCampaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id, status: 'active' },
      take: 5
    });

    const context = activeCampaigns.length > 0
      ? `User's active campaigns: ${activeCampaigns.map(c => `${c.name} (${c.roas}x ROAS)`).join(', ')}`
      : "User has no active campaigns at the moment.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for GrowzzyOS, a marketing automation platform. 
          Your role is to assist users with their marketing campaigns, ad creatives, and analytics.
          Be concise, professional, and helpful. If you don't know something, say so.
          
          Current Context:
          ${context}
          
          Format your responses in clear, readable markdown.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({
      response: aiResponse
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
