'use client';

import { useSearchParams } from 'next/navigation';
import { Grid, List } from 'lucide-react';
import { NavButton } from '@/components/common/button/nav-button';

export default function DocNav() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'grid';

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <NavButton
        href="/docs?view=grid"
        icon={Grid}
        variant={view === 'grid' ? 'default' : 'secondary'}
        active={view === 'grid'}
      >
        网格视图
      </NavButton>
      <NavButton
        href="/docs?view=list"
        icon={List}
        variant={view === 'list' ? 'default' : 'secondary'}
        active={view === 'list'}
      >
        列表视图
      </NavButton>
    </div>
  );
}
