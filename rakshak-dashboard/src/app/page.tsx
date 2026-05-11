import IncidentList from '@/components/IncidentList'
import IncidentDetail from '@/components/IncidentDetail'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center text-gray-500"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>Loading Map...</div>
})

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-black text-white overflow-hidden relative">
      <IncidentList />
      <div className="flex-1 relative">
        <Map />
        <IncidentDetail />
      </div>
    </main>
  )
}
