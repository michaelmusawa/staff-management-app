import React, { useEffect, useState } from "react";
import { UnitSidebar } from "../allocation/UnitSidebar";
import { getOrgUnits } from "@/lib/actions/orgActions";
import { OrgUnit } from "@/lib/definitions/orgDefinitions";

const AttendanceSidebar = ({
  selectedUnit,
  setSelectedUnit,
}: {
  selectedUnit: OrgUnit | null;
  setSelectedUnit: (unit: OrgUnit) => void;
}) => {
  // 1) Load units & staff
  const [units, setUnits] = useState<OrgUnit[]>([]);

  useEffect(() => {
    getOrgUnits().then(setUnits);
  }, []);

  // 2) Selected unit & its assignments

  return (
    <UnitSidebar
      units={units}
      selectedId={selectedUnit?.id ?? null}
      onSelect={(u) => setSelectedUnit(u)}
    />
  );
};

export default AttendanceSidebar;
