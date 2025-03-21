"use client";
import { useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import AIAssistant from "@/components/AIAssistant";
import ExportPDF from "@/components/ExportPDF";
import { ResumeData, defaultResumeData } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import React from "react";

interface EditorContentProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  closeDrawer: () => void;
}

const EditorContent: React.FC<EditorContentProps> = React.memo(
  ({
    resumeData,
    setResumeData,
    activeSection,
    setActiveSection,
    closeDrawer,
  }) => (
    <div className="space-y-4 overflow-y-auto">
      <div className="flex justify-end mb-2 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close drawer"
          onClick={closeDrawer}
        />
      </div>
      <div className="pl-4 pr-4">
        <Card>
          <CardContent>
            <ResumeForm
              resumeData={resumeData}
              setResumeData={setResumeData}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </CardContent>
        </Card>
        <div className="my-4"></div>
        <AIAssistant resumeData={resumeData} setResumeData={setResumeData} />
        <div className="my-4"></div>
        <ExportPDF resumeData={resumeData} />
      </div>
    </div>
  )
);

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="flex flex-col w-full">
      {/* Mobile Drawer Button - Made more prominent */}
      <div className="fixed z-10 bottom-6 right-6 lg:hidden">
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="flex items-center justify-center rounded-full shadow-lg bg-primary hover:bg-primary/90 h-14 w-14"
            >
              <Pencil className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <EditorContent
              resumeData={resumeData}
              setResumeData={setResumeData}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              closeDrawer={closeDrawer}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Editor section (visible only on desktop) */}
        <div className="sticky top-0 hidden w-2/5 h-screen lg:block">
          <EditorContent
            resumeData={resumeData}
            setResumeData={setResumeData}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            closeDrawer={closeDrawer}
          />
        </div>
        {/* Preview section (full width on mobile, partial on desktop) */}
        <div className="w-full overflow-y-auto lg:w-3/5">
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}
