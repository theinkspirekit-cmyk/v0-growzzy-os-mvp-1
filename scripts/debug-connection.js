
const { PrismaClient } = require('@prisma/client');
const dns = require('dns');

// 1. configuration to test
const connectionString = "postgresql://postgres:dheekshit.2011@db.zezdnybwtajdvqpxgcid.supabase.co:5432/postgres?connect_timeout=20";

async function resolveHostname(hostname) {
    return new Promise((resolve) => {
        console.log(`\nResolving ${hostname}...`);
        dns.lookup(hostname, { all: true }, (err, addresses) => {
            if (err) {
                console.error("DNS Lookup failed:", err);
                resolve([]);
            } else {
                console.log("DNS Addresses:", addresses);
                resolve(addresses);
            }
        });
    });
}

async function testConnection() {
    console.log("Testing Prisma Connection...");
    console.log("URL:", connectionString.replace(/:([^:@]+)@/, ':****@'));

    // Extract hostname to debug DNS
    const hostname = "db.zezdnybwtajdvqpxgcid.supabase.co";
    await resolveHostname(hostname);

    const prisma = new PrismaClient({
        datasources: {
            db: { url: connectionString }
        },
        log: ['info', 'warn', 'error']
    });

    try {
        await prisma.$connect();
        console.log("✅ Prisma $connect() SUCCESS");
        const count = await prisma.user.count();
        console.log(`✅ Read Query Success. User count: ${count}`);
    } catch (e) {
        console.error("❌ Prisma Connection Failed:");
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
