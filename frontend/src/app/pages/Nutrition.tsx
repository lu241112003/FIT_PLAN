import { useEffect, useMemo, useState } from "react";
import { Plus, Apple, Droplets, Flame, Search, ChevronRight, Coffee, Utensils, Moon, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useDiet } from "../../hooks/useDiet";

const macroData = [
  { name: "Protein", value: 165, color: "#6366f1", goal: 180 },
  { name: "Carbs", value: 210, color: "#f59e0b", goal: 250 },
  { name: "Fat", value: 68, color: "#22c55e", goal: 70 },
];

const pieData = [
  { name: "Protein", value: 165 * 4, color: "#6366f1" },
  { name: "Carbs", value: 210 * 4, color: "#f59e0b" },
  { name: "Fat", value: 68 * 9, color: "#22c55e" },
];

const weeklyCalories = [
  { day: "Mon", calories: 2300, goal: 2500 },
  { day: "Tue", calories: 2150, goal: 2500 },
  { day: "Wed", calories: 2480, goal: 2500 },
  { day: "Thu", calories: 2050, goal: 2500 },
  { day: "Fri", calories: 2600, goal: 2500 },
  { day: "Sat", calories: 2750, goal: 2500 },
  { day: "Sun", calories: 2145, goal: 2500 },
];

const meals = [
  {
    name: "Breakfast",
    icon: Coffee,
    time: "7:30 AM",
    calories: 480,
    color: "bg-orange-100 text-orange-600",
    items: [
      { name: "Oatmeal with berries", cal: 320, protein: 12, carbs: 58, fat: 6 },
      { name: "Greek yogurt", cal: 130, protein: 15, carbs: 8, fat: 3 },
      { name: "Black coffee", cal: 5, protein: 0, carbs: 0, fat: 0 },
    ],
  },
  {
    name: "Lunch",
    icon: Utensils,
    time: "12:30 PM",
    calories: 720,
    color: "bg-green-100 text-green-600",
    items: [
      { name: "Grilled chicken breast", cal: 280, protein: 52, carbs: 0, fat: 7 },
      { name: "Brown rice (150g)", cal: 185, protein: 4, carbs: 38, fat: 1.5 },
      { name: "Mixed vegetables", cal: 95, protein: 4, carbs: 18, fat: 1 },
      { name: "Olive oil dressing", cal: 160, protein: 0, carbs: 0, fat: 18 },
    ],
  },
  {
    name: "Snack",
    icon: Apple,
    time: "4:00 PM",
    calories: 210,
    color: "bg-blue-100 text-blue-600",
    items: [
      { name: "Protein shake", cal: 150, protein: 25, carbs: 8, fat: 3 },
      { name: "Banana", cal: 90, protein: 1, carbs: 23, fat: 0 },
    ],
  },
  {
    name: "Dinner",
    icon: Moon,
    time: "7:00 PM",
    calories: 0,
    color: "bg-purple-100 text-purple-600",
    items: [],
    upcoming: true,
  },
];

const suggestions = [
  { name: "Salmon fillet (150g)", cal: 280, protein: 35, img: "🐟" },
  { name: "Quinoa (100g)", cal: 120, protein: 4, img: "🌾" },
  { name: "Broccoli (200g)", cal: 68, protein: 5, img: "🥦" },
  { name: "Almonds (30g)", cal: 173, protein: 6, img: "🥜" },
];

