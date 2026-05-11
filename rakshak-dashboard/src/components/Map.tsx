'use client'

import { useIncidentStore } from '../store/incidentStore'
import MapboxMap, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Map() {
  const { incidents, setSelectedIncidentId } = useIncidentStore()
  
  // Default to a central location, e.g., New Delhi
  const [viewState, setViewState] = useState({
    longitude: 77.2090,
    latitude: 28.6139,
    zoom: 10
  })

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#FF3B30'
      case 'High': return '#FF9500'
      case 'Medium': return '#FFCC00'
      case 'Low': return '#30D158'
      default: return '#007AFF'
    }
  }

  return (
    <div className="w-full h-full relative">
      <MapboxMap
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {incidents.map((incident) => {
          // Mock coordinates if location parsing is simple
          const lat = 28.6139 + (Math.random() - 0.5) * 0.1
          const lng = 77.2090 + (Math.random() - 0.5) * 0.1
          
          return (
            <Marker
              key={incident.id}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation()
                setSelectedIncidentId(incident.id)
              }}
            >
              <div className="cursor-pointer animate-pulse">
                <AlertCircle size={32} color={getMarkerColor(incident.severity)} />
              </div>
            </Marker>
          )
        })}
      </MapboxMap>
    </div>
  )
}
