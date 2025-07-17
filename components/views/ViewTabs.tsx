import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const ViewTabs = ({ view, setView }: { view: string; setView: () => void }) => {
  return (
    <Tabs value={view} onValueChange={(v) => setView(v as any)}>
      <TabsList>
        <TabsTrigger value="nominal">Nominal Roll</TabsTrigger>
        <TabsTrigger value="allocation">Allocation</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewTabs;
