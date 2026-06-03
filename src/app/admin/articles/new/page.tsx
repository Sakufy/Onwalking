'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import DualPaneEditor from '@/components/editor/DualPaneEditor'
import { useRouter } from 'next/navigation'
import { articles, addArticle } from '@/data/articles'

export default function NewArticlePage() {
  const router = useRouter()

  const handleSave = async (data: { title: string; content: string; category: string; changeNote: string }) => {
    const newArticle = await addArticle({
      title: data.title,
      content: data.content,
      category: data.category,
      changeNote: data.changeNote,
    })
    
    if (newArticle) {
      router.push('/admin/articles')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DualPaneEditor
          isNew={true}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </AdminLayout>
  )
}