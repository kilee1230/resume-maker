// components/ResumePreview.tsx
"use client";

import { ResumeData } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumePreview = ({ resumeData }: ResumePreviewProps) => {
  // Destructure resumeData with safe defaults for each property
  const {
    personal = {
      name: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      summary: "",
    },
    experiences = [],
    education = [],
    skills = [],
  } = resumeData || {};

  // Ensure all arrays are actually arrays
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const safeEducation = Array.isArray(education) ? education : [];
  const safeSkills = Array.isArray(skills) ? skills : [];

  return (
    <Card className="sticky resume-preview-container top-20">
      <CardContent className="p-8 print:p-0">
        <h1 className="mb-2 text-3xl font-bold text-center">
          {personal.name || "Your Name"}
        </h1>

        {/* Improve contact info wrapping with flex layout */}
        <div className="flex flex-wrap justify-center mb-6 text-muted-foreground gap-x-3 gap-y-1">
          {personal.email && (
            <span className="inline-block">{personal.email}</span>
          )}
          {personal.phone && (
            <span className="inline-block">{personal.phone}</span>
          )}
          {personal.location && (
            <span className="inline-block">{personal.location}</span>
          )}
          {personal.website && (
            <span className="inline-block">
              <a
                href={personal.website}
                className="text-primary hover:underline"
              >
                {personal.website}
              </a>
            </span>
          )}
        </div>

        {personal.summary && (
          <div className="mb-6">
            <h2 className="mb-3 text-xl font-bold">Summary</h2>
            <Separator className="mb-3" />
            <p className="break-words whitespace-pre-wrap text-muted-foreground">
              {personal.summary}
            </p>
          </div>
        )}

        {safeExperiences.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-xl font-bold">Experience</h2>
            <Separator className="mb-3" />
            {safeExperiences.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex flex-wrap items-baseline justify-between gap-y-1">
                  <h3 className="mr-2 font-bold">
                    {exp.title} | {exp.company}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  {exp.location}
                </p>
                {/* Use whitespace-pre-wrap and break-words for better text formatting */}
                <p className="mt-1 text-sm break-words whitespace-pre-wrap">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {safeEducation.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-xl font-bold">Education</h2>
            <Separator className="mb-3" />
            {safeEducation.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex flex-wrap items-baseline justify-between gap-y-1">
                  <h3 className="mr-2 font-bold">
                    {edu.degree} | {edu.institution}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </span>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  {edu.location}
                </p>
                {edu.description && (
                  <p className="mt-1 text-sm break-words whitespace-pre-wrap">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {safeSkills.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold">Skills</h2>
            <Separator className="mb-3" />
            <div className="flex flex-wrap gap-2">
              {safeSkills.map((skill) => (
                <Badge key={skill.id} variant="outline" className="py-1.5">
                  {skill.name}
                  {skill.level && (
                    <div className="flex items-center ml-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                            i < (skill.level ?? 0) ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
