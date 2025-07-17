// app/dashboard/leaves/create/page.tsx
"use client";

import React, { useEffect, useState, FormEvent, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getStaffById } from "@/lib/actions/leaveActions";
import { Staff } from "@/lib/definitions/staffDefinitions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTauriPdfSave } from "@/lib/utils/useTauriPdfSave";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { pdf } from "@react-pdf/renderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { LeavePDFTemplate } from "@/components/leaves/Pdfs/OffDutyPdf";

export default function CreateLeavePage() {
  const params = useSearchParams();
  const staffId = params.get("staffId")!;
  let leaveType = params.get("leaveType") as
    | "annual"
    | "sick"
    | "offDuty"
    | "maternity"
    | null;
  const [staff, setStaff] = useState<Staff | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const previewGenerated = useRef(false);

  useEffect(() => {
    getStaffById(staffId).then((s) => {
      setStaff(s);
      if (leaveType === "maternity" && s.gender === "MALE") {
        leaveType = "paternity";
      }
    });
  }, [staffId, leaveType]);

  const savePDF = useTauriPdfSave(
    (data: any) => (
      <LeavePDFTemplate
        staff={data.staff}
        startDate={data.startDate}
        endDate={data.endDate}
        reason={data.reason}
        type={data.type}
      />
    ),
    `${leaveType}-leave-request.pdf`
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Submit logic here
      toast.success("Leave request created");
    } catch (err: any) {
      toast.error(err.message || "Failed to create leave");
    } finally {
      setSubmitting(false);
    }
  };

  const generatePreviewPDF = async () => {
    if (!staff || !leaveType) return;

    setGeneratingPreview(true);
    try {
      const doc = (
        <LeavePDFTemplate
          staff={staff}
          startDate={startDate}
          endDate={endDate}
          reason={
            ["sick", "offDuty"].includes(leaveType!) ? bodyText : undefined
          }
          type={leaveType}
        />
      );

      const blob = await pdf(doc).toBlob();
      setPdfBlob(blob);
      previewGenerated.current = true;
      setPreviewOpen(true);
    } catch (error) {
      toast.error("Failed to generate PDF preview");
      console.error("PDF generation error:", error);
    } finally {
      setGeneratingPreview(false);
    }
  };

  const handleDownloadDraft = () => {
    savePDF({
      staff,
      startDate,
      endDate,
      reason: ["sick", "offDuty"].includes(leaveType!) ? bodyText : undefined,
      type: leaveType,
    });
  };

  if (!staff || !leaveType) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Create {leaveType === "offDuty" ? "Off-Duty" : leaveType} Leave
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          For{" "}
          <span className="font-semibold">
            {staff.first_name} {staff.last_name}
          </span>
          <span className="ml-2 px-2 py-1 rounded-md">
            #{staff.staff_number}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Staff Card */}
        <Card className="lg:col-span-1">
          <CardHeader className=" border-b">
            <CardTitle className="text-xl">Staff Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">
                {staff.first_name} {staff.middle_name} {staff.last_name}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Staff Number</p>
                <p className="font-medium">{staff.staff_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rank</p>
                <p className="font-medium">{staff.rank}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{staff.status}</p>
            </div>
          </CardContent>
        </Card>

        {/* Leave Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className=" border-b">
              <CardTitle className="text-xl">Leave Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <DatePicker
                        id="startDate"
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date) =>
                          setStartDate(
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
                        dateFormat="yyyy-MM-dd"
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        placeholderText="Select start date"
                        required
                        showPopperArrow={false}
                        customInput={<Input />}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <DatePicker
                        id="endDate"
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(date) =>
                          setEndDate(
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
                        dateFormat="yyyy-MM-dd"
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        placeholderText="Select end date"
                        required={leaveType !== "sick"}
                        minDate={startDate ? new Date(startDate) : null}
                        showPopperArrow={false}
                        popperPlacement="bottom-start"
                        customInput={<Input />}
                      />
                    </div>
                  </div>
                </div>

                {(leaveType === "offDuty" || leaveType === "sick") && (
                  <div>
                    <Label htmlFor="body">
                      {leaveType === "sick" ? "Medical Reason" : "Purpose"}
                    </Label>
                    <Textarea
                      id="body"
                      rows={4}
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      className="mt-1"
                      placeholder={
                        leaveType === "sick"
                          ? "Describe your medical condition..."
                          : "Explain the purpose of your off-duty request..."
                      }
                    />
                  </div>
                )}

                {leaveType === "sick" && (
                  <div>
                    <Label htmlFor="supportDoc">Medical Certificate</Label>
                    <Input
                      id="supportDoc"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="mt-1 cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload supporting medical documentation (PDF only)
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePreviewPDF}
                      disabled={
                        !startDate ||
                        (leaveType !== "sick" && !endDate) ||
                        generatingPreview
                      }
                    >
                      {generatingPreview ? (
                        <>
                          <span className="mr-2">🔄</span> Generating...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">👁️</span> Preview Draft
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadDraft}
                      disabled={
                        !startDate || (leaveType !== "sick" && !endDate)
                      }
                    >
                      <span className="mr-2">📄</span> Download Draft
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Leave Request Preview</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Draft preview for {staff.first_name} {staff.last_name}'s{" "}
              {leaveType} leave
            </p>
          </DialogHeader>

          <div className="h-[calc(90vh-100px)]">
            {pdfBlob ? (
              <PDFViewer
                width="100%"
                height="100%"
                className="border rounded-lg"
              >
                <LeavePDFTemplate
                  staff={staff}
                  startDate={startDate}
                  endDate={endDate}
                  reason={
                    ["sick", "offDuty"].includes(leaveType!)
                      ? bodyText
                      : undefined
                  }
                  type={leaveType}
                />
              </PDFViewer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Generating preview...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close Preview
            </Button>
            <Button
              onClick={() => {
                setPreviewOpen(false);
                handleDownloadDraft();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
