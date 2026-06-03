import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            © {currentYear} 北行之路. 记录思考与实践，陪伴每一位独行的追路人。
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              关于
            </Link>
            <a
              href="mailto:xxx@xxx.com"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              联系我
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
