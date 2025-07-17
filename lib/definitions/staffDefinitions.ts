// app/lib/types/userActionState.ts
export type StaffActionState = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  state_error?: string | null;
  message?: string | null;
};

export interface Staff {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone?: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  rank?: string | null;
  staff_number: string;
  ippd_number?: string | null;
  address?: string | null;
  status: "ON_DUTY" | "SICK" | "LEAVE";
  created_at: string;
  updated_at: string;
  role?: string;
}
