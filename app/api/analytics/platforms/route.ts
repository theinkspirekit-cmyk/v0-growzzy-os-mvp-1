import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        // 1. Check Session
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id

        // 2. MOCK DATA BYPASS
        if (userId === "mock-admin-id" || session.user.email === "admin@growzzy.com") {
            return NextResponse.json({
                platforms: [
                    { name: 'Meta', spend: 20000, revenue: 65000, roas: 3.25, change: 12.5 },
                    { name: 'Google', spend: 15000, revenue: 45000, roas: 3.0, change: -2.4 },
                    { name: 'LinkedIn', spend: 7300, revenue: 18450, roas: 2.52, change: 5.1 },
                ]
            });
        }

        // 3. Real Logic (simplified)
        return NextResponse.json({
            platforms: []
        });

    } catch (error: any) {
        console.error('Platform analytics error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
