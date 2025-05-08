"use client"

import { useEffect, useState } from "react"
import { Calculator, DollarSign, Save, Trash, Users } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
// import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Define the Scenario type
interface Scenario {
  id: string
  name: string
  arpu: number
  footfall: number
  sessionDuration: number
  utilizationRate: number
  totalCapacity: number
  hourlyRate: number
  hoursPerDay: number
  createdAt: Date
}

// Function to calculate metrics based on scenario parameters
const calculateMetrics = (scenario: Scenario) => {
  const currentCapacity = (scenario.footfall * scenario.sessionDuration) / scenario.hoursPerDay
  const capacityUtilization = (currentCapacity / scenario.totalCapacity) * 100

  // Revenue calculations based on hourly rate
  const hourlyRevenue = scenario.hourlyRate * currentCapacity
  const dailyRevenue = hourlyRevenue * scenario.hoursPerDay
  const monthlyRevenue = dailyRevenue * 30
  const annualRevenue = dailyRevenue * 365

  // Potential revenue at target utilization
  const potentialRevenue =
    scenario.hourlyRate * ((scenario.totalCapacity * scenario.utilizationRate) / 100) * scenario.hoursPerDay

  return {
    currentCapacity,
    capacityUtilization,
    hourlyRevenue,
    dailyRevenue,
    monthlyRevenue,
    annualRevenue,
    potentialRevenue,
  }
}

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

