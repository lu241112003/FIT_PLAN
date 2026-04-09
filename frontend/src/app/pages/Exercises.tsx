import { useState } from "react";
import { Search, Filter, Bookmark, ChevronRight, Play, Dumbbell } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

const muscleGroups = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Core", "Glutes"];
const equipment = ["All", "Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight", "Resistance Band"];

const exercises = [
  {
    id: 1,
    name: "Bench Press",
    muscle: "Chest",
    secondaryMuscle: "Triceps, Shoulders",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: "3-5",
    reps: "5-8",
    emoji: "🏋️",
    color: "bg-purple-100",
    description:
      "The bench press is a compound push exercise that targets the pectoralis major, anterior deltoid, and triceps brachii.",
    tips: [
      "Keep your feet flat on the floor",
      "Maintain a slight arch in your lower back",
      "Grip the bar slightly wider than shoulder-width",
      "Lower the bar to your mid-chest",
    ],
  },
  {
    id: 2,
    name: "Pull-Up",
    muscle: "Back",
    secondaryMuscle: "Biceps, Core",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: "3-4",
    reps: "6-10",
    emoji: "🤸",
    color: "bg-blue-100",
    description:
      "The pull-up is a closed-chain movement where the body is suspended by the hands and pulled up.",
    tips: [
      "Start from a dead hang",
      "Pull your elbows toward your hips",
      "Squeeze your shoulder blades at the top",
      "Lower yourself slowly under control",
    ],
  },
  {
    id: 3,
    name: "Squat",
    muscle: "Legs",
    secondaryMuscle: "Glutes, Core",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: "4-5",
    reps: "5-8",
    emoji: "🦵",
    color: "bg-green-100",
    description:
      "The squat is a compound, full body exercise that primarily targets the muscles of the thighs, hips and buttocks.",
    tips: [
      "Keep chest up and core braced",
      "Knees tracking over toes",
      "Break parallel for full range of motion",
      "Drive through your heels",
    ],
  },
  {
    id: 4,
    name: "Overhead Press",
    muscle: "Shoulders",
    secondaryMuscle: "Triceps, Core",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: "3-4",
    reps: "6-10",
    emoji: "⬆️",
    color: "bg-orange-100",
    description:
      "The overhead press is a compound push exercise that targets the deltoids, upper trapezius, and triceps.",
    tips: [
      "Start with bar at shoulder height",
      "Press the bar overhead in a straight line",
      "Lock out arms at the top",
      "Keep core tight throughout",
    ],
  },
  {
    id: 5,
    name: "Deadlift",
    muscle: "Back",
    secondaryMuscle: "Legs, Core, Glutes",
    equipment: "Barbell",
    difficulty: "Advanced",
    sets: "3-5",
    reps: "3-6",
    emoji: "💪",
    color: "bg-red-100",
    description:
      "The deadlift is a weight training exercise in which a loaded barbell is lifted off the ground to the level of the hips.",
    tips: [
      "Keep the bar close to your body",
      "Maintain a neutral spine",
      "Drive your feet through the floor",
      "Squeeze glutes at lockout",
    ],
  },
  {
    id: 6,
    name: "Bicep Curl",
    muscle: "Biceps",
    secondaryMuscle: "Forearms",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    sets: "3-4",
    reps: "10-15",
    emoji: "💪",
    color: "bg-yellow-100",
    description:
      "The bicep curl is an isolation exercise that targets the biceps brachii and the muscles of the forearm.",
    tips: [
      "Keep elbows tucked at sides",
      "Squeeze biceps at the top",
      "Lower slowly to starting position",
      "Avoid swinging the body",
    ],
  },
  {
    id: 7,
    name: "Tricep Dip",
    muscle: "Triceps",
    secondaryMuscle: "Chest, Shoulders",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: "3-4",
    reps: "8-12",
    emoji: "🏋️",
    color: "bg-indigo-100",
    description:
      "The tricep dip is a bodyweight exercise targeting the triceps brachii, with secondary involvement of chest and anterior deltoids.",
    tips: [
      "Keep body close to the bench/bars",
      "Lower until upper arms are parallel",
      "Don't flare elbows outward",
      "Press through the palms to rise",
    ],
  },
  {
    id: 8,
    name: "Plank",
    muscle: "Core",
    secondaryMuscle: "Shoulders, Glutes",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: "3-4",
    reps: "30-60s",
    emoji: "🧘",
    color: "bg-teal-100",
    description:
      "The plank is an isometric core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time.",
    tips: [
      "Keep body in a straight line",
      "Engage core and glutes",
      "Don't let hips sag or rise",
      "Breathe steadily throughout",
    ],
  },
  {
    id: 9,
    name: "Hip Thrust",
    muscle: "Glutes",
    secondaryMuscle: "Hamstrings, Core",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: "3-4",
    reps: "10-15",
    emoji: "🍑",
    color: "bg-pink-100",
    description:
      "The hip thrust is a strength training exercise that primarily targets the gluteus maximus and secondarily the hamstrings.",
    tips: [
      "Place bar across hip crease",
      "Drive hips straight up",
      "Squeeze glutes at the top",
      "Keep chin tucked",
    ],
  },
  {
    id: 10,
    name: "Lat Pulldown",
    muscle: "Back",
    secondaryMuscle: "Biceps, Core",
    equipment: "Cable",
    difficulty: "Beginner",
    sets: "3-4",
    reps: "10-12",
    emoji: "🔽",
    color: "bg-cyan-100",
    description:
      "The lat pulldown is a compound exercise that primarily develops the latissimus dorsi, the large muscle of the back.",
    tips: [
      "Pull bar to upper chest, not behind neck",
      "Lead with your elbows",
      "Arch back slightly",
      "Squeeze lats at bottom",
    ],
  },
  {
    id: 11,
    name: "Leg Press",
    muscle: "Legs",
    secondaryMuscle: "Glutes, Core",
    equipment: "Machine",
    difficulty: "Beginner",
    sets: "3-4",
    reps: "10-15",
    emoji: "🦿",
    color: "bg-lime-100",
    description:
      "The leg press is a compound weight training exercise in which the individual pushes a weight or resistance away from them using their legs.",
    tips: [
      "Keep feet shoulder-width apart",
      "Don't lock out knees at top",
      "Control the descent",
      "Keep back flat against pad",
    ],
  },
  {
    id: 12,
    name: "Face Pull",
    muscle: "Shoulders",
    secondaryMuscle: "Rear Delts, Traps",
    equipment: "Cable",
    difficulty: "Beginner",
    sets: "3-4",
    reps: "12-20",
    emoji: "😤",
    color: "bg-amber-100",
    description:
      "The face pull is an isolation exercise targeting the rear deltoids and upper trapezius for improved shoulder health.",
    tips: [
      "Set cable at face height",
      "Pull to forehead level",
      "Externally rotate at end",
      "Keep elbows high",
    ],
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function Exercises() {
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<(typeof exercises)[0] | null>(null);
  const [bookmarked, setBookmarked] = useState<number[]>([1, 3]);

  const filtered = exercises.filter((e) => {
    const matchesMuscle = selectedMuscle === "All" || e.muscle === selectedMuscle;
    const matchesEquip = selectedEquipment === "All" || e.equipment === selectedEquipment;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMuscle && matchesEquip && matchesSearch;
  });

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Exercise Library</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {exercises.length}+ exercises with detailed guides
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          <Bookmark className="w-3 h-3 mr-1" /> {bookmarked.length} saved
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Muscle Group Filter */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Muscle Group</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {muscleGroups.map((group) => (
            <Button
              key={group}
              variant={selectedMuscle === group ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedMuscle(group)}
            >
              {group}
            </Button>
          ))}
        </div>
      </div>

      {/* Equipment Filter */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Equipment</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {equipment.map((eq) => (
            <Button
              key={eq}
              variant={selectedEquipment === eq ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedEquipment(eq)}
            >
              {eq}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-muted-foreground">{filtered.length} exercises found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((exercise) => (
          <Card
            key={exercise.id}
            className="border-border cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => setSelectedExercise(exercise)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl ${exercise.color} flex items-center justify-center text-xl shrink-0`}
                >
                  {exercise.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{exercise.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(exercise.id);
                      }}
                      className="shrink-0"
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          bookmarked.includes(exercise.id)
                            ? "text-primary fill-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                      {exercise.muscle}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {exercise.equipment}
                    </Badge>
                    <Badge
                      className={`text-[10px] py-0 px-1.5 border-0 ${difficultyColors[exercise.difficulty]}`}
                    >
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Also works: {exercise.secondaryMuscle}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs gap-1 pr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExercise(exercise);
                      }}
                    >
                      View <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exercise Detail Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        {selectedExercise && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-xl ${selectedExercise.color} flex items-center justify-center text-xl`}
                >
                  {selectedExercise.emoji}
                </span>
                {selectedExercise.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{selectedExercise.muscle}</Badge>
                <Badge variant="outline">{selectedExercise.equipment}</Badge>
                <Badge
                  className={`border-0 ${difficultyColors[selectedExercise.difficulty]}`}
                >
                  {selectedExercise.difficulty}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{selectedExercise.description}</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-base font-semibold">{selectedExercise.sets}</p>
                  <p className="text-xs text-muted-foreground">Sets</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-base font-semibold">{selectedExercise.reps}</p>
                  <p className="text-xs text-muted-foreground">Reps</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-base font-semibold">60s</p>
                  <p className="text-xs text-muted-foreground">Rest</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Pro Tips</h4>
                <ul className="space-y-1.5">
                  {selectedExercise.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Play className="w-4 h-4" /> Add to Workout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleBookmark(selectedExercise.id)}
                  className="gap-2"
                >
                  <Bookmark
                    className={`w-4 h-4 ${bookmarked.includes(selectedExercise.id) ? "fill-current" : ""}`}
                  />
                  {bookmarked.includes(selectedExercise.id) ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
