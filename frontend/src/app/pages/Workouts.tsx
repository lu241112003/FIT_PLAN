import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Flame,
  Dumbbell,
  Play,
  Plus,
  Star,
  Users,
  ChevronRight,
  Filter,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { useWorkout } from "../../hooks/useWorkout";

const workoutPlans = [
  {
    id: 1,
    name: "Push Pull Legs",
    category: "Strength",
    duration: "60 min",
    calories: "450-550",
    level: "Intermediate",
    days: 6,
    rating: 4.8,
    enrolled: 2341,
    progress: 35,
    image:
      "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    color: "from-purple-900/70",
    tags: ["Hypertrophy", "Muscle Gain"],
    active: true,
  },
  {
    id: 2,
    name: "HIIT Cardio Blast",
    category: "HIIT",
    duration: "30 min",
    calories: "300-400",
    level: "Advanced",
    days: 4,
    rating: 4.6,
    enrolled: 1820,
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1724763750965-e61e1fe6a540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    color: "from-red-900/70",
    tags: ["Fat Loss", "Endurance"],
    active: false,
  },
  {
    id: 3,
    name: "Morning Yoga Flow",
    category: "Yoga",
    duration: "45 min",
    calories: "150-200",
    level: "Beginner",
    days: 5,
    rating: 4.9,
    enrolled: 3102,
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1767611125032-20b291ec1c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    color: "from-teal-900/70",
    tags: ["Flexibility", "Mindfulness"],
    active: false,
  },
  {
    id: 4,
    name: "Cycling Intervals",
    category: "Cardio",
    duration: "45 min",
    calories: "400-500",
    level: "Intermediate",
    days: 3,
    rating: 4.7,
    enrolled: 987,
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1635706055150-5827085ca635?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    color: "from-blue-900/70",
    tags: ["Endurance", "Cardio"],
    active: false,
  },
  {
    id: 5,
    name: "Swim & Tone",
    category: "Cardio",
    duration: "50 min",
    calories: "350-450",
    level: "Intermediate",
    days: 3,
    rating: 4.5,
    enrolled: 654,
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1762392050946-685f2dec9da7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    color: "from-cyan-900/70",
    tags: ["Full Body", "Low Impact"],
    active: false,
  },
  {
    id: 6,
    name: "Upper Body Blitz",
    category: "Strength",
    duration: "50 min",
    calories: "380-450",
    level: "Intermediate",
    days: 4,
    rating: 4.7,
    enrolled: 1456,
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1766287453739-c3ffc3f37d05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    color: "from-gray-900/70",
    tags: ["Strength", "Muscle Gain"],
    active: false,
  },
];

