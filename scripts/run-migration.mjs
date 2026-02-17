import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('[Migration] Starting Prisma migration...');

const prisma = spawn('npx', ['prisma', 'migrate', 'deploy'], {
  cwd: dirname(__dirname),
  stdio: 'inherit'
});

prisma.on('close', (code) => {
  if (code === 0) {
    console.log('[Migration] Migration completed successfully!');
    process.exit(0);
  } else {
    console.error(`[Migration] Migration failed with code ${code}`);
    process.exit(1);
  }
});

prisma.on('error', (err) => {
  console.error('[Migration] Error running migration:', err);
  process.exit(1);
});
