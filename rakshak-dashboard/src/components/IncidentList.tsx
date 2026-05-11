'use client'

import { useEffect } from 'react'
import { useIncidentStore } from '../store/incidentStore'

export default function IncidentList() {
  const { incidents, fetchIncidents, subscribeToIncidents, setSelectedIncidentId, selectedIncidentId } = useIncidentStore()

  useEffect(() => {
    fetchIncidents()
    const unsubscribe = subscribeToIncidents()
    // Optional cleanup
  }, [fetchIncidents, subscribeToIncidents])

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'border-red-500 text-red-500'
      case 'High': return 'border-orange-500 text-orange-500'
      case 'Medium': return 'border-yellow-500 text-yellow-500'
      case 'Low': return 'border-green-500 text-green-500'
      default: return 'border-blue-500 text-blue-500'
    }
  }

  return (
    <div className="w-96 h-full bg-gray-900 border-r border-gray-800 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Live Incidents</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {incidents.length === 0 ? (
          <div className="text-gray-500 text-sm">No active incidents.</div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => setSelectedIncidentId(incident.id)}
              className={`p-4 rounded-lg border-l-4 bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors ${getSeverityStyle(incident.severity)} ${selectedIncidentId === incident.id ? 'ring-2 ring-white/20' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm text-white uppercase">{incident.intent}</span>
                <span className="text-xs px-2 py-1 rounded bg-black/30 font-semibold">{incident.severity}</span>
              </div>
              <div className="text-gray-400 text-sm mb-1">{incident.location}</div>
              <div className="text-gray-500 text-xs">{new Date(incident.created_at).toLocaleTimeString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
