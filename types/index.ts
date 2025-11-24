//Exercise
export type Exercise = {
  id: number;
  title: string;
  description: string;
  images: string[];
  video: string;
};

export type RoutineExerciseInput = {
  exerciseId: number;
  reps?: number;
  sets?: number;
  duration?: number;
  rest?: number;
};
