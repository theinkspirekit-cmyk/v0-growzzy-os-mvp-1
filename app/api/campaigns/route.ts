import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      console.error('[v0] Campaigns API: userId required');
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    console.log('[v0] Fetching campaigns for user:', userId);

    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('revenue', { ascending: false });

    if (error) {
      console.error('[v0] Campaigns fetch error:', error);
      throw error;
    }

    console.log('[v0] Campaigns fetched:', data?.length || 0);

    return NextResponse.json({ campaigns: data || [] });
  } catch (error: any) {
    console.error('[v0] Campaigns API error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const { name, platform, budget } = await req.json();

    if (!name || !platform) {
      return NextResponse.json(
        { error: 'name and platform required' },
        { status: 400 }
      );
    }

    console.log('[v0] Creating campaign:', name, 'on platform:', platform);

    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        name,
        platform,
        budget: budget || 0,
        spend: 0,
        revenue: 0,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('[v0] Campaign creation error:', error);
      throw error;
    }

    console.log('[v0] Campaign created:', data.id);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[v0] Campaign POST error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
