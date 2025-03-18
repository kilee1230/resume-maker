"use client";

import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { jsPDF } from "jspdf";

interface ExportPDFProps {
  resumeData: ResumeData;
}

const ExportPDF = ({ resumeData }: ExportPDFProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const { personal, experiences, education, skills } = resumeData;

      // Create PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set up dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const usableWidth = pageWidth - margin * 2;
      let yPos = margin;

      // Helper function to add text with word wrap
      const addWrappedText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
      ) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lineHeight * lines.length;
      };

      // Name header
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      const nameText = personal.name || "Your Name";
      doc.text(nameText, pageWidth / 2, yPos, { align: "center" });
      yPos += 8;

      // Contact information
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const contactInfo = [
        personal.email,
        personal.phone,
        personal.location,
        personal.website,
      ]
        .filter(Boolean)
        .join(" | ");

      if (contactInfo) {
        doc.text(contactInfo, pageWidth / 2, yPos, { align: "center" });
        yPos += 8;
      }

      // Summary
      if (personal.summary) {
        yPos += 4;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Summary", margin, yPos);
        yPos += 5;

        doc.setLineWidth(0.2);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        yPos = addWrappedText(personal.summary, margin, yPos, usableWidth, 4);
        yPos += 6;
      }

      // Experience
      if (experiences?.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Experience", margin, yPos);
        yPos += 5;

        doc.setLineWidth(0.2);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        experiences.forEach((exp) => {
          // Add page break if needed
          if (yPos > 270) {
            doc.addPage();
            yPos = margin;
          }

          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const jobTitle = `${exp.title} | ${exp.company}`;
          doc.text(jobTitle, margin, yPos);

          const dateRange = exp.current
            ? `${exp.startDate} - Present`
            : `${exp.startDate} - ${exp.endDate}`;

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const dateWidth =
            (doc.getStringUnitWidth(dateRange) * 10) / doc.internal.scaleFactor;
          doc.text(dateRange, pageWidth - margin - dateWidth, yPos);
          yPos += 4;

          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text(exp.location, margin, yPos);
          yPos += 4;

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          yPos = addWrappedText(
            exp.description,
            margin,
            yPos,
            usableWidth,
            3.5
          );
          yPos += 6;
        });
      }

      // Education
      if (education?.length > 0) {
        // Add page break if needed
        if (yPos > 250) {
          doc.addPage();
          yPos = margin;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Education", margin, yPos);
        yPos += 5;

        doc.setLineWidth(0.2);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        education.forEach((edu) => {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const eduTitle = `${edu.degree} | ${edu.institution}`;
          doc.text(eduTitle, margin, yPos);

          const dateRange = `${edu.startDate} - ${edu.endDate || "Present"}`;
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const dateWidth =
            (doc.getStringUnitWidth(dateRange) * 10) / doc.internal.scaleFactor;
          doc.text(dateRange, pageWidth - margin - dateWidth, yPos);
          yPos += 4;

          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text(edu.location, margin, yPos);
          yPos += 4;

          if (edu.description) {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            yPos = addWrappedText(
              edu.description,
              margin,
              yPos,
              usableWidth,
              3.5
            );
          }
          yPos += 6;
        });
      }

      // Skills
      if (skills?.length > 0) {
        // Add page break if needed
        if (yPos > 270) {
          doc.addPage();
          yPos = margin;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Skills", margin, yPos);
        yPos += 5;

        doc.setLineWidth(0.2);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        const skillsPerRow = 3;
        const skillWidth = usableWidth / skillsPerRow;

        // Group skills into rows of 3
        for (let i = 0; i < skills.length; i += skillsPerRow) {
          let rowHeight = 0;

          for (let j = 0; j < skillsPerRow && i + j < skills.length; j++) {
            const skill = skills[i + j];
            const x = margin + j * skillWidth;

            const skillText = skill.level
              ? `${skill.name} (${skill.level}/5)`
              : skill.name;

            doc.text(skillText, x, yPos);
          }

          yPos += 5;
        }
      }

      // Save the PDF
      const fileName = personal.name
        ? `${personal.name.replace(/\s+/g, "_")}_resume.pdf`
        : "resume.pdf";

      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
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
