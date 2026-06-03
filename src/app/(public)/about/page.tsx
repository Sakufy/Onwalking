export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">关于</h1>
          <p className="text-lg text-gray-600">了解北行之路的创作者与核心理念</p>
        </header>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">我的故事</h2>
          <div className="bg-white rounded-lg p-10 text-gray-700 leading-relaxed space-y-6">
            <p>
              我是路北行，一名走过两次自学高考、经历过专业探索与休学沉淀的前行者。
            </p>
            <p>
              出身普通家庭，早年在盲目苦学与精神内耗中摸索前行，凭借自学实现高考提分 60 分；曾就读物理专业，取得年级第一、一等奖学金的成绩，却在光鲜的标签下陷入精神空洞。于是我选择暂停脚步、向内探寻，最终转学软件工程，一边打磨体系化学习方法，一边搭建属于自己的「北行幸福体系」。
            </p>
            <p>
              我深知独自摸索的迷茫、无人引路的孤独，也见证了无数人被世俗轨道裹挟、困于低效学习与人生抉择。搭建这座网站，便是希望把多年的思考、实战经验与成长体系永久沉淀下来：既是记录自我修行的阵地，也愿意将走过的路、踩过的坑、总结的方法分享出去，帮助更多同路人少走弯路。
            </p>
            <p>
              未来我也会持续在这里输出内容、打磨产品、联结同频伙伴，一步一步践行心中的目标。
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">北行之路的定义</h2>
          <div className="bg-white rounded-lg p-10 text-gray-700 leading-relaxed space-y-6">
            <p>
              北行之路，不是一条规定好的轨道，而是一片自由的人生旷野。
            </p>
            <p>
              它代表拒绝被世俗流水线规训、坚持独立思考的生活态度，以「自我探索、自我提升、自我实现」为完整成长闭环，主张人生没有标准答案，意义由自己创造。
            </p>
            <p>
              选择北行的人，甘愿承受独行的代价，始终追随本心，用行动一步步活成自己想要的模样。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">联系方式</h2>
          <div className="bg-white rounded-lg p-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">邮箱</p>
                    <p className="text-gray-900 font-medium">xxx@xxx.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">B站</p>
                    <p className="text-gray-900 font-medium">@路北行</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">微信</p>
                    <p className="text-gray-900 font-medium">XXXXXXXX（北行咨询 / 同行交流）</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">公众号</p>
                    <p className="text-gray-900 font-medium">北行之路</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">有想法或建议？联系我聊聊</p>
          <a
            href="mailto:xxx@xxx.com"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            联系我
          </a>
        </div>
      </div>
    </div>
  )
}
