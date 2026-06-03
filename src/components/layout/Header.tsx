'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { href: '/articles', label: '文章' },
    { href: '/about', label: '关于' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            北行之路
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <Link
              href="/articles"
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="搜索文章"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {session.user?.name || session.user?.email}
                </span>
                {/* 只对创作者和管理员显示后台入口 */}
                {((session.user as any)?.role === 'CREATOR' || (session.user as any)?.role === 'ADMIN') && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    创作者后台
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                登录
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {session ? (
                <>
                  <div className="text-sm text-gray-500 pt-2">
                    {session.user?.name || session.user?.email}
                  </div>
                  {/* 只对创作者和管理员显示后台入口 */}
                  {((session.user as any)?.role === 'CREATOR' || (session.user as any)?.role === 'ADMIN') && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-base font-medium text-blue-600 text-left"
                    >
                      创作者后台
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="text-base font-medium text-gray-600 text-left"
                  >
                    登出
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  登录
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
