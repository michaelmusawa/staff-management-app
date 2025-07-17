import { z } from "zod";

export const leaveSchema = z.object({
  staffId: z.string().uuid(),
  type: z.enum(["annual", "sick", "offDuty", "maternity", "paternity"]),
  startDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), "Invalid start date"),
  endDate: z
    .string()
    .optional()
    .refine((d) => !d || !isNaN(Date.parse(d)), "Invalid end date"),
  reason: z.string().optional(),
  file: z.any().optional(),
});

export type LeaveFormData = z.infer<typeof leaveSchema>;
