// components/forms/EducationForm.tsx
"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Education } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Trash2Icon } from "lucide-react";

interface EducationFormProps {
  education: Education[];
  setEducation: (education: Education[]) => void;
}

const EducationForm = ({ education, setEducation }: EducationFormProps) => {
  const [activeEducation, setActiveEducation] = useState<number | null>(
    education.length > 0 ? 0 : null
  );

  const emptyEducation: Education = {
    id: uuidv4(),
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };

  const handleAddEducation = () => {
    const newEducation = [...education, emptyEducation];
    setEducation(newEducation);
    setActiveEducation(newEducation.length - 1);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);

    if (activeEducation === index) {
      setActiveEducation(
        newEducation.length > 0
          ? Math.min(index, newEducation.length - 1)
          : null
      );
    } else if (activeEducation !== null && index < activeEducation) {
      setActiveEducation(activeEducation - 1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (activeEducation === null) return;

    const { name, value } = e.target;

    const updatedEducation = [...education];
    updatedEducation[activeEducation] = {
      ...updatedEducation[activeEducation],
      [name]: value,
    };

    setEducation(updatedEducation);
  };

  const handleDateChange = (
    date: Date | null,
    field: "startDate" | "endDate"
  ) => {
    if (activeEducation === null || !date) return;

    const formattedDate = format(date, "MMM yyyy");

    const updatedEducation = [...education];
    updatedEducation[activeEducation] = {
      ...updatedEducation[activeEducation],
      [field]: formattedDate,
    };

    setEducation(updatedEducation);
  };

  // Helper function to parse date string to Date object
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button onClick={handleAddEducation} variant="outline" size="sm">
          + Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="p-4 text-center border border-gray-300 border-dashed rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No education added yet. Click the button above to add your
            education.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 pb-2 overflow-x-auto">
            {education.map((edu, index) => (
              <Button
                key={edu.id}
                onClick={() => setActiveEducation(index)}
                variant={activeEducation === index ? "secondary" : "ghost"}
                size="sm"
                className="whitespace-nowrap"
              >
                {edu.institution || edu.degree || `Education ${index + 1}`}
              </Button>
            ))}
          </div>

          {activeEducation !== null && (
            <div className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree/Certificate</Label>
                <Input
                  id="degree"
                  name="degree"
                  value={education[activeEducation].degree}
                  onChange={handleChange}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={education[activeEducation].institution}
                  onChange={handleChange}
                  placeholder="University of Example"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={education[activeEducation].location}
                  onChange={handleChange}
                  placeholder="City, State/Country"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !education[activeEducation].startDate &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {education[activeEducation].startDate || "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          parseDate(education[activeEducation].startDate) ||
                          undefined
                        }
                        onSelect={(date) =>
                          handleDateChange(date ?? null, "startDate")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (or Expected)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !education[activeEducation].endDate &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {education[activeEducation].endDate || "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          parseDate(education[activeEducation].endDate ?? "") ||
                          undefined
                        }
                        onSelect={(date) =>
                          handleDateChange(date ?? null, "endDate")
                        }
                        disabled={(date) =>
                          parseDate(education[activeEducation].startDate)
                            ? date <
                              parseDate(education[activeEducation].startDate)!
                            : false
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={education[activeEducation].description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Relevant coursework, honors, activities, etc."
                />
              </div>

              <Separator />

              <Button
                onClick={() => handleRemoveEducation(activeEducation)}
                variant="destructive"
                size="sm"
                className="flex items-center"
              >
                <Trash2Icon className="w-4 h-4 mr-2" />
                Remove this education
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
