import { useParams } from "react-router";
import MuscleVisualizer from "./../../../components/MuscleVisualizer/index";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getExerciseById from "../../api/exerciseApi";

export default function ViewOrEditSingleExercisePage() {
  const [currExercise, setCurrExercise] = useState(null);
  const params = useParams();
  console.log(currExercise);

  async function getExersice() {
    try {
      const res = await getExerciseById(Number(params.id));
      setCurrExercise(res.data.result);
    } catch (error) {
      console.log(error);
      toast.success("Сталася помилка");
    }
  }

  useEffect(() => {
    getExersice();
  }, []);

  return (
    <div>
      ViewOrEditSingleExercisePage {params.id}
      <div style={{ width: "500px" }}>
        <MuscleVisualizer muscleList={currExercise?.muscles} />
      </div>
    </div>
  );
}
