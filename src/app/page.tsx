"use client"

import { useState } from "react"
import { Calculator, DollarSign, Info, Users } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RevenueEstimator() {
  const [arpu, setArpu] = useState<number>(500)
  const [footfall, setFootfall] = useState<number>(7)
  const [sessionDuration, setSessionDuration] = useState<number>(3)
  const [utilizationRate, setUtilizationRate] = useState<number>(70)
  const [totalCapacity, setTotalCapacity] = useState<number>(150)
  const [hourlyRate, setHourlyRate] = useState<number>(300)
  const [hoursPerDay, setHoursPerDay] = useState<number>(8)

  // Calculate metrics
  const currentCapacity = (footfall * sessionDuration) / hoursPerDay
  const capacityUtilization = (currentCapacity / totalCapacity) * 100

  // Revenue calculations based on hourly rate
  const hourlyRevenue = hourlyRate * currentCapacity
  const dailyRevenue = hourlyRevenue * hoursPerDay
  const monthlyRevenue = dailyRevenue * 30
  const annualRevenue = dailyRevenue * 365

  // Potential revenue at target utilization
  const potentialRevenue = hourlyRate * ((totalCapacity * utilizationRate) / 100) * hoursPerDay

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Revenue Estimator</h1>
        <p className="text-muted-foreground max-w-2xl">
          Calculate your potential revenue based on key business metrics
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Input Parameters
              </CardTitle>
              <CardDescription>Adjust the values to see how they affect your revenue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="arpu" className="flex items-center gap-1">
                    ARPU
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">
                            Average Revenue Per User - The average amount each customer spends
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="arpu"
                      type="number"
                      value={arpu}
                      onChange={(e) => setArpu(Number(e.target.value))}
                      className="w-20 text-right"
                    />
                  </div>
                </div>
                <Slider value={[arpu]} min={1} max={200} step={1} onValueChange={(value) => setArpu(value[0])} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="footfall" className="flex items-center gap-1">
                    Customer Footfall
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">Number of customers per day</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="footfall"
                      type="number"
                      value={footfall}
                      onChange={(e) => setFootfall(Number(e.target.value))}
                      className="w-20 text-right"
                    />
                  </div>
                </div>
                <Slider
                  value={[footfall]}
                  min={1}
                  max={500}
                  step={1}
                  onValueChange={(value) => setFootfall(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sessionDuration" className="flex items-center gap-1">
                    Avg. Session Duration
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">Average time (in hours) each customer spends</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="sessionDuration"
                    type="number"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-20 text-right"
                    step={0.1}
                    min={0.1}
                  />
                </div>
                <Slider
                  value={[sessionDuration * 10]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => setSessionDuration(value[0] / 10)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="utilizationRate" className="flex items-center gap-1">
                    Capacity Utilization Rate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">Target percentage of total capacity to utilize</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="utilizationRate"
                      type="number"
                      value={utilizationRate}
                      onChange={(e) => setUtilizationRate(Number(e.target.value))}
                      className="w-20 text-right"
                      min={1}
                      max={100}
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                <Slider
                  value={[utilizationRate]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setUtilizationRate(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="totalCapacity" className="flex items-center gap-1">
                    Total Capacity
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">Maximum number of customers that can be served simultaneously</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="totalCapacity"
                    type="number"
                    value={totalCapacity}
                    onChange={(e) => setTotalCapacity(Number(e.target.value))}
                    className="w-20 text-right"
                    min={1}
                  />
                </div>
                <Slider
                  value={[totalCapacity]}
                  min={10}
                  max={500}
                  step={10}
                  onValueChange={(value) => setTotalCapacity(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hourlyRate" className="flex items-center gap-1">
                    Hourly Rate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">The rate you charge customers per hour</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-20 text-right"
                      min={1}
                    />
                  </div>
                </div>
                <Slider
                  value={[hourlyRate]}
                  min={1}
                  max={200}
                  step={1}
                  onValueChange={(value) => setHourlyRate(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hoursPerDay" className="flex items-center gap-1">
                    Hours of Operation
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">Number of hours your business operates per day</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="hoursPerDay"
                    type="number"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    className="w-20 text-right"
                    min={1}
                    max={24}
                  />
                </div>
                <Slider
                  value={[hoursPerDay]}
                  min={1}
                  max={24}
                  step={1}
                  onValueChange={(value) => setHoursPerDay(value[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  setArpu(50)
                  setFootfall(100)
                  setSessionDuration(1)
                  setUtilizationRate(70)
                  setTotalCapacity(150)
                  setHourlyRate(25)
                  setHoursPerDay(8)
                }}
                variant="outline"
              >
                Reset to Defaults
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-7">
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
                    <p className="text-2xl font-bold">{formatCurrency(dailyRevenue)}</p>
                    <p className="text-sm text-muted-foreground">Hourly: {formatCurrency(hourlyRevenue)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Monthly</p>
                    <p className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</p>
                    <p className="text-sm text-muted-foreground">(30 days)</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Annual</p>
                    <p className="text-2xl font-bold">{formatCurrency(annualRevenue)}</p>
                    <p className="text-sm text-muted-foreground">(365 days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity Analysis</CardTitle>
                <CardDescription>Current utilization and potential revenue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Utilization</span>
                    <span className="font-medium">{capacityUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${capacityUtilization > 90 ? "bg-red-500" : capacityUtilization > 70 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(capacityUtilization, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[200px]">
                    <p className="text-sm font-medium mb-2 text-center">Capacity Utilization</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Used", value: currentCapacity },
                            { name: "Available", value: Math.max(0, totalCapacity - currentCapacity) },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                        <RechartsTooltip formatter={(value) => [`${Number(value).toFixed(1)} customers/hour`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-[200px]">
                    <p className="text-sm font-medium mb-2 text-center">Current vs Potential Revenue</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Current", value: dailyRevenue },
                          { name: "Potential", value: potentialRevenue },
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
                        <RechartsTooltip formatter={(value) => [`${formatCurrency(Number(value))}`, "Revenue"]} />
                        <Bar dataKey="value" name="Daily Revenue">
                          <Cell fill="#10b981" />
                          <Cell fill="#3b82f6" />
                        </Bar>
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
                        <p className="font-medium">{currentCapacity.toFixed(1)} customers/hour</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Revenue</p>
                        <p className="font-medium">{formatCurrency(dailyRevenue)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Potential at {utilizationRate}% Utilization</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Target Capacity</p>
                        <p className="font-medium">
                          {((totalCapacity * utilizationRate) / 100).toFixed(1)} customers/hour
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Potential Daily Revenue</p>
                        <p className="font-medium">{formatCurrency(potentialRevenue)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Factors Analysis</CardTitle>
                <CardDescription>Key factors affecting your revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Current",
                          revenue: dailyRevenue,
                          hourlyRate: hourlyRate * currentCapacity * hoursPerDay,
                          capacity: currentCapacity * hourlyRate * hoursPerDay,
                        },
                        {
                          name: "Potential",
                          revenue: potentialRevenue,
                          hourlyRate: hourlyRate * ((totalCapacity * utilizationRate) / 100) * hoursPerDay,
                          capacity: ((totalCapacity * utilizationRate) / 100) * hourlyRate * hoursPerDay,
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
                      <RechartsTooltip formatter={(value) => [`${formatCurrency(Number(value))}`, ""]} />
                      <Legend />
                      <Bar dataKey="revenue" name="Total Revenue" fill="#10b981" />
                      <Bar dataKey="hourlyRate" name="Hourly Rate Impact" fill="#3b82f6" />
                      <Bar dataKey="capacity" name="Capacity Impact" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
