'use client'

import { useState, useEffect } from 'react'
import ArticleReader from '@/components/reading/ArticleReader'
import { getAllArticles, type Article } from '@/data/articles'

interface Props {
  params: Promise<{ slug: string }>
}

export default function ArticlePage({ params }: Props) {
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      const resolvedParams = await params
      const slug = decodeURIComponent(resolvedParams.slug)
      
      setIsLoading(true)
      try {
        const articles = await getAllArticles()
        const foundArticle = articles.find(a => a.slug === slug)
        setArticle(foundArticle || null)
      } catch (error) {
        console.error('加载文章失败:', error)
        setArticle(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchArticle()
  }, [params])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcfa] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#fdfcfa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
          <p className="text-gray-600">抱歉，您访问的文章不存在或已被删除。</p>
        </div>
      </div>
    )
  }

  return <ArticleReader article={article} />
}