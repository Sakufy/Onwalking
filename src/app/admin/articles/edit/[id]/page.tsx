'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import DualPaneEditor from '@/components/editor/DualPaneEditor'
import { getAllArticles, updateArticle, type Article } from '@/data/articles'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadArticle()
  }, [articleId])

  const loadArticle = async () => {
    setIsLoading(true)
    try {
      const articles = await getAllArticles()
      const foundArticle = articles.find(a => a.id === articleId)
      setArticle(foundArticle || null)
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data: { title: string; content: string; category: string; changeNote: string }) => {
    if (!article) return

    const updatedArticle = await updateArticle(article.id, data)
    
    if (updatedArticle) {
      router.push('/admin/articles')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!article) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">文章不存在</p>
          <button
            onClick={() => router.push('/admin/articles')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            返回文章列表
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DualPaneEditor
          initialContent={article.content}
          initialTitle={article.title}
          initialCategory={article.category}
          onSave={handleSave}
          onCancel={handleCancel}
          isNew={false}
        />
      </div>
    </AdminLayout>
  )
}