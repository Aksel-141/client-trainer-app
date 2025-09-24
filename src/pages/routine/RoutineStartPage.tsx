import axios from "axios";
import { useEffect, useRef, useState } from "react";
// import navRoutes from "./../../router/index";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Box, Button, CardMedia, Typography } from "@mui/material";

export default function RoutineStartPage() {
  let navigate = useNavigate();
  const [routine, setRoutine] = useState(null);
  const params = useParams();

  async function getRoutine() {
    try {
      const data = await axios.get(`/routine/${params.id}`);
      setRoutine(data.data.data);
      // console.log(data.data.data);
    } catch (error) {
      toast.error("Сталася помилка, детльніше в консолі");
      console.log(error);
    }
  }

  function StartRoutine() {
    if (routine) {
      //Фіксуємо старт і записуємо в локал сторейдж, що відбувається сесія
      localStorage.setItem("savedRoutineId", routine?.id);
      console.log(routine);
      startTimer();
    }
  }

  async function EndRoutine() {
    const endtime = new Date().toISOString();
    pauseTimer();

    const musclesParse = () => {
      const m = [];

      routine?.exercises.forEach((item) => {
        // console.log("item", item);

        for (let index = 0; index < item.exercise.muscles.length; index++) {
          m.push(item.exercise.muscles[index].muscle.name);
          console.log(item.exercise.muscles[index].muscle.name);
        }
      });
      return [...new Set(m)];
    };

    const routineStatistics = {
      endTime: endtime.toString(),
      workoutTime: seconds,
      workoutTitle: routine?.title,
      muscles: musclesParse(),
    };

    try {
      await axios.post("/statistics/add", routineStatistics);
      await localStorage.removeItem("savedRoutineId");
      await localStorage.removeItem("savedRoutineTime");
      navigate("/");
    } catch (error) {
      toast.error("Сталася помилка, детльніше в консолі");
      console.log(error);
    }

    console.log(routineStatistics);
  }

  //Функція загального таймера
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const savedRoutineTime = localStorage.getItem("savedRoutineTime");
      if (savedRoutineTime) setSeconds(Number(savedRoutineTime));
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          const newTime = prev + 1;
          localStorage.setItem("savedRoutineTime", newTime);
          return newTime;
        });
      }, 1000);
    }
  };
  const pauseTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  //Кінець функції таймера

  useEffect(() => {
    getRoutine();
  }, []);
  //Ініціація рутини
  useEffect(() => {
    StartRoutine();
  }, [routine]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{routine?.title}</Typography>
        <Box>
          <Typography>
            Time:
            {formatTime(seconds)}
          </Typography>
          <button onClick={isRunning ? pauseTimer : startTimer}>
            {isRunning ? "⏸" : "▶"}
          </button>
        </Box>
      </Box>
      <Box>
        {routine?.exercises.map((item, index) =>
          Array.from({ length: item.sets }).map((_, i) => (
            <Box key={`${item.id}-${i}`}>
              <h1>
                {item?.exercise?.title} (Сет {i + 1})
              </h1>
              <Box sx={{ display: "flex" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100 }}
                  image={`http://localhost:6189${
                    JSON.parse(item?.exercise?.images)[0]
                  }`}
                  alt="image"
                />
                <span> {item.reps && `Повторів:${item.reps} `}</span>
                <span> {item.duration && `Час:${item.duration} секунди`}</span>
                <span> {item.sets && `Підходів:${item.sets}`}</span>
                <input type="checkbox" />
              </Box>
            </Box>
          ))
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={EndRoutine} variant="contained">
          EndRoutine
        </Button>
      </Box>
    </div>
  );
}
