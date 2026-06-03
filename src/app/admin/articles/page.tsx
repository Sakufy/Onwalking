'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { getAllArticles, deleteArticle, type Article } from '@/data/articles'

export default function AdminArticles() {
  const [articleList, setArticleList] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const articles = await getAllArticles()
      setArticleList(articles)
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredArticles = articleList.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || article.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">已发布</span>
    }
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">草稿</span>
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      '自我探索': 'bg-blue-100 text-blue-800',
      '自我提升': 'bg-green-100 text-green-800',
      '自我实现': 'bg-purple-100 text-purple-800',
    }
    return <span className={`px-2 py-1 text-xs font-medium ${colors[category] || 'bg-gray-100 text-gray-800'} rounded`}>{category}</span>
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      const success = await deleteArticle(id)
      if (success) {
        await loadArticles()
      }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理您的所有文章</p>
          </div>
          <Link href="/admin/articles/new" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            新建文章
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">全部状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-4">加载中...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">标题</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">分类</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">阅读时间</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">发布时间</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">状态</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{article.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getCategoryBadge(article.category)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{article.readingTime} 分钟</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{article.publishedAt}</td>
                      <td className="px-6 py-4">{getStatusBadge(article.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/articles/edit/${article.id}`} className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1">编辑</Link>
                          <button className="text-sm text-red-600 hover:text-red-700 px-2 py-1" onClick={() => handleDelete(article.id)}>删除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredArticles.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">没有找到匹配的文章</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}