// app/lib/schemas/orgSchemas.ts
import { z } from "zod";

export const CreateOrgUnitSchema = z.object({
  parentId: z
    .string()
    .nullable()
    .optional()
    .describe("ID of the parent unit; if absent, this is the root."),
  name: z
    .string()
    .min(1, "Unit name is required")
    .max(255, "Unit name must be 255 characters or fewer"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or fewer")
    .optional()
    .or(z.literal("")),
  roles: z.string().transform((s) =>
    s
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
  ),
});

export const UpdateOrgUnitSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Unit name is required")
    .max(255, "Unit name must be 255 characters or fewer"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or fewer")
    .optional()
    .or(z.literal("")),
  roles: z.string().transform((s) =>
    s
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
  ),
});

// TypeScript helpers you can import elsewhere:
export type CreateOrgUnitInput = z.input<typeof CreateOrgUnitSchema>;
export type CreateOrgUnitData = Omit<
  z.output<typeof CreateOrgUnitSchema>,
  "parentId"
> & { parentId: string | null };

export type UpdateOrgUnitInput = z.input<typeof UpdateOrgUnitSchema>;
export type UpdateOrgUnitData = z.output<typeof UpdateOrgUnitSchema>;
