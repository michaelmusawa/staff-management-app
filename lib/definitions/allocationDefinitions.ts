import { Staff } from "./staffDefinitions";

export interface Assignment {
  id: number;
  staff_id: number;
  role_id: number;
  org_unit_id: number;
  start_date: string;
  end_date?: string | null;
  staff: Staff;
  role_title: string;
}

export type AllocationActionState = {
  errors?: {
    staff_id?: string[];
    org_unit_id?: string[];
    role_id?: string[];
  };
  state_error?: string | null;
  message?: string | null;
};
