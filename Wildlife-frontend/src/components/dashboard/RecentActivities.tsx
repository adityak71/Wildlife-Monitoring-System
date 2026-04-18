import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, User, Eye, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivitiesProps {
  activities: Array<{
    id: string
    title: string
    type: string
    status: string
    date: string
    location: { name: string }
    reportedBy: { name: string; avatar?: string }
  }>
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  VERIFIED: 'bg-green-500/10 text-green-500 border-green-500/20',
  REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const typeIcons: Record<string, string> = {
  PATROL: '🚓',
  WILDLIFE_SIGHTING: '🐅',
  ILLEGAL_ACTIVITY: '⚠️',
  FOREST_FIRE: '🔥',
  RESCUE_OPERATION: '🆘',
  RESEARCH_SURVEY: '📊',
  AWARENESS_PROGRAM: '📢',
}

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activities
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Link to="/activities">View all →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No activities yet
              </div>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200"
                >
                  <Link to={`/activities/${activity.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-xl">{typeIcons[activity.type] || '📍'}</span>
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {activity.title}
                          </h3>
                          <Badge variant="outline" className={statusColors[activity.status]}>
                            {activity.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{activity.location.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span>{activity.reportedBy.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDistanceToNow(new Date(activity.date), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}