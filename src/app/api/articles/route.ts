import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { articles as initialArticles, type Article, type ArticleVersion } from '@/data/articles'

const STORAGE_DIR = path.join(process.cwd(), 'data')

const getStoredArticles = (): Article[] => {
  try {
    const filePath = path.join(STORAGE_DIR, 'articles.json')
    if (!fs.existsSync(filePath)) {
      return initialArticles
    }
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return initialArticles
  }
}

const saveArticles = (articles: Article[]): void => {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true })
    }
    const filePath = path.join(STORAGE_DIR, 'articles.json')
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))
  } catch (error) {
    console.error('Failed to write articles:', error)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const category = searchParams.get('category')
  
  const articles = getStoredArticles()
  
  if (slug) {
    const article = articles.find(a => a.slug === slug)
    return NextResponse.json(article || null)
  }
  
  if (category) {
    const filtered = articles.filter(a => a.category === category)
    return NextResponse.json(filtered)
  }
  
  return NextResponse.json(articles)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { action, data } = body
  
  const articles = getStoredArticles()
  
  switch (action) {
    case 'create': {
      const { title, content, category, changeNote } = data
      const newArticle: Article = {
        id: Date.now().toString(),
        slug: title.replace(/\s+/g, '-').toLowerCase(),
        title,
        category: category || '自我探索',
        readingTime: Math.ceil(content.length / 500),
        publishedAt: new Date().toISOString().split('T')[0],
        content,
        status: 'published',
        versions: [{
          version: 1,
          publishedAt: new Date().toLocaleDateString('zh-CN'),
          changeNote: changeNote || '首次发布',
          content,
        }],
      }
      articles.push(newArticle)
      saveArticles(articles)
      return NextResponse.json(newArticle)
    }
    
    case 'update': {
      const { id, title, content, category, changeNote } = data
      const index = articles.findIndex(a => a.id === id)
      if (index === -1) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      
      const article = articles[index]
      const newVersion: ArticleVersion = {
        version: (article.versions?.length || 0) + 1,
        publishedAt: new Date().toLocaleDateString('zh-CN'),
        changeNote: changeNote || '更新内容',
        content,
      }
      
      articles[index] = {
        ...article,
        title,
        slug: title.replace(/\s+/g, '-').toLowerCase(),
        category: category || article.category,
        content,
        versions: [...(article.versions || []), newVersion],
      }
      saveArticles(articles)
      return NextResponse.json(articles[index])
    }
    
    case 'delete': {
      const { id } = data
      const filtered = articles.filter(a => a.id !== id)
      saveArticles(filtered)
      return NextResponse.json({ success: true })
    }
    
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}