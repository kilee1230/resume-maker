"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

import { Experience } from "@/types/resume";
import { parseDate } from "@/utils/parseDate";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/datepicker";

import { Trash2Icon } from "lucide-react";

interface ExperienceFormProps {
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
}

const ExperienceForm = ({
  experiences,
  setExperiences,
}: ExperienceFormProps) => {
  const [activeExperience, setActiveExperience] = useState<number | null>(
    experiences.length > 0 ? 0 : null
  );

  const emptyExperience: Experience = {
    id: uuidv4(),
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };

  const handleAddExperience = () => {
    const newExperiences = [...experiences, emptyExperience];
    setExperiences(newExperiences);
    setActiveExperience(newExperiences.length - 1);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);

    if (activeExperience === index) {
      setActiveExperience(
        newExperiences.length > 0
          ? Math.min(index, newExperiences.length - 1)
          : null
      );
    } else if (activeExperience !== null && index < activeExperience) {
      setActiveExperience(activeExperience - 1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (activeExperience === null) return;

    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    const updatedExperiences = [...experiences];
    updatedExperiences[activeExperience] = {
      ...updatedExperiences[activeExperience],
      [name]: type === "checkbox" ? checked : value,
    };

    // If current is checked, clear the end date
    if (name === "current" && checked) {
      updatedExperiences[activeExperience].endDate = "";
    }

    setExperiences(updatedExperiences);
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (activeExperience === null) return;

    const updatedExperiences = [...experiences];
    updatedExperiences[activeExperience] = {
      ...updatedExperiences[activeExperience],
      current: checked,
      endDate: checked ? "" : updatedExperiences[activeExperience].endDate,
    };

    setExperiences(updatedExperiences);
  };

  const handleDateChange = (
    date: Date | undefined,
    field: "startDate" | "endDate"
  ) => {
    if (activeExperience === null || !date) return;
    const formattedDate = date ? format(date, "MMM yyyy") : "";
    const updatedExperiences = [...experiences];
    updatedExperiences[activeExperience] = {
      ...updatedExperiences[activeExperience],
      [field]: formattedDate,
    };

    setExperiences(updatedExperiences);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <Button onClick={handleAddExperience} variant="outline" size="sm">
          + Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-4 text-center border border-gray-300 border-dashed rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No work experience added yet. Click the button above to add your
            first position.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 pb-2 overflow-x-auto">
            {experiences.map((exp, index) => (
              <Button
                key={exp.id}
                onClick={() => setActiveExperience(index)}
                variant={activeExperience === index ? "secondary" : "ghost"}
                size="sm"
                className="whitespace-nowrap"
              >
                {exp.company || exp.title || `Position ${index + 1}`}
              </Button>
            ))}
          </div>

          {activeExperience !== null && (
            <div className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={experiences[activeExperience].title}
                  onChange={handleChange}
                  placeholder="Software Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={experiences[activeExperience].company}
                  onChange={handleChange}
                  placeholder="Tech Company Inc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={experiences[activeExperience].location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <DatePicker
                    date={parseDate(experiences[activeExperience].startDate)}
                    onDateChange={(date) => handleDateChange(date, "startDate")}
                    placeholder="DD-MM-YYYY"
                    inputFormat="dd-MM-yyyy"
                    format="MMM yyyy"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <DatePicker
                    date={parseDate(
                      experiences[activeExperience].endDate || ""
                    )}
                    onDateChange={(date) => handleDateChange(date, "endDate")}
                    placeholder="DD-MM-YYYY"
                    inputFormat="dd-MM-yyyy"
                    format="MMM yyyy"
                    disabledDates={(date) => {
                      const startDate = parseDate(
                        experiences[activeExperience].startDate
                      );
                      return startDate ? date < startDate : false;
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current"
                  checked={experiences[activeExperience].current}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="current">I currently work here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={experiences[activeExperience].description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your responsibilities and achievements"
                  className="resize-none min-h-[120px] break-anywhere"
                />
                <p className="text-xs text-muted-foreground">
                  Describe your responsibilities, achievements, and key
                  contributions in this role.
                </p>
              </div>

              <Separator />

              <Button
                onClick={() => handleRemoveExperience(activeExperience)}
                variant="destructive"
                size="sm"
                className="flex items-center"
              >
                <Trash2Icon className="w-4 h-4 mr-2" />
                Remove this position
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
