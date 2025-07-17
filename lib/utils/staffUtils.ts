import { Staff } from "../definitions/staffDefinitions";

export const getStatusVariant = (status: Staff["status"]) => {
  switch (status) {
    case "ON_DUTY":
      return "success";
    case "SICK":
      return "warning";
    case "LEAVE":
      return "destructive";
    default:
      return "outline";
  }
};
