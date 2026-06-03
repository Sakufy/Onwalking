export function HeroSection() {
  return (
    <section className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
          向内探寻，向北而行
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
          拒绝世俗规训，在人生旷野中探索、成长、实现自我。
        </p>

        <div className="mt-10">
          <a
            href="/articles"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-base"
          >
            开始探索
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