// Format percentage difference
const formatDifference = (value1: number, value2: number) => {
  const diff = ((value2 - value1) / value1) * 100
  return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`
}

export default function RevenueEstimator() {
  // Default scenario values
  const defaultScenario: Omit<Scenario, "id" | "name" | "createdAt"> = {
    arpu: 50,
    footfall: 100,
    sessionDuration: 1,
    utilizationRate: 70,
    totalCapacity: 150,
    hourlyRate: 25,
    hoursPerDay: 8,
  }

  // State for current scenario
  const [currentScenario, setCurrentScenario] = useState<Scenario>({
    id: "current",
    name: "Current Scenario",
    ...defaultScenario,
    createdAt: new Date(),
  })

  // State for saved scenarios
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([])

  // State for comparison mode
  const [comparisonMode, setComparisonMode] = useState(false)

  // State for comparison scenario
  const [comparisonScenario, setComparisonScenario] = useState<Scenario | null>(null)

  // State for new scenario name
  const [newScenarioName, setNewScenarioName] = useState("")

  // State for dialog open
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)

  // Load saved scenarios from localStorage on component mount
  useEffect(() => {
    const savedScenariosFromStorage = localStorage.getItem("savedScenarios")
    if (savedScenariosFromStorage) {
      try {
        const parsedScenarios = JSON.parse(savedScenariosFromStorage)
        // Convert string dates back to Date objects
        const scenariosWithDates = parsedScenarios.map((scenario: Omit<Scenario, 'createdAt'> & { createdAt: string }) => ({
          ...scenario,
          createdAt: new Date(scenario.createdAt),
        }))
        setSavedScenarios(scenariosWithDates)
      } catch (error) {
        console.error("Error parsing saved scenarios:", error)
      }
    }
  }, [])

  // Save scenarios to localStorage when they change
  useEffect(() => {
    if (savedScenarios.length > 0) {
      localStorage.setItem("savedScenarios", JSON.stringify(savedScenarios))
    }
  }, [savedScenarios])

  // Calculate metrics for current scenario
  const currentMetrics = calculateMetrics(currentScenario)

  // Calculate metrics for comparison scenario if it exists
  const comparisonMetrics = comparisonScenario ? calculateMetrics(comparisonScenario) : null

  // Function to save current scenario
  const saveCurrentScenario = () => {
    if (!newScenarioName.trim()) return

    const newScenario: Scenario = {
      ...currentScenario,
      id: `scenario-${Date.now()}`,
      name: newScenarioName,
      createdAt: new Date(),
    }

    setSavedScenarios([...savedScenarios, newScenario])
    setNewScenarioName("")
    setSaveDialogOpen(false)
  }

  // Function to load a scenario
  const loadScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario)
  }

  // Function to delete a scenario
  const deleteScenario = (scenarioId: string) => {
    setSavedScenarios(savedScenarios.filter((s) => s.id !== scenarioId))

    // If the deleted scenario is the comparison scenario, clear it
    if (comparisonScenario && comparisonScenario.id === scenarioId) {
      setComparisonScenario(null)
      setComparisonMode(false)
    }
  }

  // Function to set comparison scenario
  const setComparisonScenarioById = (scenarioId: string) => {
    const scenario = savedScenarios.find((s) => s.id === scenarioId)
    if (scenario) {
      setComparisonScenario(scenario)
      setComparisonMode(true)
    }
  }

  // Function to exit comparison mode
  const exitComparisonMode = () => {
    setComparisonMode(false)
    setComparisonScenario(null)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Revenue Estimator</h1>
        <p className="text-muted-foreground max-w-2xl">
          Calculate your potential revenue based on key business metrics
        </p>
      </div>

      {/* Scenario Management Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-muted/40 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {comparisonMode ? "Comparing Scenarios" : `Scenario: ${currentScenario.name}`}
          </h2>
          {comparisonMode && comparisonScenario && (
            <Badge variant="outline" className="ml-2">
              {currentScenario.name} vs {comparisonScenario.name}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Save Scenario Dialog */}
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save Scenario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Current Scenario</DialogTitle>
                <DialogDescription>Give your scenario a name to save it for future comparison.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="scenario-name">Scenario Name</Label>
                <Input
                  id="scenario-name"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="e.g., Increased Capacity"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveCurrentScenario}>Save Scenario</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Load Scenario Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Load Scenario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Saved Scenarios</DialogTitle>
                <DialogDescription>Select a scenario to load or compare.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {savedScenarios.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No saved scenarios yet. Save your current scenario to compare later.
                  </p>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {savedScenarios.map((scenario) => (
                        <div
                          key={scenario.id}
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{scenario.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {scenario.createdAt.toLocaleDateString()} •
                              {formatCurrency(calculateMetrics(scenario).dailyRevenue)}/day
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => loadScenario(scenario)}>
                              Load
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setComparisonScenarioById(scenario.id)}>
                              Compare
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteScenario(scenario.id)}>
                              <Trash className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {comparisonMode && (
            <Button variant="outline" size="sm" onClick={exitComparisonMode}>
              Exit Comparison
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Parameters Panel - Only show in non-comparison mode or as the left panel in comparison mode */}
        {(!comparisonMode || (comparisonMode && comparisonScenario)) && (
          <div className={`${comparisonMode ? "md:col-span-6" : "md:col-span-5"}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {comparisonMode ? "Scenario A Parameters" : "Input Parameters"}
                </CardTitle>
                <CardDescription>
                  {comparisonMode ? currentScenario.name : "Adjust the values to see how they affect your revenue"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="arpu" className="flex items-center gap-1">
                      ARPU
                      {/* <TooltipProvider>
                        <TooltipProvider>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">
                              Average Revenue Per User - The average amount each customer spends
                            </p>
                          </TooltipContent>
                        </TooltipProvider>
                      </TooltipProvider> */}
                    </Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="arpu"
                        type="number"
                        value={currentScenario.arpu}
                        onChange={(e) => setCurrentScenario({ ...currentScenario, arpu: Number(e.target.value) })}
                        className="w-20 text-right"
                      />
                    </div>
                  </div>
                  <Slider
                    value={[currentScenario.arpu]}
                    min={1}
                    max={200}
                    step={1}
                    onValueChange={(value) => setCurrentScenario({ ...currentScenario, arpu: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="footfall" className="flex items-center gap-1">
                      Customer Footfall
                      {/* <TooltipProvider>
                        <TooltipProvider>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Number of customers per day</p>
                          </TooltipContent>
                        </TooltipProvider>
                      </TooltipProvider> */}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="footfall"
                        type="number"
                        value={currentScenario.footfall}
                        onChange={(e) => setCurrentScenario({ ...currentScenario, footfall: Number(e.target.value) })}
                        className="w-20 text-right"
                      />
                    </div>
                  </div>
                  <Slider
                    value={[currentScenario.footfall]}
                    min={1}
                    max={500}
                    step={1}
                    onValueChange={(value) => setCurrentScenario({ ...currentScenario, footfall: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sessionDuration" className="flex items-center gap-1">
                      Avg. Session Duration
                      {/* <TooltipProvider>
                        <TooltipProvider>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Average time (in hours) each customer spends</p>
                          </TooltipContent>
                        </TooltipProvider>
                      </TooltipProvider> */}
                    </Label>
                    <Input
                      id="sessionDuration"
                      type="number"
                      value={currentScenario.sessionDuration}
                      onChange={(e) =>
                        setCurrentScenario({ ...currentScenario, sessionDuration: Number(e.target.value) })
                      }
                      className="w-20 text-right"
                      step={0.1}
                      min={0.1}
                    />
                  </div>
                  <Slider
                    value={[currentScenario.sessionDuration * 10]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) =>
                      setCurrentScenario({ ...currentScenario, sessionDuration: value[0] / 10 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="utilizationRate" className="flex items-center gap-1">
                      Capacity Utilization Rate
                      {/* <TooltipProvider>
                        <TooltipProvider>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Target percentage of total capacity to utilize</p>
                          </TooltipContent>
                        </TooltipProvider>
                      </TooltipProvider> */}
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="utilizationRate"
                        type="number"
                        value={currentScenario.utilizationRate}
                        onChange={(e) =>
                          setCurrentScenario({ ...currentScenario, utilizationRate: Number(e.target.value) })
                        }
                        className="w-20 text-right"
                        min={1}
                        max={100}
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[currentScenario.utilizationRate]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setCurrentScenario({ ...currentScenario, utilizationRate: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="totalCapacity" className="flex items-center gap-1">
                      Total Capacity
                      {/* <TooltipProvider>
                        <TooltipProvider>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Maximum number of customers that can be served simultaneously</p>
                          </TooltipContent>
                        </TooltipProvider>
                      </TooltipProvider> */}
                    </Label>
                    <Input
                      id="totalCapacity"
                      type="number"
                      value={currentScenario.totalCapacity}
                      onChange={(e) =>
                        setCurrentScenario({ ...currentScenario, totalCapacity: Number(e.target.value) })
                      }
                      className="w-20 text-right"
                      min={1}
                    />
                  </div>
                  <Slider
                    value={[currentScenario.totalCapacity]}
                    min={10}
                    max={500}
                    step={10}
                    onValueChange={(value) => setCurrentScenario({ ...currentScenario, totalCapacity: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hourlyRate" className="flex items-center gap-1">
                      Hourly Rate
                      {/* <TooltipProvider>
                        <TooltipProvider>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">The rate you charge customers per hour</p>
                          </TooltipContent>
                        </TooltipProvider>
                      </TooltipProvider> */}
                    </Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={currentScenario.hourlyRate}
                        onChange={(e) => setCurrentScenario({ ...currentScenario, hourlyRate: Number(e.target.value) })}
                        className="w-20 text-right"
                        min={1}
                      />
                    </div>
                  </div>
                  <Slider
                    value={[currentScenario.hourlyRate]}
                    min={1}
                    max={200}
                    step={1}
                    onValueChange={(value) => setCurrentScenario({ ...currentScenario, hourlyRate: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hoursPerDay" className="flex items-center gap-1">
                      Hours of Operation
                      {/* <TooltipProvider>
                        <TooltipProvider>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Number of hours your business operates per day</p>
                          </TooltipContent>
                        </TooltipProvider>
                      </TooltipProvider> */}
                    </Label>
                    <Input
                      id="hoursPerDay"
                      type="number"
                      value={currentScenario.hoursPerDay}
                      onChange={(e) => setCurrentScenario({ ...currentScenario, hoursPerDay: Number(e.target.value) })}
                      className="w-20 text-right"
                      min={1}
                      max={24}
                    />
                  </div>
                  <Slider
                    value={[currentScenario.hoursPerDay]}
                    min={1}
                    max={24}
                    step={1}
                    onValueChange={(value) => setCurrentScenario({ ...currentScenario, hoursPerDay: value[0] })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    setCurrentScenario({
                      ...currentScenario,
                      ...defaultScenario,
                    })
                  }}
                  variant="outline"
                >
                  Reset to Defaults
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Comparison Scenario Parameters - Only show in comparison mode */}
        {comparisonMode && comparisonScenario && (
          <div className="md:col-span-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Scenario B Parameters
                </CardTitle>
                <CardDescription>{comparisonScenario.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">ARPU</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div className="w-20 text-right font-medium">{comparisonScenario.arpu}</div>
                    </div>
                  </div>
                  <div className="h-6 flex items-center">
                    <div className="text-xs text-muted-foreground">
                      {comparisonScenario.arpu !== currentScenario.arpu && (
                        <Badge
                          variant={comparisonScenario.arpu > currentScenario.arpu ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {formatDifference(currentScenario.arpu, comparisonScenario.arpu)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">Customer Footfall</Label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="w-20 text-right font-medium">{comparisonScenario.footfall}</div>
                    </div>
                  </div>
                  <div className="h-6 flex items-center">
                    <div className="text-xs text-muted-foreground">
                      {comparisonScenario.footfall !== currentScenario.footfall && (
                        <Badge
                          variant={comparisonScenario.footfall > currentScenario.footfall ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {formatDifference(currentScenario.footfall, comparisonScenario.footfall)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">Avg. Session Duration</Label>
                    <div className="w-20 text-right font-medium">{comparisonScenario.sessionDuration} hr</div>
                  </div>
                  <div className="h-6 flex items-center">
                    <div className="text-xs text-muted-foreground">
                      {comparisonScenario.sessionDuration !== currentScenario.sessionDuration && (
                        <Badge
                          variant={
                            comparisonScenario.sessionDuration > currentScenario.sessionDuration
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {formatDifference(currentScenario.sessionDuration, comparisonScenario.sessionDuration)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">Capacity Utilization Rate</Label>
                    <div className="flex items-center">
                      <div className="w-20 text-right font-medium">{comparisonScenario.utilizationRate}%</div>
                    </div>
                  </div>
                  <div className="h-6 flex items-center">
                    <div className="text-xs text-muted-foreground">
                      {comparisonScenario.utilizationRate !== currentScenario.utilizationRate && (
                        <Badge
                          variant={
                            comparisonScenario.utilizationRate > currentScenario.utilizationRate
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {formatDifference(currentScenario.utilizationRate, comparisonScenario.utilizationRate)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">Total Capacity</Label>
                    <div className="w-20 text-right font-medium">{comparisonScenario.totalCapacity}</div>
                  </div>
                  <div className="h-6 flex items-center">
                    <div className="text-xs text-muted-foreground">
                      {comparisonScenario.totalCapacity !== currentScenario.totalCapacity && (
                        <Badge
                          variant={
                            comparisonScenario.totalCapacity > currentScenario.totalCapacity ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {formatDifference(currentScenario.totalCapacity, comparisonScenario.totalCapacity)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">Hourly Rate</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div className="w-20 text-right font-medium">{comparisonScenario.hourlyRate}</div>
                    </div>
                  </div>
                  <div className="h-6 flex items-center">
                    <div className="text-xs text-muted-foreground">
                      {comparisonScenario.hourlyRate !== currentScenario.hourlyRate && (
                        <Badge
                          variant={
                            comparisonScenario.hourlyRate > currentScenario.hourlyRate ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {formatDifference(currentScenario.hourlyRate, comparisonScenario.hourlyRate)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">Hours of Operation</Label>
                    <div className="w-20 text-right font-medium">{comparisonScenario.hoursPerDay} hrs</div>
                  </div>
                  <div className="h-6 flex items-center">
                    <div className="text-xs text-muted-foreground">
                      {comparisonScenario.hoursPerDay !== currentScenario.hoursPerDay && (
                        <Badge
                          variant={
                            comparisonScenario.hoursPerDay > currentScenario.hoursPerDay ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {formatDifference(currentScenario.hoursPerDay, comparisonScenario.hoursPerDay)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => loadScenario(comparisonScenario)} variant="outline">
                  Load This Scenario
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Results Panel */}
        <div className={`${comparisonMode ? "md:col-span-12" : "md:col-span-7"}`}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Projections</CardTitle>
                <CardDescription>Based on your input parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Daily</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{formatCurrency(currentMetrics.dailyRevenue)}</p>
                      {comparisonMode && comparisonMetrics && (
                        <Badge
                          variant={
                            comparisonMetrics.dailyRevenue > currentMetrics.dailyRevenue ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {formatDifference(currentMetrics.dailyRevenue, comparisonMetrics.dailyRevenue)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hourly: {formatCurrency(currentMetrics.hourlyRevenue)}
                      {comparisonMode &&
                        comparisonMetrics &&
                        comparisonMetrics.hourlyRevenue !== currentMetrics.hourlyRevenue && (
                          <span className="ml-1 text-xs">vs {formatCurrency(comparisonMetrics.hourlyRevenue)}</span>
                        )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Monthly</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{formatCurrency(currentMetrics.monthlyRevenue)}</p>
                      {comparisonMode && comparisonMetrics && (
                        <Badge
                          variant={
                            comparisonMetrics.monthlyRevenue > currentMetrics.monthlyRevenue ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {formatDifference(currentMetrics.monthlyRevenue, comparisonMetrics.monthlyRevenue)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">(30 days)</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Annual</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{formatCurrency(currentMetrics.annualRevenue)}</p>
                      {comparisonMode && comparisonMetrics && (
                        <Badge
                          variant={
                            comparisonMetrics.annualRevenue > currentMetrics.annualRevenue ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {formatDifference(currentMetrics.annualRevenue, comparisonMetrics.annualRevenue)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">(365 days)</p>
                  </div>
                </div>

                <Tabs defaultValue="bar">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="bar">Revenue Breakdown</TabsTrigger>
                    <TabsTrigger value="line">Time Projection</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bar" className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Daily",
                            current: currentMetrics.dailyRevenue,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.dailyRevenue : 0,
                          },
                          {
                            name: "Monthly",
                            current: currentMetrics.monthlyRevenue,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.monthlyRevenue : 0,
                          },
                          {
                            name: "Annual",
                            current: currentMetrics.annualRevenue,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.annualRevenue : 0,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value) =>
                            value >= 1000000
                              ? `$${(value / 1000000).toFixed(0)}M`
                              : value >= 1000
                                ? `$${(value / 1000).toFixed(0)}K`
                                : `$${value}`
                          }
                        />
                        <Tooltip
                          formatter={(value) => [`${formatCurrency(Number(value))}`, ""]}
                          labelFormatter={(label) => `${label} Projection`}
                        />
                        <Legend />
                        <Bar dataKey="current" name={comparisonMode ? "Scenario A" : "Revenue"} fill="#10b981" />
                        {comparisonMode && comparisonMetrics && (
                          <Bar dataKey="comparison" name="Scenario B" fill="#3b82f6" />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="line" className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          {
                            name: "Day 1",
                            current: currentMetrics.dailyRevenue,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.dailyRevenue : 0,
                          },
                          {
                            name: "Day 7",
                            current: currentMetrics.dailyRevenue * 7,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.dailyRevenue * 7 : 0,
                          },
                          {
                            name: "Day 30",
                            current: currentMetrics.monthlyRevenue,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.monthlyRevenue : 0,
                          },
                          {
                            name: "Day 90",
                            current: currentMetrics.monthlyRevenue * 3,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.monthlyRevenue * 3 : 0,
                          },
                          {
                            name: "Day 180",
                            current: currentMetrics.monthlyRevenue * 6,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.monthlyRevenue * 6 : 0,
                          },
                          {
                            name: "Day 365",
                            current: currentMetrics.annualRevenue,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.annualRevenue : 0,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value) =>
                            value >= 1000000
                              ? `$${(value / 1000000).toFixed(0)}M`
                              : value >= 1000
                                ? `$${(value / 1000).toFixed(0)}K`
                                : `$${value}`
                          }
                        />
                        <Tooltip
                          formatter={(value) => [`${formatCurrency(Number(value))}`, ""]}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="current"
                          name={comparisonMode ? "Scenario A" : "Revenue"}
                          stroke="#10b981"
                          activeDot={{ r: 8 }}
                        />
                        {comparisonMode && comparisonMetrics && (
                          <Line
                            type="monotone"
                            dataKey="comparison"
                            name="Scenario B"
                            stroke="#3b82f6"
                            activeDot={{ r: 8 }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity Analysis</CardTitle>
                <CardDescription>Current utilization and potential revenue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Utilization</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{currentMetrics.capacityUtilization.toFixed(1)}%</span>
                          {comparisonMode && comparisonMetrics && (
                            <Badge
                              variant={
                                comparisonMetrics.capacityUtilization > currentMetrics.capacityUtilization
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {formatDifference(
                                currentMetrics.capacityUtilization,
                                comparisonMetrics.capacityUtilization,
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${currentMetrics.capacityUtilization > 90 ? "bg-red-500" : currentMetrics.capacityUtilization > 70 ? "bg-amber-500" : "bg-green-500"}`}
                          style={{ width: `${Math.min(currentMetrics.capacityUtilization, 100)}%` }}
                        />
                      </div>
                      {comparisonMode && comparisonMetrics && (
                        <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${comparisonMetrics.capacityUtilization > 90 ? "bg-red-500" : comparisonMetrics.capacityUtilization > 70 ? "bg-amber-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min(comparisonMetrics.capacityUtilization, 100)}%`, opacity: 0.7 }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[200px]">
                    <p className="text-sm font-medium mb-2 text-center">Current vs Potential Revenue</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Current",
                            current: currentMetrics.dailyRevenue,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.dailyRevenue : 0,
                          },
                          {
                            name: "Potential",
                            current: currentMetrics.potentialRevenue,
                            comparison: comparisonMode && comparisonMetrics ? comparisonMetrics.potentialRevenue : 0,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value) =>
                            value >= 1000000
                              ? `$${(value / 1000000).toFixed(0)}M`
                              : value >= 1000
                                ? `$${(value / 1000).toFixed(0)}K`
                                : `$${value}`
                          }
                        />
                        <Tooltip formatter={(value) => [`${formatCurrency(Number(value))}`, ""]} />
                        <Legend />
                        <Bar dataKey="current" name={comparisonMode ? "Scenario A" : "Revenue"}>
                          <Cell fill="#10b981" />
                          <Cell fill="#3b82f6" />
                        </Bar>
                        {comparisonMode && comparisonMetrics && (
                          <Bar dataKey="comparison" name="Scenario B">
                            <Cell fill="#f59e0b" />
                            <Cell fill="#8b5cf6" />
                          </Bar>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Current Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Capacity</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{currentMetrics.currentCapacity.toFixed(1)} customers/hour</p>
                          {comparisonMode && comparisonMetrics && (
                            <Badge
                              variant={
                                comparisonMetrics.currentCapacity > currentMetrics.currentCapacity
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {formatDifference(currentMetrics.currentCapacity, comparisonMetrics.currentCapacity)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Revenue</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{formatCurrency(currentMetrics.dailyRevenue)}</p>
                          {comparisonMode && comparisonMetrics && (
                            <Badge
                              variant={
                                comparisonMetrics.dailyRevenue > currentMetrics.dailyRevenue ? "default" : "destructive"
                              }
                              className="text-xs"
                            >
                              {formatDifference(currentMetrics.dailyRevenue, comparisonMetrics.dailyRevenue)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      Potential at {currentScenario.utilizationRate}% Utilization
                      {comparisonMode &&
                        comparisonScenario &&
                        comparisonScenario.utilizationRate !== currentScenario.utilizationRate && (
                          <span className="text-xs text-muted-foreground ml-1">
                            vs {comparisonScenario.utilizationRate}%
                          </span>
                        )}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Target Capacity</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {((currentScenario.totalCapacity * currentScenario.utilizationRate) / 100).toFixed(1)}{" "}
                            customers/hour
                          </p>
                          {comparisonMode && comparisonScenario && (
                            <Badge
                              variant={
                                (comparisonScenario.totalCapacity * comparisonScenario.utilizationRate) / 100 >
                                (currentScenario.totalCapacity * currentScenario.utilizationRate) / 100
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {formatDifference(
                                (currentScenario.totalCapacity * currentScenario.utilizationRate) / 100,
                                (comparisonScenario.totalCapacity * comparisonScenario.utilizationRate) / 100,
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Potential Daily Revenue</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{formatCurrency(currentMetrics.potentialRevenue)}</p>
                          {comparisonMode && comparisonMetrics && (
                            <Badge
                              variant={
                                comparisonMetrics.potentialRevenue > currentMetrics.potentialRevenue
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {formatDifference(currentMetrics.potentialRevenue, comparisonMetrics.potentialRevenue)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {comparisonMode && comparisonScenario && comparisonMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle>Scenario Comparison Summary</CardTitle>
                  <CardDescription>Key differences between scenarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-medium">Revenue Impact</h3>
                      <p className="text-sm text-muted-foreground">
                        {comparisonMetrics.dailyRevenue > currentMetrics.dailyRevenue ? (
                          <>
                            Scenario B generates{" "}
                            <span className="font-medium text-green-600">
                              {formatCurrency(comparisonMetrics.dailyRevenue - currentMetrics.dailyRevenue)}
                            </span>{" "}
                            more daily revenue than Scenario A.
                          </>
                        ) : comparisonMetrics.dailyRevenue < currentMetrics.dailyRevenue ? (
                          <>
                            Scenario B generates{" "}
                            <span className="font-medium text-red-600">
                              {formatCurrency(currentMetrics.dailyRevenue - comparisonMetrics.dailyRevenue)}
                            </span>{" "}
                            less daily revenue than Scenario A.
                          </>
                        ) : (
                          <>Both scenarios generate the same daily revenue.</>
                        )}
                      </p>
                    </div>

                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-medium">Capacity Utilization</h3>
                      <p className="text-sm text-muted-foreground">
                        {comparisonMetrics.capacityUtilization > currentMetrics.capacityUtilization ? (
                          <>
                            Scenario B utilizes{" "}
                            <span className="font-medium text-green-600">
                              {(comparisonMetrics.capacityUtilization - currentMetrics.capacityUtilization).toFixed(1)}%
                            </span>{" "}
                            more capacity than Scenario A.
                          </>
                        ) : comparisonMetrics.capacityUtilization < currentMetrics.capacityUtilization ? (
                          <>
                            Scenario B utilizes{" "}
                            <span className="font-medium text-red-600">
                              {(currentMetrics.capacityUtilization - comparisonMetrics.capacityUtilization).toFixed(1)}%
                            </span>{" "}
                            less capacity than Scenario A.
                          </>
                        ) : (
                          <>Both scenarios have the same capacity utilization.</>
                        )}
                      </p>
                    </div>

                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-medium">Revenue Potential</h3>
                      <p className="text-sm text-muted-foreground">
                        {comparisonMetrics.potentialRevenue > currentMetrics.potentialRevenue ? (
                          <>
                            Scenario B has{" "}
                            <span className="font-medium text-green-600">
                              {formatCurrency(comparisonMetrics.potentialRevenue - currentMetrics.potentialRevenue)}
                            </span>{" "}
                            higher potential daily revenue.
                          </>
                        ) : comparisonMetrics.potentialRevenue < currentMetrics.potentialRevenue ? (
                          <>
                            Scenario B has{" "}
                            <span className="font-medium text-red-600">
                              {formatCurrency(currentMetrics.potentialRevenue - comparisonMetrics.potentialRevenue)}
                            </span>{" "}
                            lower potential daily revenue.
                          </>
                        ) : (
                          <>Both scenarios have the same revenue potential.</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Key Parameter Differences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentScenario.hourlyRate !== comparisonScenario.hourlyRate && (
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Hourly Rate:</span>{" "}
                            {formatCurrency(currentScenario.hourlyRate)} vs{" "}
                            {formatCurrency(comparisonScenario.hourlyRate)}
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({formatDifference(currentScenario.hourlyRate, comparisonScenario.hourlyRate)})
                            </span>
                          </p>
                        </div>
                      )}

                      {currentScenario.footfall !== comparisonScenario.footfall && (
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Customer Footfall:</span> {currentScenario.footfall} vs{" "}
                            {comparisonScenario.footfall}
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({formatDifference(currentScenario.footfall, comparisonScenario.footfall)})
                            </span>
                          </p>
                        </div>
                      )}

                      {currentScenario.totalCapacity !== comparisonScenario.totalCapacity && (
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Total Capacity:</span> {currentScenario.totalCapacity} vs{" "}
                            {comparisonScenario.totalCapacity}
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({formatDifference(currentScenario.totalCapacity, comparisonScenario.totalCapacity)})
                            </span>
                          </p>
                        </div>
                      )}

                      {currentScenario.sessionDuration !== comparisonScenario.sessionDuration && (
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Session Duration:</span> {currentScenario.sessionDuration} hr
                            vs {comparisonScenario.sessionDuration} hr
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({formatDifference(currentScenario.sessionDuration, comparisonScenario.sessionDuration)})
                            </span>
                          </p>
                        </div>
                      )}

                      {currentScenario.utilizationRate !== comparisonScenario.utilizationRate && (
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Utilization Rate:</span> {currentScenario.utilizationRate}% vs{" "}
                            {comparisonScenario.utilizationRate}%
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({formatDifference(currentScenario.utilizationRate, comparisonScenario.utilizationRate)})
                            </span>
                          </p>
                        </div>
                      )}

                      {currentScenario.hoursPerDay !== comparisonScenario.hoursPerDay && (
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Hours of Operation:</span> {currentScenario.hoursPerDay} hrs
                            vs {comparisonScenario.hoursPerDay} hrs
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({formatDifference(currentScenario.hoursPerDay, comparisonScenario.hoursPerDay)})
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Recommendation</h3>
                    <p className="text-sm text-muted-foreground">
                      {comparisonMetrics.annualRevenue > currentMetrics.annualRevenue ? (
                        <>
                          Based on revenue projections, <span className="font-medium text-green-600">Scenario B</span>{" "}
                          is more profitable, generating an additional{" "}
                          <span className="font-medium">
                            {formatCurrency(comparisonMetrics.annualRevenue - currentMetrics.annualRevenue)}
                          </span>{" "}
                          in annual revenue.
                        </>
                      ) : comparisonMetrics.annualRevenue < currentMetrics.annualRevenue ? (
                        <>
                          Based on revenue projections, <span className="font-medium text-green-600">Scenario A</span>{" "}
                          is more profitable, generating an additional{" "}
                          <span className="font-medium">
                            {formatCurrency(currentMetrics.annualRevenue - comparisonMetrics.annualRevenue)}
                          </span>{" "}
                          in annual revenue.
                        </>
                      ) : (
                        <>
                          Both scenarios generate the same annual revenue, but may differ in other operational aspects.
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
