'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllArticles, getCategories, type Article } from '@/data/articles'
import { getArticlePreview } from '@/lib/content-utils'

const categoryData: Record<string, {
  title: string
  description: string
  icon: 'search' | 'growth' | 'target'
  color: string
  bgColor: string
}> = {
  '自我探索': {
    title: '自我探索',
    description: '聚焦世界观、价值观、人生观与内心思考，记录向内探寻的全过程，解读北行理念与精神内核。',
    icon: 'search',
    color: 'blue',
    bgColor: 'bg-blue-100'
  },
  '自我提升': {
    title: '自我提升',
    description: '分享体系化学习方法、能量管理，心态调节与成长技巧，拆解可落地的实战经验。',
    icon: 'growth',
    color: 'green',
    bgColor: 'bg-green-100'
  },
  '自我实现': {
    title: '自我实现',
    description: '记录价值输出、付费咨询、同行计划与产品开发实践，分享从能力到价值的落地路径。',
    icon: 'target',
    color: 'purple',
    bgColor: 'bg-purple-100'
  }
}

const categoryColors: Record<string, string> = {
  '自我探索': 'bg-blue-100 text-blue-800',
  '自我提升': 'bg-green-100 text-green-800',
  '自我实现': 'bg-purple-100 text-purple-800',
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const [category, setCategory] = useState<string>('')
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params
      const decodedCategory = decodeURIComponent(resolvedParams.category)
      setCategory(decodedCategory)
      
      setIsLoading(true)
      try {
        const allArticles = await getAllArticles()
        setArticles(allArticles)
      } catch (error) {
        console.error('加载文章失败:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [params])

  const decodedCategory = decodeURIComponent(category)
  const categoryInfo = categoryData[decodedCategory]
  
  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">分类不存在</h1>
          <p className="text-gray-600 mb-4">您访问的分类：{decodedCategory}</p>
          <Link href="/articles" className="text-blue-600 hover:text-blue-700">
            返回文章列表
          </Link>
        </div>
      </div>
    )
  }

  const categoryArticles = articles.filter(article => article.category === decodedCategory)
  const otherCategories = getCategories().filter(cat => cat !== decodedCategory)

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className={`inline-block px-4 py-2 ${categoryInfo.bgColor} rounded-full mb-4`}>
            <span className={`text-sm font-medium text-${categoryInfo.color}-800`}>
              {categoryInfo.title}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryInfo.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl">{categoryInfo.description}</p>
        </header>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-12">
              {categoryArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${encodeURIComponent(article.slug)}`}
                  className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {getArticlePreview(article.content, 150)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[article.category]}`}>
                          {article.category}
                        </span>
                        <span>{article.readingTime} 分钟阅读</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            {otherCategories.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">查看其他分类</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherCategories.map((cat) => {
                    const info = categoryData[cat]
                    return (
                      <Link
                        key={cat}
                        href={`/articles/${encodeURIComponent(cat)}`}
                        className={`block p-6 ${info?.bgColor || 'bg-gray-100'} rounded-xl hover:opacity-80 transition-opacity`}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{info?.title}</h3>
                        <p className="text-gray-600 text-sm">{info?.description}</p>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}