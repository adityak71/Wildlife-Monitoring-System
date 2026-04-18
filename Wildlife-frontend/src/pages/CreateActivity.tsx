import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {  Plus, Trash2, FileText, AlertCircle } from 'lucide-react'
import { activityService, type CreateActivityData } from '../services/activity.service'
import { locationService,type  Location } from '../services/location.service'
import { speciesService, type Species } from '../services/species.service'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Card, CardContent } from '../components/ui/card'
import toast from 'react-hot-toast'

const activitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().max(2000).optional(),
  type: z.string().min(1, 'Type is required'),
  date: z.string().optional(),
  locationId: z.string().min(1, 'Location is required'),
  participantId: z.string().optional(),
  findings: z.string().max(2000).optional(),
  actionTaken: z.string().max(2000).optional(),
})

type ActivityFormData = z.infer<typeof activitySchema>

interface SpeciesReport {
  speciesId: string
  count: number
  notes?: string
  behavior?: string
}

export const CreateActivity = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id
  const [speciesReports, setSpeciesReports] = useState<SpeciesReport[]>([{ speciesId: '', count: 1 }])

  const { data: locationsData } = useQuery({
    queryKey: ['locations', 'all'],
    queryFn: () => locationService.getAll({ limit: 100 }),
  })

  const { data: speciesData } = useQuery({
    queryKey: ['species', 'all'],
    queryFn: () => speciesService.getAll({ limit: 100 }),
  })

  const { data: activityData } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => activityService.getById(id!),
    enabled: isEditing,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: '',
      description: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      locationId: '',
      participantId: '',
      findings: '',
      actionTaken: '',
    },
  })

  useEffect(() => {
    if (isEditing && activityData?.data?.activity) {
      const activity = activityData.data.activity
      setValue('title', activity.title)
      setValue('description', activity.description || '')
      setValue('type', activity.type)
      setValue('date', activity.date.split('T')[0])
      setValue('locationId', activity.locationId)
      setValue('participantId', activity.participantId || '')
      setValue('findings', activity.findings || '')
      setValue('actionTaken', activity.actionTaken || '')
      
      if (activity.speciesReports?.length) {
        setSpeciesReports(activity.speciesReports.map((sr: SpeciesReport) => ({
          speciesId: sr.speciesId,
          count: sr.count,
          notes: sr.notes,
          behavior: sr.behavior,
        })))
      }
    }
  }, [isEditing, activityData, setValue])

  const createMutation = useMutation({
    mutationFn: activityService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      toast.success('Activity created successfully')
      navigate('/activities')
    },
    onError: () => {
      toast.error('Failed to create activity')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateActivityData> }) =>
      activityService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      toast.success('Activity updated successfully')
      navigate('/activities')
    },
    onError: () => {
      toast.error('Failed to update activity')
    },
  })

  const onSubmit = async (data: ActivityFormData) => {
    let formattedDate = undefined
  if (data.date) {
    formattedDate = new Date(data.date).toISOString()
  }
  
  const payload = {
    title: data.title,
    description: data.description || undefined,
    type: data.type,
    date: formattedDate,  
    locationId: data.locationId,
    findings: data.findings || undefined,
    actionTaken: data.actionTaken || undefined,
  }
  
    if (isEditing) {
      updateMutation.mutate({ id: id!, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const addSpeciesReport = () => {
    setSpeciesReports([...speciesReports, { speciesId: '', count: 1 }])
  }

  const removeSpeciesReport = (index: number) => {
    setSpeciesReports(speciesReports.filter((_, i) => i !== index))
  }

  const updateSpeciesReport = <K extends keyof SpeciesReport>(index: number, field: K, value: SpeciesReport[K]) => {
    const updated = [...speciesReports]
    updated[index] = { ...updated[index], [field]: value }
    setSpeciesReports(updated)
  }

  const locations = locationsData?.data?.locations || []
  const species = speciesData?.data?.species || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          {isEditing ? 'Edit Activity' : 'Create New Activity'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEditing ? 'Update activity details' : 'Report a new forest monitoring activity'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Enter activity title" {...register('title')} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Activity Type *</Label>
                <Select onValueChange={(v) => setValue('type', v!)} defaultValue={watch('type')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className={"w-full p-4 "}>
                    <SelectItem value="PATROL">🚓 Patrol</SelectItem>
                    <SelectItem value="WILDLIFE_SIGHTING">🐅 Wildlife Sighting</SelectItem>
                    <SelectItem value="ILLEGAL_ACTIVITY">⚠️ Illegal Activity</SelectItem>
                    <SelectItem value="FOREST_FIRE">🔥 Forest Fire</SelectItem>
                    <SelectItem value="RESCUE_OPERATION">🆘 Rescue Operation</SelectItem>
                    <SelectItem value="RESEARCH_SURVEY">📊 Research Survey</SelectItem>
                    <SelectItem value="AWARENESS_PROGRAM">📢 Awareness Program</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register('date')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationId">Location *</Label>
                <Select onValueChange={(v) => setValue('locationId', v!)} defaultValue={watch('locationId')} >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className={"w-full p-4"}>
                    {locations.map((loc: Location) => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.locationId && <p className="text-sm text-destructive">{errors.locationId.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} placeholder="Describe the activity..." {...register('description')} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Species Sighted
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addSpeciesReport}>
                <Plus className="h-4 w-4 mr-1" /> Add Species
              </Button>
            </div>

            {speciesReports.map((report, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Species #{index + 1}</span>
                  {index > 0 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSpeciesReport(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={report.speciesId}
                    onChange={(e) => updateSpeciesReport(index, 'speciesId', e.target.value)}
                  >
                    <option value="">Select species</option>
                    {species.map((sp: Species) => (
                      <option key={sp.id} value={sp.id}>{sp.name} ({sp.scientificName})</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    placeholder="Count"
                    value={report.count}
                    onChange={(e) => updateSpeciesReport(index, 'count', parseInt(e.target.value) || 1)}
                  />
                  <Input
                    placeholder="Behavior (e.g., Resting, Hunting)"
                    value={report.behavior || ''}
                    onChange={(e) => updateSpeciesReport(index, 'behavior', e.target.value)}
                    className="md:col-span-2"
                  />
                  <Input
                    placeholder="Additional notes"
                    value={report.notes || ''}
                    onChange={(e) => updateSpeciesReport(index, 'notes', e.target.value)}
                    className="md:col-span-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Observations</h2>
            <div className="space-y-2">
              <Label htmlFor="findings">Findings</Label>
              <Textarea id="findings" rows={3} placeholder="What did you observe?" {...register('findings')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionTaken">Action Taken</Label>
              <Textarea id="actionTaken" rows={3} placeholder="What actions were taken?" {...register('actionTaken')} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/activities')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditing ? 'Update Activity' : 'Create Activity'}</>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}