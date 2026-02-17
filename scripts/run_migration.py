import subprocess
import sys
import os

os.chdir('/vercel/share/v0-project')

# Run Prisma migration
print("[v0] Running Prisma database migration...")
result = subprocess.run([sys.executable, '-m', 'pip', 'install', 'prisma'], capture_output=True)
print("[v0] Prisma install result:", result.returncode)

# Run the actual migration using npx
result = subprocess.run(['npx', 'prisma', 'migrate', 'deploy'], capture_output=True, text=True)
print("[v0] Migration stdout:", result.stdout)
print("[v0] Migration stderr:", result.stderr)
print("[v0] Migration result code:", result.returncode)

if result.returncode == 0:
    print("[v0] Migration completed successfully!")
else:
    print("[v0] Migration failed with return code:", result.returncode)
    sys.exit(1)
