'use client'

import { useState } from 'react'

interface ArticleVersion {
  version: number
  publishedAt: string
  changeNote: string
  content: string
}

interface VersionTimelineProps {
  versions: ArticleVersion[]
  currentVersion: number
  onSelectVersion: (version: ArticleVersion) => void
}

export default function VersionTimeline({
  versions,
  currentVersion,
  onSelectVersion,
}: VersionTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version)

  return (
    <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-6 mt-8">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">版本历史</h3>
          <span className="text-sm text-gray-500">({versions.length} 个版本)</span>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {sortedVersions.map((version, index) => {
              const isCurrent = version.version === currentVersion
              return (
                <div 
                  key={version.version}
                  className={`relative pl-12 cursor-pointer group ${isCurrent ? 'opacity-100' : 'opacity-60 hover:opacity-100'} transition-opacity`}
                  onClick={() => onSelectVersion(version)}
                >
                  <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 ${isCurrent ? 'border-blue-600 bg-blue-600' : 'border-gray-400 bg-white group-hover:border-blue-500'}`}></div>
                  
                  <div className={`p-4 rounded-lg transition-all ${isCurrent ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-900'}`}>
                          v{version.version}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                            当前版本
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{version.publishedAt}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{version.changeNote}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}