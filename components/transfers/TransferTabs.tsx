import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const TransferTabs = ({
  view,
  setView,
}: {
  view: string;
  setView: (v: "incoming" | "outgoing") => void;
}) => {
  return (
    <Tabs
      value={view}
      onValueChange={(v) => setView(v as "incoming" | "outgoing")}
    >
      <TabsList>
        <TabsTrigger value="incoming">Incoming</TabsTrigger>
        <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TransferTabs;
