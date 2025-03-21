"use client";

import { useEffect, useState } from "react";
import { ResumeData } from "@/types/resume";
import jsPDF from "jspdf";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@/hook/useMediaQuery";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFPreviewGeneratorProps {
  resumeData: ResumeData;
}

const PDFPreviewGenerator = ({ resumeData }: PDFPreviewGeneratorProps) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [error, setError] = useState<string | null>(null);

  // Set different default scale based on screen size
  useEffect(() => {
    if (isMobile) {
      setScale(0.6); // 60% zoom for mobile
    } else {
      setScale(1.0); // 100% zoom for desktop
    }
  }, [isMobile]);

  // Zoom controls
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  // Page navigation
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, numPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Generate PDF on data change
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Use setTimeout to ensure UI updates before heavy PDF generation
    const timeoutId = setTimeout(() => {
      generatePDF();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [resumeData]);

  const generatePDF = async () => {
    setLoading(true);

    try {
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
      const addHeading = (
        text: string | string[],
        y: number,
        fontSize = 16
      ) => {
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
      if (
        Array.isArray(resumeData?.education) &&
        resumeData.education.length > 0
      ) {
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
              (doc.getStringUnitWidth(cert.date) * 10) /
              doc.internal.scaleFactor;
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

        // Create skills in a two-column layout with ratings in brackets
        const skills = resumeData.skills;

        // Calculate how many skills per column for balance
        const skillsPerColumn = Math.ceil(skills.length / 2);
        const colWidth = contentWidth / 2;

        // Initialize column positions
        let yPos = y;
        const leftColX = margin;
        const rightColX = margin + colWidth;
        const initialY = y;

        // Draw skills in two columns
        for (let i = 0; i < skills.length; i++) {
          // Check if we need a new page
          if (yPos + 10 > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
          }

          const skill = skills[i];
          // Format skill with rating
          let skillText = skill.name;
          if (skill.level) {
            skillText += ` (${skill.level}/5)`;
          }

          // Determine which column to place this skill
          const isLeftColumn = i < skillsPerColumn;
          const xPos = isLeftColumn ? leftColX : rightColX;

          // For right column, reset Y position if it's the first item
          if (!isLeftColumn && i === skillsPerColumn) {
            yPos = initialY;
          }

          // Place in appropriate column
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(skillText, xPos, yPos);

          // Increment Y position for next skill in same column
          if (
            (isLeftColumn && i < skillsPerColumn - 1) ||
            (!isLeftColumn && i < skills.length - 1)
          ) {
            yPos += 6;
          }
        }
      }

      // Convert to blob for preview
      const pdfOutput = doc.output("blob");
      setPdfBlob(pdfOutput);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1); // Reset to first page when new document loads
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF");
    setLoading(false);
  };

  return (
    <div className="pdf-preview-outer-container">
      <div className="pdf-preview-container">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p>{error}</p>
          </div>
        ) : pdfBlob ? (
          <div
            className="pdf-pages-container"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            {/* Desktop view - show all pages */}
            <div className="hidden md:block">
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                onError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-full">
                    Loading PDF...
                  </div>
                }
                className="pdf-document"
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <div key={`page_${index + 1}`} className="pdf-page-wrapper">
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={1}
                      className="pdf-page-react"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      error={<div>Failed to load page {index + 1}</div>}
                      loading={<div>Loading page {index + 1}...</div>}
                    />
                  </div>
                ))}
              </Document>
            </div>

            {/* Mobile view - show one page at a time */}
            <div className="block md:hidden">
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                onError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-full">
                    Loading PDF...
                  </div>
                }
                className="pdf-document"
              >
                <div className="pdf-page-wrapper">
                  <Page
                    pageNumber={currentPage}
                    scale={1}
                    className="pdf-page-react"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              </Document>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Unable to generate PDF preview</p>
          </div>
        )}
      </div>

      {/* Mobile navigation controls */}
      {numPages > 1 && (
        <div className="flex justify-center gap-4 mt-4 md:hidden">
          <button
            onClick={prevPage}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center px-3 py-2 bg-white rounded-full shadow-md">
            Page {currentPage} of {numPages}
          </div>

          <button
            onClick={nextPage}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === numPages}
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Zoom controls */}
      <div className="hidden md:flex md:fixed md:bottom-4 md:right-4 pdf-controls">
        <button
          onClick={zoomOut}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          aria-label="Zoom out"
        >
          <ZoomOut size={20} />
        </button>
        <div className="flex items-center px-3 py-2 bg-white shadow-md">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={zoomIn}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          aria-label="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
      </div>
    </div>
  );
};

export default PDFPreviewGenerator;
