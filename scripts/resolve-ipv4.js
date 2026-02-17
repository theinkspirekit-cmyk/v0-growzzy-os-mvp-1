
const dns = require('dns');

const hostname = "db.zezdnybwtajdvqpxgcid.supabase.co";

console.log(`Resolving IPv4 for ${hostname}...`);
dns.resolve4(hostname, (err, addresses) => {
    if (err) {
        console.error("IPv4 Lookup failed:", err.code);
        // Try fallback to lookup with family 4
        dns.lookup(hostname, { family: 4 }, (err2, address) => {
            if (err2) {
                console.error("DNS Lookup (family: 4) failed:", err2.code);
            } else {
                console.log("IPv4 Address found via lookup:", address);
            }
        });
    } else {
        console.log("IPv4 Addresses:", addresses);
    }
});
