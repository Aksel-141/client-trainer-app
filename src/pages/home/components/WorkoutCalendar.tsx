import { useState } from "react";
import { Box, Typography, IconButton, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import dayjs from "dayjs";

interface WorkoutCalendarProps {
  workouts: string[];
}

export default function WorkoutCalendar({ workouts }: WorkoutCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  // починаємо з понеділка
  const startDate = startOfMonth.startOf("week").add(1, "day");
  const endDate = endOfMonth.endOf("week").add(1, "day");

  const days = [];
  let day = startDate;

  while (day.isBefore(endDate, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  // зміна місяця
  const handleMonthChange = (offset: number) => {
    setCurrentMonth(currentMonth.add(offset, "month"));
  };

  // зміна року
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setCurrentMonth(currentMonth.year(event.target.value as number));
  };

  const years = Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i); // 5 назад і 5 вперед

  return (
    <Box>
      {/* Навігація */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
        <IconButton onClick={() => handleMonthChange(-1)}>
          <ArrowBack />
        </IconButton>

        <Typography sx={{ textAlign: "center" }}>{currentMonth.format("MMMM")}</Typography>

        <IconButton onClick={() => handleMonthChange(1)}>
          <ArrowForward />
        </IconButton>

        <Select value={currentMonth.year()} onChange={handleYearChange} size="small" sx={{ ml: 2 }}>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Дні тижня */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={1}>
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
          <Box key={d} textAlign="center" fontWeight="bold">
            {d}
          </Box>
        ))}
      </Box>

      {/* Дні місяця */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
        {days.map((dayItem) => {
          const formatted = dayItem.format("YYYY-MM-DD");
          const hasWorkout = workouts.includes(formatted);

          return (
            <Box
              key={formatted}
              sx={{
                borderRadius: "8px",
                backgroundColor: hasWorkout ? "rgba(0, 200, 0, 0.2)" : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",

                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" align="right">
                {dayItem.date()}
              </Typography>
              {hasWorkout && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "green",
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
