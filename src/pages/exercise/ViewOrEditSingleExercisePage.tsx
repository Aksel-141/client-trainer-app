import { useParams } from "react-router";
import MuscleVisualizer from "./../../../components/MuscleVisualizer/index";

export default function ViewOrEditSingleExercisePage() {
  const params = useParams();
  return (
    <div>
      ViewOrEditSingleExercisePage {params.id}
      <div style={{ width: "500px" }}>
        <MuscleVisualizer muscleList={["body", "traps"]} />
      </div>
    </div>
  );
}
