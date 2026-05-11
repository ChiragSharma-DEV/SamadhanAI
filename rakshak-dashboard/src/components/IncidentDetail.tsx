'use client'

import { useIncidentStore } from '../store/incidentStore'
import WebRTCStream from './WebRTCStream'
import { FileText, X } from 'lucide-react'

export default function IncidentDetail() {
  const { incidents, selectedIncidentId, setSelectedIncidentId } = useIncidentStore()
  
  if (!selectedIncidentId) return null

  const incident = incidents.find(i => i.id === selectedIncidentId)
  
  if (!incident) return null

  return (
    <div className="absolute top-4 right-4 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
        <h3 className="text-lg font-bold text-white">Incident Details</h3>
        <button onClick={() => setSelectedIncidentId(null)} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Intent</div>
          <div className="text-white font-medium">{incident.intent}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Severity</div>
            <div className="text-white font-medium">{incident.severity}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Time</div>
            <div className="text-white font-medium">{new Date(incident.created_at).toLocaleTimeString()}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Location</div>
          <div className="text-white font-medium">{incident.location}</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Raw Transcript</div>
          <div className="text-gray-300 text-sm bg-gray-900 p-2 rounded mt-1">{incident.raw_text}</div>
        </div>

        <div className="pt-2">
          <WebRTCStream incidentId={incident.id} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reports/fir/${incident.id}`}
          download
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          <FileText size={18} />
          <span>Download FIR Report</span>
        </a>
      </div>
    </div>
  )
}
