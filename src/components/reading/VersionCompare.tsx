'use client'

import { useState } from 'react'

interface ArticleVersion {
  version: number
  publishedAt: string
  changeNote: string
  content: string
}

interface VersionCompareProps {
  versions: ArticleVersion[]
  onClose: () => void
}

function computeDiff(oldText: string, newText: string): Array<{ text: string; type: 'added' | 'removed' | 'same' }> {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  
  const result: Array<{ text: string; type: 'added' | 'removed' | 'same' }> = []
  const maxLen = Math.max(oldLines.length, newLines.length)
  
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i] || ''
    const newLine = newLines[i] || ''
    
    if (oldLine === newLine) {
      result.push({ text: newLine, type: 'same' })
    } else if (!oldLine) {
      result.push({ text: newLine, type: 'added' })
    } else if (!newLine) {
      result.push({ text: oldLine, type: 'removed' })
    } else {
      const commonStart = Math.min(oldLine.length, newLine.length)
      let samePart = ''
      for (let j = 0; j < commonStart; j++) {
        if (oldLine[j] === newLine[j]) {
          samePart += oldLine[j]
        } else {
          break
        }
      }
      
      if (samePart) {
        result.push({ text: samePart, type: 'same' })
      }
      
      if (samePart.length < oldLine.length) {
        result.push({ text: oldLine.slice(samePart.length), type: 'removed' })
      }
      if (samePart.length < newLine.length) {
        result.push({ text: newLine.slice(samePart.length), type: 'added' })
      }
    }
  }
  
  return result
}

export default function VersionCompare({ versions, onClose }: VersionCompareProps) {
  const [fromVersion, setFromVersion] = useState(versions[versions.length - 2] || versions[0])
  const [toVersion, setToVersion] = useState(versions[versions.length - 1])

  const diff = computeDiff(fromVersion.content, toVersion.content)

  return (
    <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">版本对比</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">旧版本</label>
          <select
            value={fromVersion.version}
            onChange={(e) => {
              const v = versions.find(v => v.version === Number(e.target.value))
              if (v && v.version !== toVersion.version) {
                setFromVersion(v)
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {versions.filter(v => v.version !== toVersion.version).map(v => (
              <option key={v.version} value={v.version}>
                v{v.version} - {v.publishedAt}
              </option>
            ))}
          </select>
        </div>

        <svg className="w-6 h-6 text-gray-400 mt-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">新版本</label>
          <select
            value={toVersion.version}
            onChange={(e) => {
              const v = versions.find(v => v.version === Number(e.target.value))
              if (v && v.version !== fromVersion.version) {
                setToVersion(v)
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {versions.filter(v => v.version !== fromVersion.version).map(v => (
              <option key={v.version} value={v.version}>
                v{v.version} - {v.publishedAt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-500">v{fromVersion.version}</span>
            <span className="text-xs text-gray-400">{fromVersion.publishedAt}</span>
          </div>
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {diff.map((part, i) => (
              <span key={i} className={part.type === 'removed' ? 'bg-red-200 line-through' : 'text-gray-700'}>
                {part.text}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <span className="text-xs font-medium text-blue-600">v{toVersion.version}</span>
            <span className="text-xs text-gray-400">{toVersion.publishedAt}</span>
          </div>
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {diff.map((part, i) => (
              <span key={i} className={part.type === 'added' ? 'bg-green-200' : 'text-gray-700'}>
                {part.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-200 rounded"></span>
          <span className="text-gray-600">新增内容</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-200 rounded"></span>
          <span className="text-gray-600">删除内容</span>
        </div>
      </div>
    </div>
  )
}