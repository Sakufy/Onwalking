'use client';

import ArticleRenderer from '../article/ArticleRenderer';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return <ArticleRenderer content={content} />;
}

export function ArticleContentStyles() {
  return null;
}