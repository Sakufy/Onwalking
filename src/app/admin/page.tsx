'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { articles } from '@/data/articles'
import { getAllComments, type Comment } from '@/data/comments'

export default function AdminDashboard() {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const allComments = await getAllComments()
      setComments(allComments)
    } catch (error) {
      console.error('加载评论失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    totalArticles: articles.length,
    totalComments: comments.length,
    pendingComments: comments.filter(c => c.status === 'pending').length,
    totalReads: 1234,
  }

  const recentArticles = articles.slice(0, 3).map(article => ({
    id: article.id,
    title: article.title,
    category: article.category,
    publishedAt: article.publishedAt,
    status: article.status,
  }))

  const pendingCommentsList = comments.filter(c => c.status === 'pending').slice(0, 3)

  const getStatusBadge = (status: string) => {
    const badges = {
      published: { bg: 'bg-green-100', text: 'text-green-800', label: '已发布' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: '草稿' },
    }
    const b = badges[status as keyof typeof badges] || badges.draft
    return (
      <span className={`px-2 py-0.5 text-xs font-medium ${b.bg} ${b.text} rounded`}>
        {b.label}
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总文章数</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalArticles}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总评论数</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalComments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待审核评论</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.pendingComments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总阅读量</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalReads.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">最近文章</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentArticles.map((article) => (
                <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{article.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{article.category} · {article.publishedAt}</p>
                    </div>
                    {getStatusBadge(article.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <Link href="/admin/articles" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                查看全部文章 →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">待审核评论</h2>
              <p className="text-sm text-gray-500 mt-1">有 {pendingCommentsList.length} 条评论待审核</p>
            </div>
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : pendingCommentsList.length > 0 ? (
                pendingCommentsList.map((comment) => (
                  <div key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <p className="text-sm text-gray-700 line-clamp-2">{comment.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {comment.author} · 文章ID: {comment.articleId}
                      </span>
                      <span className="text-xs text-gray-400">{comment.createdAt}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">暂无待审核评论</div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <Link href="/admin/comments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                审核评论 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}