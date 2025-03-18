// components/ResumeForm.tsx
"use client";

import { ResumeData } from "@/types/resume";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalForm from "./forms/PersonalForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";

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
      <div className="pb-1 overflow-x-auto">
        <TabsList className="grid grid-cols-4 w-full min-w-[400px]">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experiences">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
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
