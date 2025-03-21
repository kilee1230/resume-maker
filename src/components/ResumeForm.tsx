"use client";

import { ResumeData } from "@/types/resume";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalForm from "./forms/PersonalForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import CertificationsForm from "./forms/CertificationsForm";
import { User, Briefcase, GraduationCap, Award, Wrench } from "lucide-react";

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ResumeForm = ({
  resumeData,
  setResumeData,
  activeSection,
  setActiveSection,
}: ResumeFormProps) => {
  return (
    <Tabs
      value={activeSection}
      onValueChange={setActiveSection}
      className="space-y-4"
    >
      <div className="p-2 pb-8 rounded-lg">
        <TabsList className="flex flex-wrap w-full gap-2 bg-transparent">
          <TabsTrigger
            value="personal"
            className="rounded-full px-3 py-1.5 text-xs flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
          >
            <User size={12} />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger
            value="experiences"
            className="rounded-full px-3 py-1.5 text-xs flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
          >
            <Briefcase size={12} />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="rounded-full px-3 py-1.5 text-xs flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
          >
            <GraduationCap size={12} />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="rounded-full px-3 py-1.5 text-xs flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
          >
            <Award size={12} />
            <span className="hidden sm:inline">Certifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="rounded-full px-3 py-1.5 text-xs flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
          >
            <Wrench size={12} />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="personal" className="pt-2">
        <PersonalForm
          personal={resumeData.personal}
          setPersonal={(personal) => setResumeData({ ...resumeData, personal })}
        />
      </TabsContent>

      <TabsContent value="experiences" className="pt-2">
        <ExperienceForm
          experiences={resumeData.experiences}
          setExperiences={(experiences) =>
            setResumeData({ ...resumeData, experiences })
          }
        />
      </TabsContent>

      <TabsContent value="education" className="pt-2">
        <EducationForm
          education={resumeData.education}
          setEducation={(education) =>
            setResumeData({ ...resumeData, education })
          }
        />
      </TabsContent>

      <TabsContent value="certifications" className="pt-4">
        <CertificationsForm
          certifications={resumeData.certifications}
          setCertifications={(certifications) =>
            setResumeData({ ...resumeData, certifications })
          }
        />
      </TabsContent>

      <TabsContent value="skills" className="pt-2">
        <SkillsForm
          skills={resumeData.skills}
          setSkills={(skills) => setResumeData({ ...resumeData, skills })}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ResumeForm;
