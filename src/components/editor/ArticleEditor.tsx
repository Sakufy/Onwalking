'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useEffect, useState, useCallback } from 'react'

interface ArticleEditorProps {
  initialContent?: string
  initialTitle?: string
  initialCategory?: string
  onSave?: (data: { title: string; content: string; category: string; changeNote: string }) => void
  onCancel?: () => void
  isNew?: boolean
}

export default function ArticleEditor({
  initialContent = '',
  initialTitle = '',
  initialCategory = '',
  onSave,
  onCancel,
  isNew = false,
}: ArticleEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState(initialCategory)
  const [changeNote, setChangeNote] = useState('')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent || '<p>开始写作...</p>',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      localStorage.setItem('article-draft', JSON.stringify({
        title,
        content: editor.getHTML(),
        category,
        savedAt: new Date().toISOString(),
      }))
    },
  })

  const categories = ['自我探索', '自我提升', '自我实现']

  const handleAutoSave = useCallback(async () => {
    if (!editor || !title.trim()) return
    
    setIsAutoSaving(true)
    const draft = {
      title,
      content: editor.getHTML(),
      category,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem('article-draft', JSON.stringify(draft))
    setLastSaved(new Date())
    setIsAutoSaving(false)
  }, [editor, title, category])

  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000)
    return () => clearInterval(interval)
  }, [handleAutoSave])

  useEffect(() => {
    const draft = localStorage.getItem('article-draft')
    if (draft && isNew) {
      const savedDraft = JSON.parse(draft)
      if (window.confirm('检测到未保存的草稿，是否恢复？')) {
        setTitle(savedDraft.title || '')
        setCategory(savedDraft.category || '')
        editor?.commands.setContent(savedDraft.content || '<p>开始写作...</p>')
        setLastSaved(new Date(savedDraft.savedAt))
      }
    }
  }, [editor, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !editor) return

    const content = editor.getHTML()
    
    if (onSave) {
      onSave({ title, content, category, changeNote })
    }

    localStorage.removeItem('article-draft')
    setLastSaved(new Date())
  }

  const handleDiscardDraft = () => {
    if (window.confirm('确定要丢弃当前草稿吗？')) {
      localStorage.removeItem('article-draft')
      setTitle('')
      setCategory('')
      setChangeNote('')
      editor?.commands.setContent('<p>开始写作...</p>')
    }
  }

  if (!editor) {
    return <div className="flex items-center justify-center h-64">加载编辑器中...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isNew ? '新建文章' : '编辑文章'}
          </h2>
          {isNew && (
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              丢弃草稿
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              {isAutoSaving ? '自动保存中...' : `最后保存: ${lastSaved.toLocaleString('zh-CN')}`}
            </span>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          )}
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isNew ? '发布文章' : '发布新版本'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">文章标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入文章标题..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
          <div className="flex gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('bold') ? 'bg-gray-200' : ''
                }`}
                title="粗体"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 8c-.38 0-.7.28-.74.65l-.45 2.62c-.14.84-.82 1.39-1.62 1.39h-2.27v4.5c0 .45-.54.67-.85.35l-4.86-4.86a.5.5 0 010-.7l4.86-4.86a.5.5 0 01.85.35v3.47h1.74c.38 0 .7-.28.74-.65l.45-2.62c.14-.84.82-1.39 1.62-1.39h2.27c.89 0 1.62.73 1.62 1.62v.75H16.5V8zm-10.88 11.6a.75.75 0 01-.75-.75V17H6a.75.75 0 010-1.5h3.75V14a.75.75 0 011.5 0v1.5H12a.75.75 0 010 1.5H9.75v2.35a.75.75 0 01-.75.75z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('italic') ? 'bg-gray-200' : ''
                }`}
                title="斜体"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.5 4.5a.75.75 0 01.75-.75h8.5a.75.75 0 01.75.75v2a.75.75 0 01-.75.75h-6.5a.75.75 0 00-.67 1.02l-.5 1.5a.75.75 0 01-.75.5h-3a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75zm-5.25 4a.75.75 0 01.75-.75h11a.75.75 0 01.75.75v1a.75.75 0 01-.75.75h-11a.75.75 0 01-.75-.75v-1zm3.75 4.5a.75.75 0 01.75-.75h10a.75.75 0 01.75.75v1a.75.75 0 01-.75.75h-10a.75.75 0 01-.75-.75v-1zm-3.75 4a.75.75 0 01.75-.75h11a.75.75 0 01.75.75v1a.75.75 0 01-.75.75h-11a.75.75 0 01-.75-.75v-1z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('code') ? 'bg-gray-200' : ''
                }`}
                title="代码"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
                }`}
                title="标题1"
              >
                <span className="text-lg font-bold">H1</span>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
                }`}
                title="标题2"
              >
                <span className="text-base font-bold">H2</span>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
                }`}
                title="标题3"
              >
                <span className="text-sm font-bold">H3</span>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('bulletList') ? 'bg-gray-200' : ''
                }`}
                title="无序列表"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h16v2H4v-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('orderedList') ? 'bg-gray-200' : ''
                }`}
                title="有序列表"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('blockquote') ? 'bg-gray-200' : ''
                }`}
                title="引用"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleLink({ href: '#' }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('link') ? 'bg-gray-200' : ''
                }`}
                title="链接"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4">
            <EditorContent editor={editor} className="min-h-[400px] focus:outline-none" />
          </div>
        </div>

        {!isNew && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              版本变更说明
            </label>
            <textarea
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="描述本次更新的内容..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-2">
              变更说明将显示在文章版本历史中
            </p>
          </div>
        )}
      </div>
    </form>
  )
}