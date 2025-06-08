#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const OUTPUT_FILE = './lib/schema.d.ts';

async function generateTypes() {
  try {
    console.log('🔄 Generating TypeScript types from OpenAPI spec...');

    // Ensure the output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate types from the OpenAPI spec
    const command = `npx openapi-typescript ${BACKEND_URL}/api-yaml -o ${OUTPUT_FILE}`;

    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });

    console.log('✅ TypeScript types generated successfully!');
    console.log(`📄 Types saved to: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Error generating types:', error.message);
    process.exit(1);
  }
}

generateTypes();
