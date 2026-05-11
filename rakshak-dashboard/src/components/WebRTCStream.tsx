'use client'

export default function WebRTCStream({ incidentId }: { incidentId: string }) {
  return (
    <div className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-2 left-2 flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-500 text-xs font-bold uppercase">LIVE</span>
      </div>
      <div className="text-gray-500 text-sm flex flex-col items-center">
        <span>Connecting to secure WebRTC stream...</span>
        <span className="text-xs text-gray-600 mt-1">Incident: {incidentId}</span>
      </div>
    </div>
  )
}
