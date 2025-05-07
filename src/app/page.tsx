"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeIndianRupee, Calculator, Info, Users } from "lucide-react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

export default function RevenueEstimator() {
  const [arpu, setArpu] = useState<number>(500000);
  const [footfall, setFootfall] = useState<number>(7);
  const [sessionDuration, setSessionDuration] = useState<number>(3);
  const [utilizationRate, setUtilizationRate] = useState<number>(70);
  const [totalCapacity, setTotalCapacity] = useState<number>(20);
  const [hourlyRate, setHourlyRate] = useState<number>(300);
  const [foodBundleConversionRate, setFoodBundleConversionRate] =
    useState<number>(0);
  const [averageFoodOrderValue, setAverageFoodOrderValue] = useState<number>(0);
  const [foodDiscountPercentage, setFoodDiscountPercentage] =
    useState<number>(0);

  // Calculate metrics

  // Revenue food bundle calculations
  const foodBundleDailyRevenue =
    (foodBundleConversionRate / 100) * footfall * averageFoodOrderValue * (1 - foodDiscountPercentage / 100);

  // Revenue calculations based on hourly rate
  const dailyRevenue = arpu * footfall;
  const monthlyRevenue = dailyRevenue * 30;
  const annualRevenue = arpu * footfall * 365;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto pb-10 px-4 max-w-5xl">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}
          height={400}
          className="m-0 p-0 "
        />
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Input Parameters
              </CardTitle>
              <CardDescription>
                Adjust the values to see how they affect your revenue
              </CardDescription>
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
                            Average Revenue Per User - The average amount each
                            customer spends
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center gap-2">
                    <BadgeIndianRupee className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="arpu"
                      type="number"
                      value={arpu}
                      placeholder={formatCurrency(arpu)}
                      onChange={(e) => setArpu(Number(e.target.value))}
                      className="w-32 text-right"
                    />
                  </div>
                </div>
                <Slider
                  value={[arpu]}
                  min={70000}
                  max={10000000}
                  step={1}
                  onValueChange={(value) => setArpu(value[0])}
                />
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
                          <p className="w-[200px]">
                            Number of customers per day
                          </p>
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
                  max={totalCapacity}
                  step={1}
                  onValueChange={(value) => setFootfall(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="sessionDuration"
                    className="flex items-center gap-1"
                  >
                    Avg. Session Duration
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">
                            Average time (in hours) each customer spends
                          </p>
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
                    max={10}
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
                  <Label
                    htmlFor="utilizationRate"
                    className="flex items-center gap-1"
                  >
                    Capacity Utilization Rate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">
                            Target percentage of total capacity to utilize
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="utilizationRate"
                      type="number"
                      value={utilizationRate}
                      onChange={(e) =>
                        setUtilizationRate(Number(e.target.value))
                      }
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
                  <Label
                    htmlFor="totalCapacity"
                    className="flex items-center gap-1"
                  >
                    Total Capacity
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">
                            Maximum number of customers that can be served
                            simultaneously
                          </p>
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
                    max={20}
                  />
                </div>
                <Slider
                  value={[totalCapacity]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(value) => setTotalCapacity(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="hourlyRate"
                    className="flex items-center gap-1"
                  >
                    Hourly Rate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">
                            The rate you charge customers per hour
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center gap-2">
                    <BadgeIndianRupee className="h-4 w-4 text-muted-foreground" />
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
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  setArpu(500000);
                  setFootfall(5);
                  setSessionDuration(3);
                  setUtilizationRate(70);
                  setTotalCapacity(150);
                  setHourlyRate(25);
                }}
                variant="outline"
              >
                Reset to Defaults
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-7">
          <div className="grid gap-4">
            <Tabs
              defaultValue="FoodBundle"
              className="w-full text-white  rounded-lg"
            >
              <TabsList className="grid w-full gap-x-2 grid-cols-3 mb-2">
                <TabsTrigger
                  value="FoodBundle"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-white/60 data-[state=inactive]:text-gray-900 transition-all duration-200 font-medium py-2 rounded-md"
                >
                  Food Bundle
                </TabsTrigger>
                <TabsTrigger
                  value="ReturningCustomers"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-white/60 data-[state=inactive]:text-gray-900 transition-all duration-200 font-medium py-2 rounded-md"
                >
                  Returning Customers
                </TabsTrigger>
                <TabsTrigger
                  value="PriceAdjustment"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-white/60 data-[state=inactive]:text-gray-900 transition-all duration-200 font-medium py-2 rounded-md"
                >
                  Price adjustment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="FoodBundle">
                <Card>
                  <CardHeader>
                    <CardTitle>Food Bundle parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center w-full justify-between space-y-2">
                      <div className="flex w-full items-center justify-between">
                        <Label
                          htmlFor="ConversionRate"
                          className="flex w-86 items-center gap-1"
                        >
                          Conversion Rate
                        </Label>
                        <Slider
                          value={[foodBundleConversionRate]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) =>
                            setFoodBundleConversionRate(value[0])
                          }
                          className="px-2"
                        />
                        <div className="flex items-center px-2">
                          {/* <Input
                            id="hourlyRate"
                            value={foodBundleConversionRate}
                            onChange={(e) =>
                              setHourlyRate(Number(e.target.value))
                            }
                            className="w-22 text-right"
                            min={0}
                          /> */}
                          <p className="w-22 text-right border-1 p-1 rounded-sm">{foodBundleConversionRate}</p>
                          <span className="ml-1">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center w-full justify-between space-y-2">
                      <div className="flex w-full items-center justify-between">
                        <Label
                          htmlFor="ConversionRate"
                          className="flex w-86 items-center gap-1"
                        >
                          Average Order Value
                        </Label>
                        <Slider
                          value={[averageFoodOrderValue]}
                          min={0}
                          max={1000000}
                          step={20000}
                          onValueChange={(value) =>
                            setAverageFoodOrderValue(value[0])
                          }
                          className="px-2"
                        />
                        <div className="flex items-center px-2">
                          <Input
                            id="hourlyRate"
                            value={averageFoodOrderValue}
                            onChange={(e) =>
                              setHourlyRate(Number(e.target.value))
                            }
                            className="w-22 text-right"
                            min={0}
                          />
                          <BadgeIndianRupee className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center w-full justify-between space-y-2">
                      <Label className="text-sm w-full">
                        Discount percentage on food bundle
                      </Label>
                      <Input
                        id="DiscountPercentage"
                        value={foodDiscountPercentage}
                        onChange={(e) =>
                          setFoodDiscountPercentage(Number(e.target.value))
                        }
                        className="w-22 text-right"
                        placeholder="Discount Percentage"
                        min={0}
                        max={100}
                      />
                      <span className="ml-1">%</span>
                    </div>
                    <CardFooter>
                      <div className="flex w-full justify-end text-green-500">
                        <div className="flex gap-x-2 items-center">
                          <p className="text-sm font-bold">{`+ ${formatCurrency(
                            foodBundleDailyRevenue
                          )}`}</p>
                        </div>
                      </div>
                    </CardFooter>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ReturningCustomers">
                <Card>
                  <CardHeader>
                    <CardTitle>Coming soon...</CardTitle>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="PriceAdjustment">
                <Card>
                  <CardHeader>
                    <CardTitle>Coming soon...</CardTitle>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>

            {/* <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>
                  Current revnue and potential revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[200px]">
                    <p className="text-sm font-medium mb-2 text-center">
                      Revenue increase distribution
                    </p>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Foodbundle", value: currentCapacity },
                            {
                              name: "Available",
                              value: Math.max(
                                0,
                                totalCapacity - currentCapacity
                              ),
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                        <RechartsTooltip
                          formatter={(value) => [
                            `${Number(value).toFixed(1)} customers/hour`,
                            "",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-[200px]">
                    <p className="text-sm font-medium mb-2 text-center">
                      Current vs Potential Revenue
                    </p>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Current", value: annualRevenue },
                          { name: "Potential", value: potentialAnnualRevenue },
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
                        <RechartsTooltip
                          formatter={(value) => [
                            `${formatCurrency(Number(value))}`,
                            "Revenue",
                          ]}
                        />
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
                    <h4 className="text-sm font-medium mb-1">
                      Current Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Capacity
                        </p>
                        <p className="font-medium">
                          {currentCapacity.toFixed(1)} customers/hour
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Daily Revenue
                        </p>
                        <p className="font-medium">
                          {formatCurrency(dailyRevenue)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      Potential at {utilizationRate}% Utilization
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Target Capacity
                        </p>
                        <p className="font-medium">
                          {((totalCapacity * utilizationRate) / 100).toFixed(1)}{" "}
                          customers/hour
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Potential Daily Revenue
                        </p>
                        <p className="font-medium">
                          {formatCurrency(potentialAnnualRevenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle>Revenue Projections</CardTitle>
                <CardDescription>
                  Based on your input parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Daily
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(dailyRevenue)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Monthly
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(monthlyRevenue)}
                    </p>
                    <p className="text-sm text-muted-foreground">(30 days)</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Annual
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(annualRevenue)}
                    </p>
                    <p className="text-sm text-muted-foreground">(365 days)</p>
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
