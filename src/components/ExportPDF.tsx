// components/ExportPDF.tsx (continued)
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useState } from "react";

interface ExportPDFProps {
  resumeData: ResumeData;
}

const ExportPDF = ({ resumeData }: ExportPDFProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // We need to get access to the preview DOM element
      const previewElement = document.querySelector(
        ".resume-preview-container"
      );
      if (!previewElement) {
        alert("Could not find resume preview element");
        return;
      }

      // Create the PDF
      const canvas = await html2canvas(previewElement as HTMLElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 dimensions in mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Download the PDF
      const fileName = resumeData.personal.name
        ? `${resumeData.personal.name.replace(/\s+/g, "_")}_resume.pdf`
        : "resume.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="w-full"
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <svg
            className="w-4 h-4 mr-2 -ml-1 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Exporting...
        </>
      ) : (
        <>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export PDF
        </>
      )}
    </Button>
  );
};

export default ExportPDF;
