// components/AIAssistant.tsx
"use client";

import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";

interface AIAssistantProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const AIAssistant = ({ resumeData, setResumeData }: AIAssistantProps) => {
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState<string>("");

  const handleAISuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, field }),
      });

      const data = await response.json();

      if (field === "summary") {
        setResumeData({
          ...resumeData,
          personal: { ...resumeData.personal, summary: data.suggestion },
        });
      } else if (field.startsWith("experience-")) {
        const index = parseInt(field.split("-")[1]);
        const newExperiences = [...resumeData.experiences];
        newExperiences[index] = {
          ...newExperiences[index],
          description: data.suggestion,
        };
        setResumeData({ ...resumeData, experiences: newExperiences });
      }
      // Handle other fields similarly
    } catch (error) {
      console.error("AI suggestion error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-100 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base">
          <SparklesIcon className="w-4 h-4 mr-2" />
          AI Suggestion Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={field} onValueChange={setField}>
          <SelectTrigger>
            <SelectValue placeholder="Select field for AI suggestions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summary">Professional Summary</SelectItem>
            {resumeData.experiences.map((exp, idx) => (
              <SelectItem key={exp.id} value={`experience-${idx}`}>
                Experience: {exp.company || `Position ${idx + 1}`}
              </SelectItem>
            ))}
            {/* Add more options for other fields */}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAISuggestion}
          disabled={loading || !field}
          className="w-full"
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
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
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4 mr-2" />
              Get AI Suggestion
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
