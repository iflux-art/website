/**
 * 基准测试工具
 * 用于性能基准测试和比较
 */

// 基准测试结果类型
export interface BenchmarkResult {
  name: string;
  opsPerSec: number;
  averageTime: number;
  totalTime: number;
  iterations: number;
  marginOfError: number;
}

// 基准测试选项
export interface BenchmarkOptions {
  iterations?: number;
  minTime?: number;
  maxTime?: number;
  warmupIterations?: number;
}

/**
 * 基准测试类
 */
export class Benchmark {
  private results: Map<string, BenchmarkResult> = new Map();

  /**
   * 运行基准测试
   * @param name - 测试名称
   * @param fn - 要测试的函数
   * @param options - 测试选项
   */
  async run(
    name: string,
    fn: () => void | Promise<void>,
    options: BenchmarkOptions = {}
  ): Promise<BenchmarkResult> {
    const { iterations = 1000, minTime = 1000, maxTime = 5000, warmupIterations = 100 } = options;

    // 预热
    for (let i = 0; i < warmupIterations; i++) {
      await Promise.resolve(fn());
    }

    const times: number[] = [];
    const startTime = Date.now();
    let iterationCount = 0;
    let currentTime = Date.now();

    // 运行测试直到达到最小时间或最大迭代次数
    while (
      (currentTime - startTime < minTime || iterationCount < iterations) &&
      currentTime - startTime < maxTime
    ) {
      const iterationStart = performance.now();
      await Promise.resolve(fn());
      const iterationEnd = performance.now();

      times.push(iterationEnd - iterationStart);
      iterationCount++;

      // 每100次迭代检查一次时间
      if (iterationCount % 100 === 0) {
        currentTime = Date.now();
      }
    }

    // 计算统计信息
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / times.length;
    const opsPerSec = (times.length / totalTime) * 1000;

    // 计算标准差
    const variance = times.reduce((sum, time) => sum + (time - averageTime) ** 2, 0) / times.length;
    const standardDeviation = Math.sqrt(variance);
    const marginOfError = (standardDeviation / Math.sqrt(times.length)) * 1.96; // 95%置信区间

    const result: BenchmarkResult = {
      name,
      opsPerSec,
      averageTime,
      totalTime,
      iterations: times.length,
      marginOfError,
    };

    this.results.set(name, result);
    return result;
  }

  /**
   * 比较两个基准测试结果
   * @param name1 - 第一个测试名称
   * @param name2 - 第二个测试名称
   */
  compare(
    name1: string,
    name2: string
  ): {
    faster: string;
    slower: string;
    times: number;
    percent: number;
  } | null {
    const result1 = this.results.get(name1);
    const result2 = this.results.get(name2);

    if (!(result1 && result2)) {
      return null;
    }

    if (result1.averageTime < result2.averageTime) {
      const times = result2.averageTime / result1.averageTime;
      const percent = ((result2.averageTime - result1.averageTime) / result2.averageTime) * 100;
      return {
        faster: name1,
        slower: name2,
        times,
        percent,
      };
    } else {
      const times = result1.averageTime / result2.averageTime;
      const percent = ((result1.averageTime - result2.averageTime) / result1.averageTime) * 100;
      return {
        faster: name2,
        slower: name1,
        times,
        percent,
      };
    }
  }

  /**
   * 获取所有测试结果
   */
  getAllResults(): BenchmarkResult[] {
    return Array.from(this.results.values());
  }

  /**
   * 清除所有测试结果
   */
  clear(): void {
    this.results.clear();
  }

  /**
   * 打印测试结果
   */
  print(): void {
    console.log("\n=== Benchmark Results ===");
    this.results.forEach(result => {
      console.log(`\n${result.name}:`);
      console.log(`  Operations per second: ${result.opsPerSec.toFixed(2)}`);
      console.log(`  Average time: ${result.averageTime.toFixed(4)}ms`);
      console.log(`  Total time: ${result.totalTime.toFixed(2)}ms`);
      console.log(`  Iterations: ${result.iterations}`);
      console.log(`  Margin of error: ±${result.marginOfError.toFixed(4)}ms (95%)`);
    });
  }
}

/**
 * 简单的基准测试函数
 * @param name - 测试名称
 * @param fn - 要测试的函数
 * @param iterations - 迭代次数
 */
export async function runBenchmark(
  name: string,
  fn: () => void | Promise<void>,
  iterations = 1000
): Promise<BenchmarkResult> {
  const bench = new Benchmark();
  return await bench.run(name, fn, { iterations });
}

/**
 * 测量函数执行时间
 * @param fn - 要测量的函数
 * @param iterations - 迭代次数
 */
export async function measure<T>(
  fn: () => T | Promise<T>,
  iterations = 1
): Promise<{ result: T; time: number }> {
  const start = performance.now();
  let result: T;

  for (let i = 0; i < iterations; i++) {
    result = await Promise.resolve(fn());
  }

  const end = performance.now();
  const time = end - start;

  return { result: result!, time };
}

// 默认导出
export default Benchmark;
