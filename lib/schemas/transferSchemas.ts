import z from "zod";

// 1) Define a Zod schema for our transfer form
export const createTransferSchema = z.object({
  staff_id: z
    .string()
    .refine((s) => /^\d+$/.test(s), { message: "Invalid staff ID" })
    .transform(Number),
  type: z.enum(["INCOMING", "OUTGOING"]),
  draft_text: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((s) => s || null),
  letter_pdf: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((s) => s || null),
  from_unit: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((s) => s || null),
  to_unit: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((s) => s || null),
});
