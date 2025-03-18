// app/page.tsx
"use client";

import { useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import AIAssistant from "@/components/AIAssistant";
import ExportPDF from "@/components/ExportPDF";
import { ResumeData, defaultResumeData } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeSection, setActiveSection] = useState<string>("personal");

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Editor section */}
      <div className="w-full space-y-4 lg:w-3/5 xl:w-1/2">
        <Card>
          <CardContent className="pt-6">
            <ResumeForm
              resumeData={resumeData}
              setResumeData={setResumeData}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </CardContent>
        </Card>

        <AIAssistant resumeData={resumeData} setResumeData={setResumeData} />

        <Card>
          <CardContent className="pt-6">
            <ExportPDF resumeData={resumeData} />
          </CardContent>
        </Card>
      </div>

      {/* Preview section */}
      <div className="w-full lg:w-2/5 xl:w-1/2">
        <div className="sticky top-20">
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}
