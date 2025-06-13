
import { usePathname } from 'next/navigation';

/**
 * Hook for checking if a path section is currently active
 * 
 * @returns A function that checks if a given path is active
 */
export function useActiveSection() {
  const pathname = usePathname();

  return (key: string) => {
    // 检查路径是否以版块名称开头
    return pathname.startsWith(`/${key}`);
  };
}
