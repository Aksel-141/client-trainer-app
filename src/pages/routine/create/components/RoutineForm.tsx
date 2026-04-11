import { Box, FormControl, FormLabel, Input, Textarea, Select, Option } from "@mui/joy";
import { useEffect, useState } from "react";
import { getRoutineCategories } from "../../../../api/baseDataApi";
import { toast } from "react-toastify";

interface RoutineFormProps {
  title: string;
  description: string;
  categoryIds: number[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: number[]) => void;
}

type Category = {
  id: number;
  nameEn: string;
  nameUa: string;
  description: string;
  icon: string;
  color: string;
};

export default function RoutineForm({
  title,
  description,
  categoryIds,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
}: RoutineFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadCategories() {
    try {
      const response = await getRoutineCategories();
      setCategories(response.data.result);
    } catch (error) {
      toast.error("Помилка завантаження категорій");
      console.error(error);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Box>
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Назва рутини</FormLabel>
        <Input
          placeholder="Введіть назву рутини"
          size="lg"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormControl>
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Категорії (необов'язково)</FormLabel>
        <Select
          multiple
          placeholder="Оберіть категорії"
          size="lg"
          value={categoryIds}
          onChange={(_, newValue) => onCategoryChange(newValue as number[])}
          renderValue={(selected) =>
            selected
              .map((option) => {
                const cat = categories.find((c) => c.id === option.value);
                return cat ? ` ${cat.name}` : "";
              })
              .join(", ")
          }
        >
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {/* {cat.icon} */}
              {cat.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Опис (необов'язково)</FormLabel>
        <Textarea
          placeholder="Введіть опис рутини"
          minRows={3}
          size="lg"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </FormControl>
    </Box>
  );
}
