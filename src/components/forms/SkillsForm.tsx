// components/forms/SkillsForm.tsx
"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Skill } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, XIcon } from "lucide-react";

interface SkillsFormProps {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
}

const SkillsForm = ({ skills, setSkills }: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState<string>("");
  const [showLevels, setShowLevels] = useState<boolean>(false);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const skill: Skill = {
      id: uuidv4(),
      name: newSkill.trim(),
      level: showLevels ? 3 : undefined,
    };

    setSkills([...skills, skill]);
    setNewSkill("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handleLevelChange = (id: string, level: number) => {
    setSkills(
      skills.map((skill) => (skill.id === id ? { ...skill, level } : skill))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="show-levels" className="text-sm text-gray-600">
            Show skill levels
          </Label>
          <Switch
            id="show-levels"
            checked={showLevels}
            onCheckedChange={setShowLevels}
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill (e.g., JavaScript, Project Management)"
          className="flex-1"
        />
        <Button
          onClick={handleAddSkill}
          disabled={!newSkill.trim()}
          variant="secondary"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="p-4 text-center border border-gray-300 border-dashed rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No skills added yet. Add some skills above.
          </p>
        </div>
      ) : (
        <div className="pt-6">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-2 text-sm"
              >
                <span>{skill.name}</span>

                {showLevels && (
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleLevelChange(skill.id, level)}
                        className={`w-2 h-2 rounded-full ${
                          (skill.level || 0) >= level
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                        title={`Level ${level}`}
                      ></button>
                    ))}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-4 h-4 p-0 ml-1 rounded-full"
                  onClick={() => handleRemoveSkill(skill.id)}
                >
                  <XIcon className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
