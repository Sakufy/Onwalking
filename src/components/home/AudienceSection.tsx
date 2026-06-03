export function AudienceSection() {
  return (
    <section className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 md:mb-16 text-center">
          关于北行之路
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-8 bg-white rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              北行之路是什么
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              北行之路，不是一条规定好的轨道，而是一片自由的人生旷野。
            </p>
            <p className="text-gray-600 leading-relaxed">
              它代表拒绝被世俗流水线规训、坚持独立思考的生活态度，
              以「自我探索、自我提升、自我实现」为完整成长闭环，
              主张人生没有标准答案，意义由自己创造。
            </p>
          </div>

          <div className="p-8 bg-white rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              适合这样的你
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-600">
                <span className="mr-3 text-blue-600">·</span>
                追求精神独立，不愿被世俗标签定义
              </li>
              <li className="flex items-start text-gray-600">
                <span className="mr-3 text-blue-600">·</span>
                在人生方向上感到迷茫，渴望找到属于自己的路
              </li>
              <li className="flex items-start text-gray-600">
                <span className="mr-3 text-blue-600">·</span>
                希望提升学习能力和自我管理能力
              </li>
              <li className="flex items-start text-gray-600">
                <span className="mr-3 text-blue-600">·</span>
                愿意用行动对抗焦虑，践行长期主义
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
