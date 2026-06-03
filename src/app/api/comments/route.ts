import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface Comment {
  id: string
  articleId: string
  author: string
  authorId: string
  text: string
  isHighValue?: boolean
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
  creatorReply?: string
  parentId?: string
  children?: Comment[]
}

const STORAGE_DIR = path.join(process.cwd(), 'data')
const DEFAULT_COMMENTS: Comment[] = [
  {
    id: '1',
    articleId: '1',
    author: '张三',
    authorId: '1',
    text: '这篇文章让我重新思考了自己的人生方向，非常有启发！',
    isHighValue: true,
    createdAt: '2024-06-01 10:30',
    status: 'approved',
  },
  {
    id: '2',
    articleId: '1',
    author: '李四',
    authorId: '2',
    text: '写得很好，特别是关于能量交换的部分。',
    createdAt: '2024-06-01 11:45',
    status: 'approved',
  },
  {
    id: '3',
    articleId: '1',
    author: '王五',
    authorId: '3',
    text: '感谢分享，受益匪浅',
    createdAt: '2024-06-01 12:30',
    status: 'approved',
  },
  {
    id: '4',
    articleId: '2',
    author: '赵六',
    authorId: '4',
    text: '方法论很实用，已经推荐给朋友了',
    isHighValue: true,
    createdAt: '2024-05-31 15:20',
    status: 'approved',
  },
  {
    id: '5',
    articleId: '2',
    author: '钱七',
    authorId: '5',
    text: '收藏了，准备认真研读',
    createdAt: '2024-05-31 16:40',
    status: 'approved',
  },
  {
    id: '6',
    articleId: '3',
    author: '孙八',
    authorId: '6',
    text: '内容一般',
    createdAt: '2024-05-30 09:15',
    status: 'rejected',
  },
  {
    id: '7',
    articleId: '1',
    author: '周九',
    authorId: '7',
    text: '写得非常棒！',
    createdAt: '2024-06-01 14:30',
    status: 'pending',
  },
]

const getStoredComments = (): Comment[] => {
  try {
    const filePath = path.join(STORAGE_DIR, 'comments.json')
    if (!fs.existsSync(filePath)) {
      return DEFAULT_COMMENTS
    }
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return DEFAULT_COMMENTS
  }
}

const saveComments = (comments: Comment[]): void => {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true })
    }
    const filePath = path.join(STORAGE_DIR, 'comments.json')
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2))
  } catch (error) {
    console.error('Failed to write file:', error)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const articleId = searchParams.get('articleId')
  
  const comments = getStoredComments()
  
  if (articleId) {
    const approvedComments = comments.filter(c => c.articleId === articleId && c.status === 'approved' && !c.parentId)
    return NextResponse.json(approvedComments)
  }
  
  return NextResponse.json(comments)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { action, data } = body
  
  const comments = getStoredComments()
  
  switch (action) {
    case 'add': {
      const newComment: Comment = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleString('zh-CN'),
        status: data.text.length >= 200 ? 'approved' : 'pending',
        isHighValue: data.text.length >= 200,
      }
      comments.push(newComment)
      saveComments(comments)
      return NextResponse.json(newComment)
    }
    
    case 'addReply': {
      const { parentId, ...replyData } = data
      const parentComment = comments.find(c => c.id === parentId)
      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 })
      }
      
      const newReply: Comment = {
        ...replyData,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleString('zh-CN'),
        status: replyData.text.length >= 200 ? 'approved' : 'pending',
        parentId,
      }
      comments.push(newReply)
      saveComments(comments)
      return NextResponse.json(newReply)
    }
    
    case 'updateStatus': {
      const { id, status } = data
      const index = comments.findIndex(c => c.id === id)
      if (index === -1) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
      }
      comments[index] = { ...comments[index], status }
      saveComments(comments)
      return NextResponse.json({ success: true })
    }
    
    case 'addReplyByCreator': {
      const { id, reply } = data
      const index = comments.findIndex(c => c.id === id)
      if (index === -1) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
      }
      comments[index] = { 
        ...comments[index], 
        creatorReply: reply,
        isHighValue: true 
      }
      saveComments(comments)
      return NextResponse.json({ success: true })
    }
    
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}