'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import SearchBar from '@/components/common/SearchBar'
import { getAllArticles, getCategories, type Article } from '@/data/articles'
import { getArticlePreview } from '@/lib/content-utils'

const categoryColors: Record<string, string> = {
  '自我探索': 'bg-blue-100 text-blue-800',
  '自我提升': 'bg-green-100 text-green-800',
  '自我实现': 'bg-purple-100 text-purple-800',
}

export default function ArticlesPage() {
  const [visibleCount, setVisibleCount] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const data = await getAllArticles()
      setArticles(data)
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const showMoreArticles = () => {
    setVisibleCount(prev => prev + 5)
  }

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles
    const query = searchQuery.toLowerCase()
    return articles.filter(
      article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
    )
  }, [searchQuery, articles])

  const displayedArticles = filteredArticles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredArticles.length

  const categories = getCategories()

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">文章</h1>
          <p className="text-lg text-gray-600">记录思考与实践，陪伴每一位独行的追路人</p>
        </header>

        <div className="mb-8">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="搜索文章标题、内容或分类..."
            className="max-w-xl"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/articles"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            全部
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/articles/${encodeURIComponent(category)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-colors ${categoryColors[category] || 'bg-gray-200 text-gray-700'}`}
            >
              {category}
            </Link>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {displayedArticles.map((article) => (
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
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

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={showMoreArticles}
                  className="px-8 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  加载更多
                </button>
              </div>
            )}

            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600">没有找到匹配的文章</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}