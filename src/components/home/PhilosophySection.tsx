const values = [
  {
    title: '独立本心',
    description: '不盲从世俗单一标准，手握自己人生的定义权。',
  },
  {
    title: '务实行动',
    description: '拒绝内耗与空谈，以持续行动对抗迷茫与困境。',
  },
  {
    title: '长期主义',
    description: '摒弃短期功利，锚定方向稳步前行，沉淀长期价值。',
  },
]

export function PhilosophySection() {
  return (
    <section className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          北行核心理念
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
          这里是北行体系的永久阵地，分享人生思考、学习方法论与成长实践，
          以内容沉淀价值，以分享联结同路人。
        </p>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="p-6 md:p-8 bg-[#faf8f5] rounded-lg border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
