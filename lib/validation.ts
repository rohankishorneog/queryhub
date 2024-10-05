import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  explanation: z.string(),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});
