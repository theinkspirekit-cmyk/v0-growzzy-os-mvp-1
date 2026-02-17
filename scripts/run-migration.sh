#!/bin/bash
set -e

echo "Running Prisma migration..."
cd "$(dirname "$0")/.."
npx prisma migrate deploy
echo "Migration completed successfully!"
