import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // 获取当前分支
    const { stdout: currentBranch } = await execAsync('git branch --show-current');
    
    // 切换到主分支
    await execAsync('git checkout main');
    
    // 获取新的分支
    const { stdout: newBranch } = await execAsync('git branch --show-current');
    
    return NextResponse.json({
      success: true,
      currentBranch: currentBranch.trim(),
      newBranch: newBranch.trim()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
