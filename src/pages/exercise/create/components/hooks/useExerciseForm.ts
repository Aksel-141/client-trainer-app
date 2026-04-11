import { useState } from "react";
import type { ServerMuscleByGroup } from "../../../../../../types";

export function useExerciseForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [muscles, setMuscles] = useState<string[]>([]);
  const [muscleByGroup, setMuscleByGroup] = useState<ServerMuscleByGroup[]>([]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
    }
  };

  const onMusclesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setMuscles((prev) => [...prev, value]);
    } else {
      setMuscles((prev) => prev.filter((m) => m !== value));
    }
  };

  return {
    title,
    description,
    images,
    video,
    muscles,
    muscleByGroup,
    //-----
    setTitle,
    setDescription,
    setMuscles,
    setMuscleByGroup,
    //----
    onImageChange,
    onVideoChange,
    onMusclesChange,
  };
}
