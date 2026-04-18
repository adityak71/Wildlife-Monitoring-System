import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Activity} from 'lucide-react'

interface ActivityChartProps {
  byType: Array<{ type: string; count: number }>
  byMonth: Array<{ month: string; count: number }>
  byStatus: Array<{ status: string; count: number }>
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  VERIFIED: '#10b981',
  REJECTED: '#ef4444',
}

export const ActivityChart = ({ byType, byMonth, byStatus }: ActivityChartProps) => {
  // Format type labels for display
  const formattedByType = byType?.map(item => ({
    ...item,
    type: item.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  })) || []

  const formattedByStatus = byStatus?.map(item => ({
    ...item,
    status: item.status.charAt(0) + item.status.slice(1).toLowerCase()
  })) || []

  const formattedByMonth = byMonth || []

  if (formattedByType.length === 0 && formattedByMonth.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] flex items-center justify-center text-muted-foreground">
            No activity data available yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" className="w-full flex flex-col">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
              <TabsTrigger value="byType">By Type</TabsTrigger>
              <TabsTrigger value="byStatus">By Status</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="mt-0">
              {formattedByMonth.length > 0 ? (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                        animationBegin={300}
                      >
                        {formattedByMonth.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.7 + (index * 0.05)})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                  No monthly data available
                </div>
              )}
            </TabsContent>

            <TabsContent value="byType" className="mt-0">
              {formattedByType.length > 0 ? (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formattedByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="type"
                        animationDuration={1000}
                        animationBegin={300}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                        labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      >
                        {formattedByType.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                  No type data available
                </div>
              )}
            </TabsContent>

            <TabsContent value="byStatus" className="mt-0">
              {formattedByStatus.length > 0 ? (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formattedByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="status"
                        animationDuration={1000}
                        animationBegin={300}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                        labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      >
                        {formattedByStatus.map((entry) => (
                          <Cell 
                            key={entry.status} 
                            fill={STATUS_COLORS[entry.status.toUpperCase()] || COLORS[0]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                  No status data available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}