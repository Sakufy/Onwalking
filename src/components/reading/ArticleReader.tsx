'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ArticleContent, { ArticleContentStyles } from './ArticleContent'
import CommentsSection from './CommentsSection'
import VersionTimeline from './VersionTimeline'
import VersionCompare from './VersionCompare'
import type { ArticleVersion } from '@/data/articles'

interface Article {
  id: string
  title: string
  category: string
  publishedAt: string
  readingTime: number
  content: string
  versions?: ArticleVersion[]
}

interface ArticleReaderProps {
  article: Article
}

export default function ArticleReader({ article }: ArticleReaderProps) {
  const { data: session } = useSession()

  const [currentContent, setCurrentContent] = useState(article.content)
  const [currentVersion, setCurrentVersion] = useState(article.versions?.length || 1)
  const [showCompare, setShowCompare] = useState(false)

  const handleVersionSelect = (version: ArticleVersion) => {
    setCurrentContent(version.content)
    setCurrentVersion(version.version)
    setShowCompare(false)
  }

  const versions = article.versions || []

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <ArticleContentStyles />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <header className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 font-medium rounded-lg">
              {article.category}
            </span>
            <time>{article.publishedAt}</time>
            <span>{article.readingTime} 分钟阅读</span>
            {versions.length > 0 && (
              <span className="text-blue-600">版本 v{currentVersion}</span>
            )}
          </div>
        </header>

        <ArticleContent content={currentContent} />

        {versions.length > 0 && (
          <>
            {!showCompare ? (
              <VersionTimeline
                versions={versions}
                currentVersion={currentVersion}
                onSelectVersion={handleVersionSelect}
              />
            ) : (
              <VersionCompare
                versions={versions}
                onClose={() => setShowCompare(false)}
              />
            )}

            <div className="hidden lg:flex justify-center mt-4">
              <button
                onClick={() => setShowCompare(!showCompare)}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {showCompare ? '返回版本时间轴' : '版本对比'}
              </button>
            </div>
          </>
        )}

        <CommentsSection
          articleId={article.id}
          session={session}
        />

        <Link
          href="/about"
          className="block mt-16 bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">关于作者</h3>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-gray-600 leading-relaxed">
            我是路北行，一个走过自学高考、转专业、持续探索的成长实践者。
            这里分享我的思考、方法与成长历程。
          </p>
        </Link>
      </div>
    </div>
  )
}
