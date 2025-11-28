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
    <Card
      variant="outlined"
      sx={{ p: 1.5, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <Typography level="title-lg" sx={{ mb: 1, flexShrink: 0 }}>
        ✅ Виконані ({completed.length})
      </Typography>
      {completed.length === 0 ? (
        <Typography level="body-sm" sx={{ color: "text.tertiary", textAlign: "center", mt: 4 }}>
          Поки що нічого не виконано
        </Typography>
      ) : (
        <List size="sm" sx={{ flex: 1, overflow: "auto", minHeight: 0, "--List-gap": "6px" }}>
          {completed.map((c, i) => (
            <ListItem key={`${c.exerciseId}-${i}`} sx={{ bgcolor: "background.level1", borderRadius: "sm", p: 1 }}>
              <ListItemContent>
                <Typography level="body-sm" fontWeight="lg">
                  {c.title}
                </Typography>
                <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                  Сет {c.setNumber} • {new Date(c.at).toLocaleTimeString()}
                </Typography>
              </ListItemContent>
              <Chip size="sm" color="success" variant="soft">
                {c.reps ? `${c.reps}x` : c.duration ? `${c.duration}s` : "—"}
              </Chip>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
}
