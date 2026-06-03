'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      // 如果是创作者或管理员，跳转到后台
      const userRole = (session.user as any)?.role
      if (userRole === 'CREATOR' || userRole === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  }, [session, router])

  if (session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('邮箱或密码错误')
      } else if (result?.ok) {
        // 登录成功，让 useEffect 处理跳转
        router.refresh()
      }
    } catch (error) {
      setError('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            登录
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            没有账号？
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
              立即注册
            </Link>
            &nbsp;或&nbsp;
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              返回首页
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-6">
          <p>演示账号：test@example.com</p>
          <p>密码：password123</p>
        </div>
      </div>
    </div>
  )
}
