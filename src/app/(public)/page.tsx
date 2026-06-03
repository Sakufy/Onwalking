import { HeroSection } from '@/components/home/HeroSection'
import { PhilosophySection } from '@/components/home/PhilosophySection'
import { AudienceSection } from '@/components/home/AudienceSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <HeroSection />
      <PhilosophySection />
      <AudienceSection />
    </div>
  )
}
