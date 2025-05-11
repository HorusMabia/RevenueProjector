"use client"

import { useMemo, useState } from "react"
import { Calculator, DollarSign, Users } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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

  const pieData = useMemo(
    () => [
      { name: "Converting", value: 50, fill: "hsl(var(--chart-1))" },
      { name: "Non-Converting", value: 100 - 50, fill: "hsl(var(--chart-2))" },
    ],
    [],
  )

  // Calculate metrics for current scenario
  const currentMetrics = calculateMetrics(currentScenario)

  return (
    <div className="text-white mx-auto py-10 px-4 max-w-5xl">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Revenue Estimator</h1>
        <p className="text-muted-foreground max-w-2xl">
          Calculate your potential revenue based on key business metrics
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {"Input Parameters"}
            </CardTitle>
            <CardDescription>
              {"Adjust the values to see how they affect your revenue"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="arpu" className="flex items-center gap-1">
                  ARPU
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
        <div className="col-span-2 flex flex-col gap-y-2">
          <div className="h-fit">
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
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hourly: {formatCurrency(currentMetrics.hourlyRevenue)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Monthly</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{formatCurrency(currentMetrics.monthlyRevenue)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">(30 days)</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Annual</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{formatCurrency(currentMetrics.annualRevenue)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">(365 days)</p>
                </div>
              </div>

              <Tabs className="hidden" defaultValue="bar">
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
                        },
                        {
                          name: "Monthly",
                          current: currentMetrics.monthlyRevenue,
                        },
                        {
                          name: "Annual",
                          current: currentMetrics.annualRevenue,
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
                      <Bar dataKey="current" name={"Revenue"} fill="#10b981" />
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
                        },
                        {
                          name: "Day 7",
                          current: currentMetrics.dailyRevenue * 7,
                        },
                        {
                          name: "Day 30",
                          current: currentMetrics.monthlyRevenue,
                        },
                        {
                          name: "Day 90",
                          current: currentMetrics.monthlyRevenue * 3,
                        },
                        {
                          name: "Day 180",
                          current: currentMetrics.monthlyRevenue * 6,
                        },
                        {
                          name: "Day 365",
                          current: currentMetrics.annualRevenue,
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
                        name={"Revenue"}
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          </div>
          
          <div className="h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Current revenue and potential revenue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2 bg-purple-300">
                      <ChartContainer
                        config={{
                          converting: {
                            label: "Converting",
                            color: "hsl(var(--chart-1))",
                          },
                          nonConverting: {
                            label: "Non-Converting",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      </div>
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
                          },
                          {
                            name: "Potential",
                            current: currentMetrics.potentialRevenue,
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
                        <Bar dataKey="current" name={"Revenue"}>
                          <Cell fill="#10b981" />
                          <Cell fill="#3b82f6" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
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
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Revenue</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{formatCurrency(currentMetrics.dailyRevenue)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      Potential at {currentScenario.utilizationRate}% Utilization
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Target Capacity</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {((currentScenario.totalCapacity * currentScenario.utilizationRate) / 100).toFixed(1)}{" "}
                            customers/hour
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Potential Daily Revenue</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{formatCurrency(currentMetrics.potentialRevenue)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
