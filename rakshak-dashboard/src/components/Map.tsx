'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useIncidentStore } from '../store/incidentStore'
import { AlertCircle } from 'lucide-react'

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom icons based on severity
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color}; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

const getMarkerColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return '#FF3B30'
    case 'High': return '#FF9500'
    case 'Medium': return '#FFCC00'
    case 'Low': return '#30D158'
    default: return '#007AFF'
  }
}

// Subcomponent to center map dynamically if needed
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

export default function Map() {
  const { incidents, setSelectedIncidentId } = useIncidentStore()
  
  // Default to New Delhi
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090])

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <ChangeView center={center} zoom={10} />
        {/* Using a dark-themed CartoDB basemap to match Cyber-Sentinel vibe */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {incidents.map((incident) => {
          // Mock coordinates around center for MVP (since extraction might just give "Connaught Place")
          const lat = 28.6139 + (Math.random() - 0.5) * 0.1
          const lng = 77.2090 + (Math.random() - 0.5) * 0.1
          
          return (
            <Marker
              key={incident.id}
              position={[lat, lng]}
              icon={createCustomIcon(getMarkerColor(incident.severity))}
              eventHandlers={{
                click: () => setSelectedIncidentId(incident.id)
              }}
            >
              <Popup className="bg-gray-800 text-white border-gray-700">
                <div className="text-sm font-bold">{incident.intent}</div>
                <div className="text-xs text-gray-500 mt-1">{incident.location}</div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
