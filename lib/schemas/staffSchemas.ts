// app/lib/schemas/staffSchemas.ts
import { z } from "zod";

export const CreateStaffSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be 100 characters or fewer"),
  middle_name: z
    .string()
    .max(100, "Middle name must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be 100 characters or fewer"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .max(20, "Phone must be 20 characters or fewer")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  rank: z
    .string()
    .max(100, "Rank must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),
  staff_number: z
    .string()
    .min(1, "Staff number is required")
    .max(50, "Staff number must be 50 characters or fewer"),
  ippd_number: z
    .string()
    .max(50, "IPPD number must be 50 characters or fewer")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Address must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  status: z.enum(["ON_DUTY", "SICK", "LEAVE"]),
});

export const UpdateStaffSchema = CreateStaffSchema.extend({
  id: z
    .string()
    .regex(/^\d+$/, "Invalid staff ID")
    .transform((s) => parseInt(s, 10)),
});

// TypeScript helpers
export type CreateStaffInput = z.input<typeof CreateStaffSchema>;
export type CreateStaffData = z.output<typeof CreateStaffSchema>;

export type UpdateStaffInput = z.input<typeof UpdateStaffSchema>;
export type UpdateStaffData = z.output<typeof UpdateStaffSchema>;