const categories = ["All", "Strength", "Cardio", "HIIT", "Yoga"];
const levelColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function Workouts() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { plans, isLoading, error, getUserPlans, createPlan, deletePlan } = useWorkout();

  useEffect(() => {
    void getUserPlans();
  }, [getUserPlans]);

  const filtered =
    selectedCategory === "All"
      ? workoutPlans
      : workoutPlans.filter((workout) => workout.category === selectedCategory);

  const mySchedule = useMemo(() => {
    if (plans.length > 0) {
      return plans.map((plan, index) => ({
        id: plan.id,
        name: plan.nome || "Plano sem nome",
        type: `Plano ${index + 1}`,
        exercises: plan.sessoes?.length ?? 0,
        duration: `${plan.duracao_semanas} semanas`,
        goal: plan.objetivo || "manutencao",
      }));
    }

    return [
      {
        id: "demo-1",
        name: "Chest & Triceps",
        type: "Today",
        exercises: 5,
        duration: "55 min",
        goal: "hipertrofia",
      },
      {
        id: "demo-2",
        name: "Back & Biceps",
        type: "Tomorrow",
        exercises: 6,
        duration: "60 min",
        goal: "condicionamento",
      },
    ];
  }, [plans]);

  const handleCreatePlan = async () => {
    const nome = window.prompt("Nome do plano de treino:");
    if (!nome) return;

    const objetivo = window.prompt(
      "Objetivo (manutencao, emagrecimento, hipertrofia, condicionamento):",
      "hipertrofia"
    );
    if (!objetivo) return;

    const nivel = window.prompt("Nivel (iniciante, intermediario, avancado):", "iniciante");
    if (!nivel) return;

    const semanas = window.prompt("Duracao (semanas):", "8");
    if (!semanas) return;

    await createPlan({
      nome,
      objetivo,
      nivel,
      duracao_semanas: Number(semanas),
    });
  };

  const handleDeletePlan = async (planId: string) => {
    const confirmed = window.confirm("Deseja realmente deletar este plano de treino?");
    if (!confirmed) return;
    await deletePlan(planId);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Workout Plans</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Discover and manage your training programs
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreatePlan}>
          <Plus className="w-4 h-4" /> Create Plan
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      ) : null}

      <Tabs defaultValue="discover">
        <TabsList className="mb-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-workouts">My Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <Card className="border-border bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-48 md:h-40">
                <img
                  src={workoutPlans[0].image}
                  alt="Active plan"
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between h-full">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-2 text-xs">
                      Currently Active
                    </Badge>
                    <h3 className="text-lg font-semibold">Push Pull Legs</h3>
                    <p className="text-sm opacity-75 mt-0.5">Week 3 of 12 · 35% complete</p>
                    <Progress value={35} className="mt-2 h-1.5 w-48 bg-white/20 [&>div]:bg-white" />
                  </div>
                  <Button size="sm" className="bg-white text-primary hover:bg-white/90 mt-4 sm:mt-0 w-fit gap-2">
                    <Play className="w-3 h-3" /> Continue Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((plan) => (
              <Card
                key={plan.id}
                className="border-border overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative h-44">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-linear-to-t ${plan.color} to-transparent`} />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        {plan.category}
                      </Badge>
                      <Badge className={`text-xs ${levelColors[plan.level]}`}>{plan.level}</Badge>
                    </div>
                    <h3 className="text-white font-semibold">{plan.name}</h3>
                  </div>
                  {plan.active ? (
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white" />
                  ) : null}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {plan.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> {plan.calories} cal
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5" /> {plan.days}x/week
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {plan.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {plan.enrolled.toLocaleString()} enrolled
                    </span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {plan.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full h-8 text-xs gap-1" variant={plan.active ? "outline" : "default"}>
                    {plan.active ? (
                      <>
                        View Progress <ChevronRight className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Start Plan <Play className="w-3 h-3" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-workouts" className="space-y-4">
          {isLoading ? <p className="text-sm text-muted-foreground">Carregando seus planos...</p> : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySchedule.map((workout) => (
              <Card key={workout.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{workout.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {workout.exercises} sessoes · {workout.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs mb-1 block">
                        {workout.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 h-8 text-xs gap-1">
                      <Play className="w-3 h-3" /> Start
                    </Button>
                    {String(workout.id).startsWith("demo-") ? (
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                        Edit
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 h-8 text-xs gap-1"
                        onClick={() => handleDeletePlan(String(workout.id))}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full gap-2" onClick={handleCreatePlan}>
            <Plus className="w-4 h-4" /> Add Workout to Schedule
          </Button>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-3">
            {[
              { date: "Mon, Apr 7", name: "Chest & Triceps", duration: "52 min", calories: 380, exercises: 5 },
              { date: "Sat, Apr 5", name: "Leg Day", duration: "68 min", calories: 510, exercises: 7 },
              { date: "Thu, Apr 3", name: "Back & Biceps", duration: "60 min", calories: 440, exercises: 6 },
              { date: "Tue, Apr 1", name: "HIIT Cardio", duration: "32 min", calories: 380, exercises: 8 },
              { date: "Mon, Mar 31", name: "Shoulders & Core", duration: "48 min", calories: 310, exercises: 5 },
            ].map((session, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{session.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.exercises} exercises · {session.duration} · {session.calories} cal
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{session.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
