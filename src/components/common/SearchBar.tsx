'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  initialValue?: string
  placeholder?: string
  className?: string
}

export default function SearchBar({
  onSearch,
  initialValue = '',
  placeholder = '搜索文章...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        inputRef.current?.blur()
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query.trim())
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200
          ${isFocused ? 'border-blue-500 bg-white shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}
        `}
      >
        <svg
          className={`w-5 h-5 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}