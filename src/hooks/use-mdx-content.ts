import { useState } from 'react';

interface UseMDXContentOptions {
  initialContent?: string;
}

export function useMDXContent(options: UseMDXContentOptions = {}) {
  const { initialContent = '' } = options;
  const [content, setContent] = useState(initialContent);

  const updateContent = (newContent: string) => {
    setContent(newContent);
  };

  return {
    content,
    updateContent,
  };
}

export default useMDXContent;
