'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  if (session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    if (password.length < 6) {
      setError('密码至少需要6位')
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        name,
        isRegister: true,
        redirect: false,
      })

      if (result?.error) {
        setError('注册失败，请重试')
      } else if (result?.ok) {
        setIsSuccess(true)
      }
    } catch (error) {
      setError('注册失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, router])

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            注册
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            或
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
              返回登录
            </Link>
          </p>
        </div>
        
        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
            <p>注册成功！正在跳转到首页...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入用户名"
                />
              </div>
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入密码（至少6位）"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请再次输入密码"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '注册中...' : '注册'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
