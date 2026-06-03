'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { getAllComments, updateCommentStatus, setCreatorReply, type Comment } from '@/data/comments'
import { articles } from '@/data/articles'

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    loadComments()
  }, [])

  const filteredComments = comments.filter(comment => {
    if (filterStatus === 'all') return true
    return comment.status === filterStatus
  })

  const handleApprove = async (id: string) => {
    const success = await updateCommentStatus(id, 'approved')
    if (success) {
      await loadComments()
    }
  }

  const handleReject = async (id: string) => {
    const success = await updateCommentStatus(id, 'rejected')
    if (success) {
      await loadComments()
    }
  }

  const handleRestore = async (id: string) => {
    const success = await updateCommentStatus(id, 'pending')
    if (success) {
      await loadComments()
    }
  }

  const handleAddReply = async (id: string) => {
    const reply = prompt('请输入创作者回复：')
    if (reply) {
      const success = await setCreatorReply(id, reply)
      if (success) {
        await loadComments()
      }
    }
  }

  const getArticleTitle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId)
    return article?.title || '未知文章'
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '待审核' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: '已通过' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: '已拒绝' },
    }
    const b = badges[status] || badges.pending
    return (
      <span className={`px-2 py-1 text-xs font-medium ${b.bg} ${b.text} rounded`}>
        {b.label}
      </span>
    )
  }

  const stats = {
    total: comments.length,
    pending: comments.filter(c => c.status === 'pending').length,
    approved: comments.filter(c => c.status === 'approved').length,
    rejected: comments.filter(c => c.status === 'rejected').length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">评论审核</h1>
            <p className="text-sm text-gray-500 mt-1">管理和审核用户评论</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">总评论数</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">待审核</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">已通过</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">已拒绝</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  全部 ({stats.total})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  待审核 ({stats.pending})
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  已通过 ({stats.approved})
                </button>
                <button
                  onClick={() => setFilterStatus('rejected')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  已拒绝 ({stats.rejected})
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-4">加载中...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">{comment.author.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        {comment.isHighValue && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">高价值</span>
                        )}
                        {getStatusBadge(comment.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        文章：{getArticleTitle(comment.articleId)}
                      </p>
                      <p className="text-gray-700 mt-2">{comment.text}</p>
                      {comment.creatorReply && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-600 font-medium">创作者回复：</p>
                          <p className="text-blue-800 text-sm mt-1">{comment.creatorReply}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{comment.createdAt}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {comment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => handleReject(comment.id)}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            拒绝
                          </button>
                        </>
                      )}
                      {comment.status === 'approved' && (
                        <>
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            回复
                          </button>
                          <button
                            onClick={() => handleRestore(comment.id)}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            设为待审
                          </button>
                        </>
                      )}
                      {comment.status === 'rejected' && (
                        <button
                          onClick={() => handleRestore(comment.id)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          恢复
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredComments.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">没有找到匹配的评论</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}