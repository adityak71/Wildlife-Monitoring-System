import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { formatDistanceToNow } from 'date-fns'

interface RecentParticipantsProps {
  participants: Array<{
    id: string
    name: string
    city: string
    status: string
    registeredAt: string
  }>
}

const statusConfig: Record<string, { label: string; icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>; className: string }> = {
  PENDING: { label: 'Pending', icon: Clock, className: 'bg-yellow-500/10 text-yellow-500' },
  VERIFIED: { label: 'Verified', icon: CheckCircle, className: 'bg-green-500/10 text-green-500' },
  REJECTED: { label: 'Rejected', icon: XCircle, className: 'bg-red-500/10 text-red-500' },
}

export const RecentParticipants = ({ participants }: RecentParticipantsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Recent Organizations
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Link to="/participants">View all →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participants.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No organizations registered yet
              </div>
            ) : (
              participants.map((participant, index) => {
                const status = statusConfig[participant.status] || statusConfig.PENDING
                const StatusIcon = status.icon
                
                return (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">{participant.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={status.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {formatDistanceToNow(new Date(participant.registeredAt), { addSuffix: true })}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}