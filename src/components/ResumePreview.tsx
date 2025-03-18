// components/ResumePreview.tsx
"use client";

import { ResumeData } from "@/types/resume";
import PDFPreviewGenerator from "./PDFPreviewGenerator";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumePreview = ({ resumeData }: ResumePreviewProps) => {
  return <PDFPreviewGenerator resumeData={resumeData} />;
};

export default ResumePreview;
