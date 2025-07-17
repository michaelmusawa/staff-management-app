import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const LeaveTabs = ({
  view,
  setView,
}: {
  view: string;
  setView: (v: "annual" | "sick" | "offDuty" | "maternity") => void;
}) => {
  return (
    <Tabs
      value={view}
      onValueChange={(v) =>
        setView(v as "annual" | "sick" | "offDuty" | "maternity")
      }
    >
      <TabsList>
        <TabsTrigger value="annual">Annual</TabsTrigger>
        <TabsTrigger value="sick">Sick off</TabsTrigger>
        <TabsTrigger value="offDuty">Off duty</TabsTrigger>
        <TabsTrigger value="maternity">Maternity/Paternity</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default LeaveTabs;
