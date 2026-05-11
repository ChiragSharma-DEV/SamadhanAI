import IncidentList from '@/components/IncidentList'
import Map from '@/components/Map'
import IncidentDetail from '@/components/IncidentDetail'

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
