import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { MapPin, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

interface LocationMapProps {
  locations: Array<{
    id: string
    name: string
    latitude: number
    longitude: number
    activityCount: number
  }>
}


export const LocationMap = ({ locations }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)
      setMapLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (mapLoaded && L && mapRef.current && locations.length > 0) {
      const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5)
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping opacity-75"></div>
          </div>
        `,
        iconSize: [24, 24],
        popupAnchor: [0, -12],
      })

      locations.forEach((location) => {
        const marker = L.marker([location.latitude, location.longitude], {
          icon: customIcon,
        })
          .bindPopup(`
            <div class="p-2 min-w-[150px]">
              <strong class="text-foreground block mb-1">${location.name}</strong>
              <span class="text-sm text-muted-foreground">📊 ${location.activityCount} activities</span>
              <button 
                onclick="window.location.href='/locations/${location.id}'" 
                class="mt-2 text-xs text-primary hover:underline w-full text-center"
              >
                View Details →
              </button>
            </div>
          `)
          .addTo(map)
        
        marker.on('mouseover', function(this: any) {
          this.openPopup()
        })
      })

      if (locations.length > 1) {
        const bounds = L.latLngBounds(locations.map(l => [l.latitude, l.longitude]))
        map.fitBounds(bounds, { padding: [50, 50] })
      } else if (locations.length === 1) {
        map.setView([locations[0].latitude, locations[0].longitude], 10)
      }

      return () => {
        map.remove()
      }
    }
  }, [mapLoaded, L, locations])

  if (locations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="lg:col-span-2"
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Activity Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-lg bg-muted/50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No location data available</p>
                <p className="text-sm text-muted-foreground">Add locations to see them on map</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="lg:col-span-2"
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Activity Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            className={cn(
              "h-[400px] w-full rounded-lg overflow-hidden transition-all relative",
              !mapLoaded && "bg-muted/50 flex items-center justify-center"
            )}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              📍 {locations.length} active locations with monitoring activities
            </p>
            <p className="text-xs text-muted-foreground">
              🟢 Click on markers for details
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}