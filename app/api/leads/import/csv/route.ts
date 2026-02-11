import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

export const dynamic = 'force-dynamic'

/**
 * POST /api/leads/import/csv
 * Import leads from CSV file
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Read file content
        const content = await file.text()

        // Parse CSV
        const parsed = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase(),
        })

        if (parsed.errors.length > 0) {
            return NextResponse.json({
                error: 'CSV parsing failed',
                details: parsed.errors
            }, { status: 400 })
        }

        const leads: any[] = parsed.data as any[]
        const importedLeads = []
        const errors = []

        // Process each lead
        for (let i = 0; i < leads.length; i++) {
            const row = leads[i]

            try {
                // Validate required fields
                if (!row.name || !row.email) {
                    errors.push({
                        row: i + 1,
                        error: 'Missing required fields (name, email)'
                    })
                    continue
                }

                // Check for duplicates
                const existing = await prisma.lead.findFirst({
                    where: {
                        userId: session.user.id,
                        email: row.email.trim()
                    }
                })

                if (existing) {
                    errors.push({
                        row: i + 1,
                        email: row.email,
                        error: 'Lead already exists'
                    })
                    continue
                }

                // Create lead
                const lead = await prisma.lead.create({
                    data: {
                        userId: session.user.id,
                        name: row.name.trim(),
                        email: row.email.trim(),
                        phone: row.phone?.trim() || null,
                        company: row.company?.trim() || null,
                        position: row.position?.trim() || null,
                        source: row.source?.trim() || 'CSV Import',
                        status: row.status?.trim() || 'new',
                        estimatedValue: row.value ? parseFloat(row.value) : null,
                        customFields: {
                            ...Object.keys(row)
                                .filter(k => !['name', 'email', 'phone', 'company', 'position', 'source', 'status', 'value'].includes(k))
                                .reduce((obj: any, key) => {
                                    obj[key] = row[key]
                                    return obj
                                }, {})
                        }
                    }
                })

                importedLeads.push(lead)
            } catch (error: any) {
                errors.push({
                    row: i + 1,
                    error: error.message
                })
            }
        }

        return NextResponse.json({
            success: true,
            imported: importedLeads.length,
            failed: errors.length,
            total: leads.length,
            errors: errors.length > 0 ? errors : undefined
        })
    } catch (error: any) {
        console.error('[CSV Import] Error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to import CSV'
        }, { status: 500 })
    }
}
