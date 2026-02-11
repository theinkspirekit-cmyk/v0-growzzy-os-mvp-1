import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

/**
 * POST /api/leads/import/excel
 * Import leads from Excel file (.xlsx, .xls)
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

        // Read file as buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Parse Excel
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const leads: any[] = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: ''
        })

        if (leads.length === 0) {
            return NextResponse.json({
                error: 'No data found in Excel file'
            }, { status: 400 })
        }

        const importedLeads = []
        const errors = []

        // Normalize column names (handle various casings)
        const normalizeKey = (key: string) => key.toLowerCase().trim()

        // Process each lead
        for (let i = 0; i < leads.length; i++) {
            const row: any = {}

            // Normalize all keys
            Object.keys(leads[i]).forEach(key => {
                row[normalizeKey(key)] = leads[i][key]
            })

            try {
                // Validate required fields
                if (!row.name || !row.email) {
                    errors.push({
                        row: i + 2, // +2 because Excel is 1-indexed and has header row
                        error: 'Missing required fields (Name, Email)'
                    })
                    continue
                }

                // Check for duplicates
                const existing = await prisma.lead.findFirst({
                    where: {
                        userId: session.user.id,
                        email: String(row.email).trim()
                    }
                })

                if (existing) {
                    errors.push({
                        row: i + 2,
                        email: row.email,
                        error: 'Lead already exists'
                    })
                    continue
                }

                // Create lead
                const lead = await prisma.lead.create({
                    data: {
                        user Id: session.user.id,
                        name: String(row.name).trim(),
                        email: String(row.email).trim(),
                        phone: row.phone ? String(row.phone).trim() : null,
                        company: row.company ? String(row.company).trim() : null,
                        position: row.position ? String(row.position).trim() : null,
                        source: row.source ? String(row.source).trim() : 'Excel Import',
                        status: row.status ? String(row.status).trim() : 'new',
                        estimatedValue: row.value ? parseFloat(String(row.value)) : null,
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
                    row: i + 2,
                    error: error.message
                })
            }
        }

        return NextResponse.json({
            success: true,
            imported: importedLeads.length,
            failed: errors.length,
            total: leads.length,
            errors: errors.length > 0 ? errors.slice(0, 10) : undefined // Limit error details
        })
    } catch (error: any) {
        console.error('[Excel Import] Error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to import Excel file'
        }, { status: 500 })
    }
}
