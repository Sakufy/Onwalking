'use client'

import { useEffect, useRef } from 'react'

interface ArticleRendererProps {
  content: string
}

export default function ArticleRenderer({ content }: ArticleRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = content || '<p></p>'
    }
  }, [content])

  return (
    <article ref={containerRef} className="prose prose-lg max-w-none article-content" />
  )
}