import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface Incident {
  id: string
  sender_number: string
  intent: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  location: string
  raw_text: string
  status: string
  created_at: string
}

interface IncidentState {
  incidents: Incident[]
  selectedIncidentId: string | null
  fetchIncidents: () => Promise<void>
  subscribeToIncidents: () => void
  setSelectedIncidentId: (id: string | null) => void
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  selectedIncidentId: null,
  fetchIncidents: async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) set({ incidents: data })
  },
  subscribeToIncidents: () => {
    const subscription = supabase
      .channel('public:incidents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, payload => {
        set((state) => {
          if (payload.eventType === 'INSERT') {
            return { incidents: [payload.new as Incident, ...state.incidents] }
          }
          if (payload.eventType === 'UPDATE') {
            return { incidents: state.incidents.map(i => i.id === payload.new.id ? payload.new as Incident : i) }
          }
          if (payload.eventType === 'DELETE') {
            return { incidents: state.incidents.filter(i => i.id !== payload.old.id) }
          }
          return state
        })
      })
      .subscribe()
      
    return () => {
      supabase.removeChannel(subscription)
    }
  },
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id })
}))
