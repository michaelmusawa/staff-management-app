import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { getStatusVariant } from "@/lib/utils/staffUtils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Staff } from "@/lib/definitions/staffDefinitions";
import { FiEye, FiX } from "react-icons/fi";

const ViewStaffModal = ({ showView }: { showView: Staff }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 rounded-full p-2"
          aria-label="View staff details"
        >
          <FiEye className="text-gray-600 hover:text-indigo-600 transition-colors" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-xl">
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-full"
          >
            <FiX className="text-gray-500" />
          </Button>
        </div>

        <DialogHeader className="border-b pb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {showView?.first_name} {showView?.last_name}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                {showView?.rank}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          <DetailItem label="Email" value={showView?.email} />
          <DetailItem label="Phone" value={showView?.phone} />
          <DetailItem label="Staff No" value={showView?.staff_number} />
          <DetailItem label="IPPD No" value={showView?.ippd_number} />
          <DetailItem label="Gender" value={showView?.gender} />
          <div className="col-span-1 md:col-span-2">
            <DetailItem label="Address" value={showView?.address} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
            <Badge
              variant={getStatusVariant(showView?.status ?? "ON_DUTY")}
              className="px-3 py-1 text-sm font-medium"
            >
              {showView?.status?.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="px-6 border-gray-300 hover:bg-gray-50"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for consistent detail items
const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium">
      {value || <span className="text-gray-400">Not available</span>}
    </p>
  </div>
);

export default ViewStaffModal;
