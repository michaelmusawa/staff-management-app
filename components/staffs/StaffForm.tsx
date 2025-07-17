// app/components/staff/StaffForm.tsx
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Staff, StaffActionState } from "@/lib/definitions/staffDefinitions";

export function StaffForm({
  formData,
  errors,
}: {
  formData?: Staff;
  errors: StaffActionState["errors"];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          name="first_name"
          defaultValue={formData?.first_name ?? ""}
          required
        />
        {errors?.first_name && (
          <p className="text-red-600 text-sm mt-1">{errors.first_name[0]}</p>
        )}
      </div>

      {/* Middle Name */}
      <div className="space-y-2">
        <Label htmlFor="middle_name">Middle Name</Label>
        <Input
          id="middle_name"
          name="middle_name"
          defaultValue={formData?.middle_name ?? ""}
        />
        {errors?.middle_name && (
          <p className="text-red-600 text-sm mt-1">{errors.middle_name[0]}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          name="last_name"
          defaultValue={formData?.last_name ?? ""}
          required
        />
        {errors?.last_name && (
          <p className="text-red-600 text-sm mt-1">{errors.last_name[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={formData?.email ?? ""}
          required
        />
        {errors?.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={formData?.phone ?? ""}
          type="tel"
          pattern="[0-9]{10}" // Example pattern for 10-digit phone numbers
          placeholder="070-1234-5678"
          required
        />
        {errors?.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone[0]}</p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select name="gender" defaultValue={formData?.gender ?? ""}>
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors?.gender && (
          <p className="text-red-600 text-sm mt-1">{errors.gender[0]}</p>
        )}
      </div>

      {/* Rank */}
      <div className="space-y-2">
        <Label htmlFor="rank">Rank</Label>
        <Input id="rank" name="rank" defaultValue={formData?.rank ?? ""} />
        {errors?.rank && (
          <p className="text-red-600 text-sm mt-1">{errors.rank[0]}</p>
        )}
      </div>

      {/* Staff Number */}
      <div className="space-y-2">
        <Label htmlFor="staff_number">Staff Number</Label>
        <Input
          id="staff_number"
          name="staff_number"
          defaultValue={formData?.staff_number ?? ""}
          required
        />
        {errors?.staff_number && (
          <p className="text-red-600 text-sm mt-1">{errors.staff_number[0]}</p>
        )}
      </div>

      {/* IPPD Number */}
      <div className="space-y-2">
        <Label htmlFor="ippd_number">IPPD Number</Label>
        <Input
          id="ippd_number"
          name="ippd_number"
          defaultValue={formData?.ippd_number ?? ""}
        />
        {errors?.ippd_number && (
          <p className="text-red-600 text-sm mt-1">{errors.ippd_number[0]}</p>
        )}
      </div>

      {/* Address (full width) */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={formData?.address ?? ""}
          placeholder="123 Nairobi"
        />
        {errors?.address && (
          <p className="text-red-600 text-sm mt-1">{errors.address[0]}</p>
        )}
      </div>

      {/* Status */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={formData?.status ?? ""}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ON_DUTY">On Duty</SelectItem>
            <SelectItem value="SICK">Sick</SelectItem>
            <SelectItem value="LEAVE">On Leave</SelectItem>
          </SelectContent>
        </Select>
        {errors?.status && (
          <p className="text-red-600 text-sm mt-1">{errors.status[0]}</p>
        )}
      </div>
    </div>
  );
}
