// components/ExportPDF.tsx
"use client";

import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import jsPDF from "jspdf";

interface ExportPDFProps {
  resumeData: ResumeData;
}

// This should be exactly the same as the generatePDF function in PDFPreviewGenerator
const generateResumeForExport = async (resumeData: ResumeData) => {
  // Create PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set up dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Function to add a heading
  const addHeading = (text: string | string[], y: number, fontSize = 16) => {
    // Check if we need a new page for the heading
    if (y > pageHeight - 40) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += 1;
    doc.setLineWidth(0.2);
    doc.line(margin, y + 3, pageWidth - margin, y + 3);
    return y + 8;
  };

  // Function to add wrapped text
  const addWrappedText = (text: string, y: number, fontSize = 11) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text || "", contentWidth);

    // Check if we need to add a new page if text is too long
    if (y + lines.length * 5 > pageHeight - margin) {
      // If text would flow to next page, check how many lines fit on current page
      const linesPerPage = Math.floor((pageHeight - margin - y) / 5);

      if (linesPerPage > 0) {
        // Add as many lines as can fit on current page
        const firstPageLines = lines.slice(0, linesPerPage);
        doc.text(firstPageLines, margin, y);

        // Add a new page for the rest
        doc.addPage();
        y = margin;

        // Add remaining lines to new page
        const remainingLines = lines.slice(linesPerPage);
        if (remainingLines.length > 0) {
          doc.text(remainingLines, margin, y);
          y += 5 * remainingLines.length;
        }
      } else {
        // If no lines fit, add a new page and start there
        doc.addPage();
        y = margin;
        doc.text(lines, margin, y);
        y += 5 * lines.length;
      }
    } else {
      // If all text fits on current page, add it
      doc.text(lines, margin, y);
      y += 5 * lines.length;
    }

    return y;
  };

  // Check if we need a new page (with some space for content)
  const checkNewPage = (y: number, neededSpace = 15) => {
    if (y + neededSpace > pageHeight - margin) {
      doc.addPage();
      return margin;
    }
    return y;
  };

  // Name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  const name = resumeData?.personal?.name || "Your Name";
  doc.text(name, pageWidth / 2, y, { align: "center" });
  y += 10;

  // Contact info
  if (resumeData?.personal) {
    const { email, phone, location } = resumeData.personal;
    let contactInfo = "";

    if (email) contactInfo += email;
    if (phone) contactInfo += contactInfo ? ` | ${phone}` : phone;
    if (location) contactInfo += contactInfo ? ` | ${location}` : location;

    if (contactInfo) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(contactInfo, pageWidth / 2, y, { align: "center" });
      y += 5;
    }
  }

  // Website
  if (resumeData?.personal?.website) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 255);
    doc.text(resumeData.personal.website, pageWidth / 2, y, {
      align: "center",
    });
    doc.setTextColor(0);
    y += 10;
  } else {
    y += 5;
  }

  // Summary
  if (resumeData?.personal?.summary) {
    y = addHeading("Summary", y);
    y = addWrappedText(resumeData.personal.summary, y);
    y += 8;
  }

  // Experience
  if (
    Array.isArray(resumeData?.experiences) &&
    resumeData.experiences.length > 0
  ) {
    y = addHeading("Experience", y);

    for (const exp of resumeData.experiences) {
      // Check if we need a new page for this experience
      y = checkNewPage(y, 20);

      // Position title
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${exp.title} | ${exp.company}`, margin, y);

      // Dates
      const dates = exp.current
        ? `${exp.startDate} - Present`
        : `${exp.startDate} - ${exp.endDate}`;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const textWidth =
        (doc.getStringUnitWidth(dates) * 10) / doc.internal.scaleFactor;
      doc.text(dates, pageWidth - margin - textWidth, y);
      y += 5;

      // Location
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(exp.location, margin, y);
      y += 5;

      // Description
      if (exp.description) {
        y = addWrappedText(exp.description, y, 10);
      }

      y += 5;
    }

    y += 3;
  }

  // Education
  if (Array.isArray(resumeData?.education) && resumeData.education.length > 0) {
    y = addHeading("Education", y);

    for (const edu of resumeData.education) {
      // Check if we need a new page
      y = checkNewPage(y, 20);

      // Degree
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${edu.degree} | ${edu.institution}`, margin, y);

      // Dates
      const dates = `${edu.startDate} - ${edu.endDate || "Present"}`;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const textWidth =
        (doc.getStringUnitWidth(dates) * 10) / doc.internal.scaleFactor;
      doc.text(dates, pageWidth - margin - textWidth, y);
      y += 5;

      // Location
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(edu.location, margin, y);
      y += 5;

      // Description
      if (edu.description) {
        y = addWrappedText(edu.description, y, 10);
      }

      y += 5;
    }

    y += 3;
  }

  // Certifications
  if (
    Array.isArray(resumeData?.certifications) &&
    resumeData.certifications.length > 0
  ) {
    y = addHeading("Certifications", y);

    for (const cert of resumeData.certifications) {
      // Check if we need a new page
      y = checkNewPage(y, 15);

      // Certification name
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${cert.name}`, margin, y);

      // Date
      if (cert.date) {
        const textWidth =
          (doc.getStringUnitWidth(cert.date) * 10) / doc.internal.scaleFactor;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(cert.date, pageWidth - margin - textWidth, y);
      }

      y += 5;

      // Issuer
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`${cert.issuer}`, margin, y);
      y += 5;

      // Description if available
      if (cert.description) {
        y = addWrappedText(cert.description, y, 10);
      }

      // URL if available
      if (cert.url) {
        y += 2;
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 255);
        doc.text(`Credential: ${cert.url}`, margin, y);
        doc.setTextColor(0);
      }

      y += 8;
    }

    y += 3;
  }

  // Skills with ratings in brackets
  if (Array.isArray(resumeData?.skills) && resumeData.skills.length > 0) {
    y = addHeading("Skills", y);

    // Format skills into groups of 3-4 per line
    const skillsPerLine = 3;
    const skillLines: string[] = [];
    let currentLine: string[] = [];

    resumeData.skills.forEach((skill, index) => {
      const skillText = `${skill.name} (${skill.level})`;
      currentLine.push(skillText);

      if (
        currentLine.length === skillsPerLine ||
        index === resumeData.skills.length - 1
      ) {
        skillLines.push(currentLine.join(" • "));
        currentLine = [];
      }
    });

    // Add skill lines to document
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    for (const line of skillLines) {
      y = checkNewPage(y, 6);
      doc.text(line, margin, y);
      y += 5;
    }

    y += 5;
  } // Return the generated PDF
  return doc;
};

export const ExportPDF = ({ resumeData }: ExportPDFProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsGenerating(true);
      const doc = await generateResumeForExport(resumeData);

      // Generate a filename based on the person's name or a default
      const fileName = resumeData?.personal?.name
        ? `${resumeData.personal.name.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      // Save the PDF
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      disabled={isGenerating}
      className="flex items-center gap-2"
    >
      <DownloadIcon className="w-4 h-4" />
      {isGenerating ? "Generating..." : "Export PDF"}
    </Button>
  );
};

export default ExportPDF;
