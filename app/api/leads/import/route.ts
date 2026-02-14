import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parse } from 'papaparse'

export const dynamic = 'force-dynamic'

/**
 * POST /api/leads/import
 * Handles CSV/XLSX file import with preview and mapping support
 *
 * Step 1: action='preview' — parse file and return headers + sample rows
 * Step 2: action='execute' — import with field mapping
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const body = await request.json()
        const { action, csvData, mapping, rows } = body

        if (!csvData && !rows) {
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'CSV data is required' } }, { status: 400 })
        }

        // ---- Step 1: Preview (parse and return headers + sample) ----
        if (action === 'preview') {
            const parseResult = parse(csvData, {
                header: true,
                skipEmptyLines: true,
                preview: 10, // Only parse first 10 rows for preview
            })

            if (parseResult.errors.length > 0 && parseResult.data.length === 0) {
                return NextResponse.json({
                    ok: false,
                    error: { code: 'PARSE_ERROR', message: 'Invalid CSV format', details: parseResult.errors },
                }, { status: 400 })
            }

            const headers = parseResult.meta.fields || []
            const sampleRows = parseResult.data.slice(0, 5)

            // Auto-detect mapping based on common header names
            const suggestedMapping = autoDetectMapping(headers)

            return NextResponse.json({
                ok: true,
                data: {
                    headers,
                    sampleRows,
                    totalRows: parseResult.data.length,
                    suggestedMapping,
                    warnings: parseResult.errors.length > 0
                        ? parseResult.errors.map((e: any) => `Row ${e.row}: ${e.message}`)
                        : [],
                },
            })
        }

        // ---- Step 2: Execute import with mapping ----
        if (action === 'execute') {
            const parseResult = parse(csvData, {
                header: true,
                skipEmptyLines: true,
            })

            const allRows = rows || parseResult.data
            const fieldMapping = mapping || autoDetectMapping(parseResult.meta.fields || [])

            const results = {
                total: allRows.length,
                imported: 0,
                skipped: 0,
                errors: [] as { row: number; reason: string }[],
            }

            // Batch insert with transaction
            const leadsToCreate: any[] = []

            for (let i = 0; i < allRows.length; i++) {
                const row = allRows[i] as Record<string, string>

                const name = row[fieldMapping.name] || ''
                const email = row[fieldMapping.email] || ''

                if (!name && !email) {
                    results.skipped++
                    results.errors.push({ row: i + 1, reason: 'Missing name and email' })
                    continue
                }

                leadsToCreate.push({
                    userId: session.user.id,
                    name: name || 'Unknown',
                    email: email || '',
                    phone: row[fieldMapping.phone] || null,
                    company: row[fieldMapping.company] || null,
                    position: row[fieldMapping.position] || null,
                    source: row[fieldMapping.source] || 'Import',
                    estimatedValue: row[fieldMapping.value] ? parseFloat(row[fieldMapping.value].replace(/[$,]/g, '')) : null,
                    status: 'new',
                })
            }

            // Use createMany for performance
            if (leadsToCreate.length > 0) {
                const created = await prisma.lead.createMany({
                    data: leadsToCreate,
                    skipDuplicates: true,
                })
                results.imported = created.count
            }

            return NextResponse.json({
                ok: true,
                data: {
                    results,
                    message: `Successfully imported ${results.imported} of ${results.total} leads. ${results.skipped} skipped.`,
                },
            })
        }

        return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Invalid action. Use "preview" or "execute".' } }, { status: 400 })
    } catch (error: any) {
        console.error('[Leads Import] Error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}

/**
 * Auto-detect field mapping from common CSV header names
 */
function autoDetectMapping(headers: string[]): Record<string, string> {
    const mapping: Record<string, string> = {
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        source: '',
        value: '',
    }

    const lowerHeaders = headers.map(h => h.toLowerCase().trim())

    for (let i = 0; i < headers.length; i++) {
        const h = lowerHeaders[i]
        if (!mapping.name && (h.includes('name') || h.includes('full_name') || h.includes('contact'))) {
            mapping.name = headers[i]
        }
        if (!mapping.email && (h.includes('email') || h.includes('e-mail') || h.includes('mail'))) {
            mapping.email = headers[i]
        }
        if (!mapping.phone && (h.includes('phone') || h.includes('tel') || h.includes('mobile'))) {
            mapping.phone = headers[i]
        }
        if (!mapping.company && (h.includes('company') || h.includes('organization') || h.includes('org') || h.includes('business'))) {
            mapping.company = headers[i]
        }
        if (!mapping.position && (h.includes('position') || h.includes('title') || h.includes('role') || h.includes('job'))) {
            mapping.position = headers[i]
        }
        if (!mapping.source && (h.includes('source') || h.includes('channel') || h.includes('origin'))) {
            mapping.source = headers[i]
        }
        if (!mapping.value && (h.includes('value') || h.includes('revenue') || h.includes('deal') || h.includes('amount'))) {
            mapping.value = headers[i]
        }
    }

    return mapping
}
