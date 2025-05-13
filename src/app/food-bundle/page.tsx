"use client"

import type React from "react"

import { useState, useMemo } from "react"
import {
  Pie,
  PieChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ConversionRevenueChart() {
  const [conversionRate, setConversionRate] = useState(30)
  const [averageSpending, setAverageSpending] = useState(10)
  const [discountRate, setDiscountRate] = useState(15)
  const [totalUser, setTotalUsers] = useState(10000)

  // Calculate pie chart data based on conversion rate
  const pieData = useMemo(
    () => [
      { name: "Food customers", value: conversionRate, fill: "orange" },
      { name: "Customers", value: 100 - conversionRate, fill: "purple" },
    ],
    [conversionRate],
  )

  // Calculate revenue data for bar chart
  const revenueData = useMemo(() => {
    const adoptionRate: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

    return adoptionRate.map((bundleAdoptionRate:number) => {
      const baseFoodRevenue = Math.round(totalUser * (conversionRate / 100) * averageSpending)
      const bundleFoodRevenue = Math.round(totalUser * (bundleAdoptionRate / 100) * averageSpending * (1 - discountRate /100)) // Base revenue stays constant per month

      return {
        adoptionRate: bundleAdoptionRate,
        baseFoodRevenue,
        bundleFoodRevenue,
      }
    })
  }, [totalUser, conversionRate, averageSpending, discountRate])

  const minimumAdoptionRateForProfit = useMemo(() => {
    return discountRate === 100 ? Infinity : Math.round((conversionRate / (1 - discountRate / 100)));
  }, [conversionRate, discountRate])


  const handleBaseRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setTotalUsers(value)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
          <CardDescription>Percentage of customers who convert to food purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Conversion Rate:</span>
              <span className="font-bold">{conversionRate}%</span>
            </div>
            <Slider
              value={[conversionRate]}
              onValueChange={(value) => setConversionRate(value[0])}
              min={0}
              max={100}
              step={1}
              className="mb-6"
            />

            <div className="flex justify-between mb-2">
              <span>Average Spending per Customer:</span>
              <span className="font-bold">${averageSpending}</span>
            </div>
            <Slider
              value={[averageSpending]}
              onValueChange={(value) => setAverageSpending(value[0])}
              min={5}
              max={50}
              step={1}
              className="mb-6"
            />

            <div className="mb-4">
              <Label htmlFor="baseRevenue" className="mb-2 block">
                Base Revenue (per month):
              </Label>
              <Input
                id="baseRevenue"
                type="number"
                value={totalUser}
                onChange={handleBaseRevenueChange}
                min={0}
                className="mb-2"
              />
            </div>

            <div className="flex justify-between mb-2">
              <span>Discount Rate:</span>
              <span className="font-bold">{discountRate}%</span>
            </div>
            <Slider
              value={[discountRate]}
              onValueChange={(value) => setDiscountRate(value[0])}
              min={0}
              max={100}
              step={1}
              className="mb-6"
            />
          </div>
          <div className="h-[300px]">
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
                    label={({ name }) => `${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>
            Base revenue + additional food revenue ({conversionRate}% conversion rate × ${averageSpending} per customer)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-fit w-full">
            <ChartContainer
              config={{
                baseRevenue: {
                  label: "Base Revenue",
                  color: "purple",
                },
                bundleRevenue: {
                  label: "Bundle Revenue",
                  color: "orange",
                },
                difference: {
                  label: "Revenue Difference",
                  color: "green",
                }
              }}
            >
              <ResponsiveContainer width="100%" className={"border-4"}>
                <BarChart 
                  data={revenueData.map((item, index) => ({
                    ...item,
                    adoption: `${(index + 1) * 10}%`
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="adoption" />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
                    labelFormatter={(label) => `Adoption rate: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="baseFoodRevenue" fill="purple" name="Base Revenue"/>
                  <Bar dataKey="bundleFoodRevenue" fill="orange" name="Bundle Revenue"/>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Daily evenue breakdown:</p>
            <p>Food Bundle is profitable at
               <span className={`text-green-500 text-xl font-bold px-1 ${minimumAdoptionRateForProfit<35 ? "text-gree-500":minimumAdoptionRateForProfit<65?"text-orange-500":"text-red-500"}`}>{minimumAdoptionRateForProfit.toLocaleString()}%
                </span> 
               bundle adoption rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <ConversionRevenueChart />
    </main>
  )
}