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

export const getCommentsByArticleId = async (articleId: string): Promise<Comment[]> => {
  const response = await fetch(`/api/comments?articleId=${articleId}`)
  return response.json()
}

export const getAllComments = async (): Promise<Comment[]> => {
  const response = await fetch('/api/comments')
  return response.json()
}

export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'status'>): Promise<Comment> => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', data: comment }),
  })
  return response.json()
}

export const addReply = async (parentId: string, reply: Omit<Comment, 'id' | 'createdAt' | 'status' | 'parentId'>): Promise<Comment | null> => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'addReply', data: { ...reply, parentId } }),
  })
  const result = await response.json()
  return result.error ? null : result
}

export const updateCommentStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'updateStatus', data: { id, status } }),
  })
  const result = await response.json()
  return result.success === true
}

export const setCreatorReply = async (id: string, reply: string): Promise<boolean> => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'addReplyByCreator', data: { id, reply } }),
  })
  const result = await response.json()
  return result.success === true
}