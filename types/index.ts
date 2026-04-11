// Enums, що відповідають схемі Prisma
export type ExerciseType = "endurance" | "strength" | "balance" | "flexibility";
export type MediaType = "image" | "video";

// --- ЕЛЕМЕНТИ ВПРАВ (EXERCISES) ---

export type ExerciseImage = {
  id: number;
  path: string;
  order: number | null;
};

export type Muscle = {
  id: number;
  nameEn: string;
  nameUa: string; // Адаптовано з перекладів
  description?: string;
};

export type MuscleByGroup = {
  id: number;
  nameEn: string;
  nameUa: string;
  description?: string;
  muscles: Muscle[];
};

export type Translation = {
  lang: string;
  name: string;
};

export type ServerMuscle = {
  id: number;
  muscleName?: string;
  translations?: Translation[];
};

export type ServerMuscleByGroup = {
  id: number;
  description?: string;
  translations?: Translation[];
  muscles?: ServerMuscle[];
};

export type Equipment = {
  id: number;
  icon: string | null;
  name: string; // Адаптовано з перекладів
};

export type Exercise = {
  id: number;
  slug: string;
  title: string;
  description: string;
  type?: ExerciseType | null;

  // В роуті /all ми віддаємо масив шляхів (string[]),
  // а в /:id — масив об'єктів (ExerciseImage[])
  images: (string | ExerciseImage)[];
  video: string | null;

  // Простий список назв англійською для швидкого доступу
  muscles: string[];
  // Детальна інформація про м'язи (повертається в роуті /:id)
  musclesInfo?: Muscle[];

  createdAt?: string | Date;
};

// --- ШАБЛОНИ ТРЕНУВАНЬ (ROUTINES) ---

export type RoutineCategory = {
  id: number;
  name: string; // Адаптовано з перекладів
  icon?: string | null;
  color?: string | null;
  description?: string | null;
};

export type RoutineToCategory = {
  routineId: number;
  categoryId: number;
  category: RoutineCategory;
};

export type RoutineExerciseInput = {
  exerciseId: number;
  reps?: number | null;
  sets?: number | null;
  duration?: number | null;
  rest?: number | null;
};

export type RoutineExercise = RoutineExerciseInput & {
  id: number;
  routineId: number;
  order: number;
  exercise?: Exercise; // Прикріплена вправа (якщо використовувався include)
};

export type Routine = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  version: number;

  categories?: RoutineToCategory[];
  exercises?: RoutineExercise[];

  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// --- ЖУРНАЛ ТРЕНУВАНЬ (WORKOUTS) ---

export type WorkoutSet = {
  id: number;
  setNumber: number;
  reps?: number | null;
  duration?: number | null;
  weight?: number | null;
  completedAt: string | Date;
};

export type WorkoutExercise = {
  id: number;
  workoutId: number;
  exerciseId: number;
  order: number;
  exercise?: Exercise;
  sets: WorkoutSet[];
};

export type Workout = {
  id: number;
  routineId?: number | null;
  title: string;

  startTime: string | Date;
  endTime: string | Date;
  totalTime: number; // в секундах

  routine?: Routine | null;
  exercises?: WorkoutExercise[];

  createdAt?: string | Date;
};
