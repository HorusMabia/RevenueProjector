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
  const [averageSpending, setAverageSpending] = useState(50)
  const [baseRevenue, setBaseRevenue] = useState(10000)

  // Calculate pie chart data based on conversion rate
  const pieData = useMemo(
    () => [
      { name: "Converting", value: conversionRate, fill: "blue" },
      { name: "Non-Converting", value: 100 - conversionRate, fill: "turquoise" },
    ],
    [conversionRate],
  )

  // Calculate revenue data for bar chart
  const revenueData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const baseCustomers = 1000
    const monthlyGrowth = 0.05

    return months.map((month, index) => {
      const customers = Math.round(baseCustomers * Math.pow(1 + monthlyGrowth, index))
      const foodRevenue = Math.round(customers * (conversionRate / 100) * averageSpending)
      const monthlyBaseRevenue = baseRevenue // Base revenue stays constant per month

      return {
        month,
        customers,
        baseRevenue: monthlyBaseRevenue,
        foodRevenue: foodRevenue,
        totalRevenue: monthlyBaseRevenue + foodRevenue,
      }
    })
  }, [conversionRate, averageSpending, baseRevenue])

  const handleBaseRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setBaseRevenue(value)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
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
              min={10}
              max={200}
              step={5}
              className="mb-6"
            />

            <div className="mb-4">
              <Label htmlFor="baseRevenue" className="mb-2 block">
                Base Revenue (per month):
              </Label>
              <Input
                id="baseRevenue"
                type="number"
                value={baseRevenue}
                onChange={handleBaseRevenueChange}
                min={0}
                className="mb-2"
              />
            </div>
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>
            Base revenue + additional food revenue ({conversionRate}% conversion rate × ${averageSpending} per customer)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                baseRevenue: {
                  label: "Base Revenue",
                  color: "hsl(var(--chart-3))",
                },
                foodRevenue: {
                  label: "Food Revenue",
                  color: "hsl(var(--chart-4))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="baseRevenue" stackId="a" fill="hsl(var(--chart-3))" name="Base Revenue" />
                  <Bar dataKey="foodRevenue" stackId="a" fill="hsl(var(--chart-4))" name="Food Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Revenue breakdown for {revenueData[0].month}:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Base revenue: ${baseRevenue.toLocaleString()}</li>
              <li>
                Food revenue: ${revenueData[0].foodRevenue.toLocaleString()}({conversionRate}% of{" "}
                {revenueData[0].customers.toLocaleString()} customers × ${averageSpending})
              </li>
              <li>Total revenue: ${revenueData[0].totalRevenue.toLocaleString()}</li>
              <li>
                Food revenue contribution:{" "}
                {((revenueData[0].foodRevenue / revenueData[0].totalRevenue) * 100).toFixed(1)}% of total
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Conversion Rate & Revenue Dashboard</h1>
      <p className="text-gray-500 mb-8 text-center max-w-2xl mx-auto">
        Adjust the conversion rate slider to see how different conversion rates affect your projected revenue.
      </p>
      <ConversionRevenueChart />
    </main>
  )
}