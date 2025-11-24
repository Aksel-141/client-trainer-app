import { Card, Typography, List, ListItem, ListItemContent, Chip } from "@mui/joy";

interface CompletedSet {
  exerciseId: number;
  title: string;
  setNumber: number;
  reps?: number | null;
  duration?: number | null;
  at: string;
}

interface CompletedSetsListProps {
  completed: CompletedSet[];
}

export default function CompletedSetsList({ completed }: CompletedSetsListProps) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        Виконані вправи
      </Typography>
      {completed.length === 0 ? (
        <Typography level="body-sm">Поки що нічого не виконано</Typography>
      ) : (
        <List size="sm">
          {completed.map((c, i) => (
            <ListItem key={`${c.exerciseId}-${i}`}>
              <ListItemContent>
                <Typography level="body-md">{c.title}</Typography>
                <Typography level="body-sm">
                  Сет {c.setNumber} • {new Date(c.at).toLocaleTimeString()}
                </Typography>
              </ListItemContent>
              <Chip size="sm" color="primary" variant="soft">
                {c.reps ? `${c.reps} reps` : c.duration ? `${c.duration}s` : "—"}
              </Chip>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
}
