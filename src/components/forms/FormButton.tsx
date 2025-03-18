// components/ExportPDF.tsx
"use client";

import { useRef } from "react";
import { ResumeData } from "@/types/resume";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ExportPDFProps {
  resumeData: ResumeData;
}

const ExportPDF = ({ resumeData }: ExportPDFProps) => {
  const handleExport = async () => {
    // We need to get access to the preview DOM element
    // In a real implementation, we'd use a ref from the parent component

    const previewElement = document.querySelector(".resume-preview-container");
    if (!previewElement) {
      alert("Could not find resume preview element");
      return;
    }

    try {
      // Show loading indicator
      const loadingElement = document.createElement("div");
      loadingElement.className =
        "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
      loadingElement.innerHTML =
        '<div class="bg-white p-5 rounded-lg"><p class="text-lg font-medium">Generating PDF...</p></div>';
      document.body.appendChild(loadingElement);

      // Give some time for the loading indicator to appear
      await new Promise((resolve) => setTimeout(resolve, 100));

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
      // Remove loading indicator
      const loadingElement = document.querySelector(
        ".fixed.inset-0.bg-black.bg-opacity-50"
      );
      if (loadingElement) {
        document.body.removeChild(loadingElement);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        className="flex items-center justify-center w-full px-4 py-2 mt-2 text-white bg-green-600 rounded hover:bg-green-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
            clipRule="evenodd"
          />
        </svg>
        Export as PDF
      </button>
    </div>
  );
};

export default ExportPDF;
