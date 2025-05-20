import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const nextDir = path.join(process.cwd(), '.next');
    const cacheDir = path.join(process.cwd(), 'node_modules/.cache');
    
    let results = {
      nextDir: {
        exists: fs.existsSync(nextDir),
        cleaned: false
      },
      cacheDir: {
        exists: fs.existsSync(cacheDir),
        cleaned: false
      }
    };
    
    // 清理 .next 目录
    if (results.nextDir.exists) {
      try {
        fs.rmSync(nextDir, { recursive: true, force: true });
        results.nextDir.cleaned = true;
      } catch (error) {
        console.error('Error cleaning .next directory:', error);
      }
    }
    
    // 清理 node_modules/.cache 目录
    if (results.cacheDir.exists) {
      try {
        fs.rmSync(cacheDir, { recursive: true, force: true });
        results.cacheDir.cleaned = true;
      } catch (error) {
        console.error('Error cleaning cache directory:', error);
      }
    }
    
    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
