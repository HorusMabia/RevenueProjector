"use client";

import { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RevenueEstimator() {
  const [arpu, setArpu] = useState<number>(500000);
  const [footfall, setFootfall] = useState<number>(7);
  // const [foodRevenuePerCustomer, foodRevenuePerCustomer] = useState<number>(3);
  // const [utilizationRate, setUtilizationRate] = useState<number>(70);
  const [totalCapacity, setTotalCapacity] = useState<number>(20);
  // const [hourlyRate, setHourlyRate] = useState<number>(300);
  // const [foodBundleConversionRate, setFoodBundleConversionRate] = useState<number>(0);
  // const [averageFoodOrderValue, setAverageFoodOrderValue] = useState<number>(0);
  // const [foodDiscountPercentage, setFoodDiscountPercentage] = useState<number>(0);

  // Calculate metrics

  // Revenue food bundle calculations
  // const foodBundleDailyRevenue = (foodBundleConversionRate / 100) * footfall * averageFoodOrderValue * (1 - foodDiscountPercentage / 100);

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
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Card className=" border-4 border-red-500 ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Current KPIs
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
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  setArpu(500000);
                  setFootfall(5);
                  setTotalCapacity(150);
                }}
                variant="outline"
              >
                Reset to Defaults
              </Button>
            </CardFooter>
          </Card>
        </div>






        <div className="md:col-span-5">
          <Card className="border-4 border-green-500 ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Potential KPIs changes
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
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  setArpu(500000);
                  setFootfall(5);
                  setTotalCapacity(150);
                }}
                variant="outline"
              >
                Reset to Defaults
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="md:col-span-10">
        <Card>
              <CardHeader>
                <CardTitle>Revenue Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Daily
                    </p>
                    <p className="text-xl font-bold text-red-400">
                      {formatCurrency(dailyRevenue)}
                    </p>
                    <p className="text-xl font-bold text-green-400">
                      {formatCurrency(dailyRevenue)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Monthly
                    </p>
                    <p className="text-xl font-bold text-red-400">
                      {formatCurrency(monthlyRevenue)}
                    </p>
                    <p className="text-xl font-bold text-green-400">
                      {formatCurrency(dailyRevenue)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Annual
                    </p>
                    <p className="text-xl font-bold text-red-400">
                      {formatCurrency(annualRevenue)}
                    </p>
                    <p className="text-xl font-bold text-green-400">
                      {formatCurrency(dailyRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}