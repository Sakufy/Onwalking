'use client'

import { useState, useEffect } from 'react'
import { Session } from 'next-auth'
import Link from 'next/link'
import { getCommentsByArticleId, addComment, addReply, type Comment } from '@/data/comments'

interface CommentsSectionProps {
  articleId: string
  session: Session | null
}

function CommentCard({
  comment,
  allComments,
  session,
  onReply,
  depth = 0,
}: {
  comment: Comment
  allComments: Comment[]
  session: Session | null
  onReply: (parentId: string, text: string) => void
  depth?: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const children = allComments.filter(c => c.parentId === comment.id)

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !session) return

    setIsSubmitting(true)
    try {
      await onReply(comment.id, replyText.trim())
      setReplyText('')
      setIsReplying(false)
    } catch (error) {
      console.error('回复失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasChildren = children.length > 0

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all ${
        comment.isHighValue ? 'border-yellow-300' : 'border-gray-200'
      } ${depth > 0 ? 'ml-8 md:ml-12' : ''}`}
      style={{
        marginLeft: depth > 0 ? `${depth * 32}px` : '0',
      }}
    >
      {depth > 0 && (
        <div className="absolute -left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
      )}

      <div
        className={`p-6 cursor-pointer ${hasChildren ? 'hover:shadow-md' : ''}`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium">{comment.author[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-900">{comment.author}</span>
                {comment.isHighValue && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    优质想法
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">{comment.createdAt}</span>
            </div>
          </div>

          {hasChildren && (
            <button
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              <svg
                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>

        <p className="mt-4 text-gray-700 leading-relaxed">{comment.text}</p>

        {comment.creatorReply && (
          <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-xs">创</span>
              </div>
              <span className="font-medium text-blue-900 text-sm">创作者回复</span>
            </div>
            <p className="text-blue-800 text-sm">{comment.creatorReply}</p>
          </div>
        )}

        {depth < 1 && (
          <div className="mt-4 flex items-center gap-4 text-sm">
            <button
              className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation()
                setIsReplying(!isReplying)
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              回复
            </button>
            <span className="text-gray-400">
              {hasChildren && `${children.length} 条回应`}
            </span>
          </div>
        )}
      </div>

      {isReplying && session && (
        <div className="px-6 pb-6">
          <form onSubmit={handleReply} className="mt-4 p-4 bg-gray-50 rounded-xl">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="写下你的回复..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">{replyText.length} 字</span>
              <button
                type="submit"
                disabled={!replyText.trim() || isSubmitting}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '发送中...' : '发送'}
              </button>
            </div>
          </form>
        </div>
      )}

      {hasChildren && isExpanded && (
        <div className="border-t border-gray-100">
          <div className="pt-4 space-y-4 pl-6">
            {children.map((child) => (
              <CommentCard
                key={child.id}
                comment={child}
                allComments={allComments}
                session={session}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CommentsSection({
  articleId,
  session,
}: CommentsSectionProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentsList, setCommentsList] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const approvedComments = await getCommentsByArticleId(articleId)
      setCommentsList(approvedComments)
    } catch (error) {
      console.error('加载评论失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [articleId])

  const handleRefresh = async () => {
    await loadComments()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !session) return

    setIsSubmitting(true)
    try {
      const newComment = await addComment({
        articleId,
        author: (session.user as any)?.name || '匿名用户',
        authorId: (session.user as any)?.id || 'unknown',
        text: text.trim(),
      })
      setText('')
      if (newComment.status === 'approved') {
        await loadComments()
      } else {
        alert('评论已提交，等待审核通过后显示')
        setText('')
      }
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId: string, text: string) => {
    const newReply = await addReply(parentId, {
      articleId,
      author: (session?.user as any)?.name || '匿名用户',
      authorId: (session?.user as any)?.id || 'unknown',
      text,
    })
    if (newReply) {
      await loadComments()
    }
  }

  const allComments = commentsList

  return (
    <div className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          讨论
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {commentsList.length} 条想法
          </span>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="刷新评论"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">加载中...</p>
        </div>
      ) : (
        <>
          {!session ? (
            <div className="mb-12 p-8 bg-white rounded-2xl border border-gray-200 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">💭</span>
                </div>
                <p className="text-gray-700 mb-2 text-lg">登录后写下你的想法</p>
                <p className="text-gray-500 text-sm">与创作者和其他读者一起交流</p>
              </div>
              <div className="flex justify-center gap-4">
                <Link
                  href="/auth/login"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  注册
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mb-12 bg-white rounded-2xl p-6 border border-gray-200">
              <div className="mb-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="分享你的想法..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  rows={4}
                />
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${text.length >= 200 ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {text.length} 字
                  {text.length >= 200 ? ' · 自动通过审核' : ' · 200字自动通过审核'}
                </span>
                <button
                  type="submit"
                  disabled={!text.trim() || isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? '发布中...' : '发布想法'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-6">
            {commentsList.length > 0 ? (
              commentsList.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  allComments={allComments}
                  session={session}
                  onReply={handleReply}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-gray-400 text-4xl">💭</span>
                </div>
                <p className="text-gray-600 text-lg mb-2">还没有想法</p>
                <p className="text-gray-500 text-sm">来做第一个分享想法的人吧</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}