export default function Nutrition() {
  const [water, setWater] = useState(6);
  const { plans, isLoading, error, getUserPlans, createPlan, deletePlan } = useDiet();

  useEffect(() => {
    void getUserPlans();
  }, [getUserPlans]);

  const handleCreatePlan = async () => {
    const nome = window.prompt("Nome do plano alimentar:");
    if (!nome) return;

    const objetivo = window.prompt(
      "Objetivo (manutencao, emagrecimento, hipertrofia, condicionamento):",
      "manutencao"
    );
    if (!objetivo) return;

    const calorias = window.prompt("Calorias alvo (kcal):", "2000");
    if (!calorias) return;

    await createPlan({
      nome,
      objetivo,
      calorias_alvo: Number(calorias),
    });
  };

  const handleDeletePlan = async (planId: string) => {
    const confirmed = window.confirm("Deseja realmente deletar este plano alimentar?");
    if (!confirmed) return;
    await deletePlan(planId);
  };

  const displayPlans = useMemo(() => {
    if (plans.length > 0) {
      return plans.map((plan) => ({
        id: plan.id,
        name: plan.nome || "Plano sem nome",
        cal: plan.calorias_alvo || 0,
        protein: 0,
        tag: plan.objetivo || "manutencao",
      }));
    }

    return [
      {
        id: "demo-1",
        name: "Muscle Building",
        cal: 2800,
        protein: 200,
        tag: "High Protein",
      },
      {
        id: "demo-2",
        name: "Fat Loss",
        cal: 1800,
        protein: 160,
        tag: "Calorie Deficit",
      },
      {
        id: "demo-3",
        name: "Performance",
        cal: 3000,
        protein: 180,
        tag: "High Carb",
      },
    ];
  }, [plans]);

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const calorieGoal = plans[0]?.calorias_alvo ?? 2500;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Nutrition</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Today · Wednesday, April 8, 2026
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreatePlan}>
          <Plus className="w-4 h-4" /> Log Food
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      ) : null}

      {/* Daily Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative">
                <PieChart width={120} height={120}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={56}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [`${Math.round(v / (v === pieData[2].value ? 9 : 4))}g`, ""]}
                  />
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold">{totalCalories}</span>
                  <span className="text-[10px] text-muted-foreground">kcal</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {macroData.map((macro) => (
                  <div key={macro.name}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-muted-foreground">{macro.name}</span>
                      <span className="font-medium">
                        {macro.value}g / {macro.goal}g
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(macro.value / macro.goal) * 100}%`,
                          backgroundColor: macro.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-semibold text-foreground">
                      {calorieGoal - totalCalories} kcal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Water Tracker */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Hydration</CardTitle>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-3xl font-semibold text-foreground">{water * 250}ml</p>
              <p className="text-sm text-muted-foreground">of 3,000ml goal</p>
              <Progress value={(water / 12) * 100} className="mt-2 h-2.5" />
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWater(i < water ? i : i + 1)}
                  className={`h-8 rounded-lg transition-colors ${
                    i < water
                      ? "bg-blue-500 text-white"
                      : "bg-blue-50 text-blue-300"
                  }`}
                >
                  <Droplets className="w-4 h-4 mx-auto" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setWater(Math.max(0, water - 1))}
              >
                -250ml
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setWater(Math.min(12, water + 1))}
              >
                +250ml
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Calories */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weeklyCalories}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#030213" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#030213" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#717182" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#717182" }} axisLine={false} tickLine={false} width={35} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                  formatter={(v) => [`${v} kcal`, "Calories"]}
                />
                <Area type="monotone" dataKey="calories" stroke="#030213" strokeWidth={2} fill="url(#calGrad)" />
                <Area type="monotone" dataKey="goal" stroke="#e5e7eb" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="meals">
        <TabsList className="mb-4">
          <TabsTrigger value="meals">Today's Meals</TabsTrigger>
          <TabsTrigger value="log">Food Log</TabsTrigger>
          <TabsTrigger value="plans">Meal Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-4">
          {meals.map((meal) => (
            <Card key={meal.name} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${meal.color} flex items-center justify-center shrink-0`}
                  >
                    <meal.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">{meal.name}</h3>
                      {meal.upcoming ? (
                        <Badge variant="outline" className="text-xs">Upcoming</Badge>
                      ) : (
                        <span className="text-sm font-semibold text-foreground">{meal.calories} kcal</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{meal.time}</p>
                  </div>
                </div>
              </CardHeader>
              {!meal.upcoming ? (
                <CardContent className="pt-0">
                  <div className="space-y-1.5">
                    {meal.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                      >
                        <span className="text-sm text-foreground">{item.name}</span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="hidden sm:inline">{item.protein}g P</span>
                          <span className="hidden sm:inline">{item.carbs}g C</span>
                          <span className="hidden sm:inline">{item.fat}g F</span>
                          <span className="font-medium text-foreground">{item.cal} kcal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs gap-1 w-full">
                    <Plus className="w-3 h-3" /> Add food to {meal.name}
                  </Button>
                </CardContent>
              ) : (
                <CardContent className="pt-0">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">No foods logged yet</p>
                    <Button size="sm" className="gap-2 h-7 text-xs">
                      <Plus className="w-3 h-3" /> Log Dinner
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Suggestions */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Suggested for Dinner</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {suggestions.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="text-2xl mb-1.5">{item.img}</div>
                    <p className="text-xs font-medium text-foreground leading-snug">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.cal} kcal</p>
                    <p className="text-[10px] text-muted-foreground">{item.protein}g protein</p>
                    <Button size="sm" variant="ghost" className="h-6 w-full mt-2 text-xs gap-1">
                      <Plus className="w-3 h-3" /> Add
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search food database..." className="pl-9" />
            </div>
            <div className="space-y-2">
              {[
                { name: "Chicken Breast (100g)", cal: 165, protein: 31, carbs: 0, fat: 3.6 },
                { name: "Brown Rice (100g)", cal: 123, protein: 2.7, carbs: 25, fat: 1 },
                { name: "Whey Protein Shake", cal: 150, protein: 25, carbs: 8, fat: 3 },
                { name: "Eggs (2 large)", cal: 156, protein: 12, carbs: 1.2, fat: 11 },
                { name: "Avocado (100g)", cal: 160, protein: 2, carbs: 9, fat: 15 },
              ].map((food, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{food.name}</p>
                    <p className="text-xs text-muted-foreground">
                      P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{food.cal} cal</span>
                  <Button size="sm" className="h-7 text-xs gap-1">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans">
          {isLoading ? <p className="text-sm text-muted-foreground mb-3">Carregando planos...</p> : null}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPlans.map((plan, index) => (
              <Card key={plan.name} className="border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-32 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1606859191214-25806e8e2423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" alt={plan.name} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 ${["bg-purple-600", "bg-orange-600", "bg-green-600"][index % 3]} opacity-60`} />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <h3 className="text-white font-semibold">{plan.name}</h3>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs w-fit mt-1">
                      {plan.tag}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{plan.cal} kcal/day</span>
                    <span className="text-muted-foreground">{plan.protein}g protein</span>
                  </div>
                  {String(plan.id).startsWith("demo-") ? (
                    <Button size="sm" className="w-full mt-3 h-8 text-xs gap-1">
                      Apply Plan <ChevronRight className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full mt-3 h-8 text-xs gap-1"
                      onClick={() => handleDeletePlan(String(plan.id))}
                    >
                      <Trash2 className="w-3 h-3" /> Delete Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
