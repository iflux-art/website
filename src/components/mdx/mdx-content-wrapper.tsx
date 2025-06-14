
'use client';

import React, { useEffect, useRef } from 'react';

interface MdxContentWrapperProps {
  html: string;
}

export function MdxContentWrapper({ html }: MdxContentWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = html;
    }
  }, [html]);

  return <div ref={contentRef} />;
}

export default MdxContentWrapper;
