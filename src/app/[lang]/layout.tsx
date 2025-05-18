import { ReactNode } from 'react';

export default function LangLayout({ 
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <div className="lang-layout" lang={params.lang === 'zh' ? 'zh-Hans' : 'en'}>
      {children}
    </div>
  );
}