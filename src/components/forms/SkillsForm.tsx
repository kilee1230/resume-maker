"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Skill } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, XIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";

// Simplified version without drag and drop for now
const SkillsForm = ({
  skills,
  setSkills,
}: {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
}) => {
  // Create a local state to track skills
  const [localSkills, setLocalSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [showLevels, setShowLevels] = useState<boolean>(false);

  // Sync with parent state when props change
  useEffect(() => {
    if (Array.isArray(skills)) {
      setLocalSkills(skills);
    } else {
      setLocalSkills([]);
    }
  }, [skills]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const skill: Skill = {
      id: uuidv4(),
      name: newSkill.trim(),
      level: showLevels ? 3 : undefined,
    };

    const updatedSkills = [...localSkills, skill];
    setLocalSkills(updatedSkills);
    setSkills(updatedSkills);
    setNewSkill("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (id: string) => {
    const updatedSkills = localSkills.filter((skill) => skill.id !== id);
    setLocalSkills(updatedSkills);
    setSkills(updatedSkills);
  };

  const handleLevelChange = (id: string, level: number) => {
    const updatedSkills = localSkills.map((skill) =>
      skill.id === id ? { ...skill, level } : skill
    );
    setLocalSkills(updatedSkills);
    setSkills(updatedSkills);
  };

  // Manual reordering functions
  const moveSkillUp = (index: number) => {
    if (index <= 0) return;
    const updatedSkills = [...localSkills];
    [updatedSkills[index - 1], updatedSkills[index]] = [
      updatedSkills[index],
      updatedSkills[index - 1],
    ];
    setLocalSkills(updatedSkills);
    setSkills(updatedSkills);
  };

  const moveSkillDown = (index: number) => {
    if (index >= localSkills.length - 1) return;
    const updatedSkills = [...localSkills];
    [updatedSkills[index], updatedSkills[index + 1]] = [
      updatedSkills[index + 1],
      updatedSkills[index],
    ];
    setLocalSkills(updatedSkills);
    setSkills(updatedSkills);
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
          type="button"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {localSkills.length === 0 ? (
        <div className="p-4 text-center border border-gray-300 border-dashed rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No skills added yet. Add some skills above.
          </p>
        </div>
      ) : (
        <div className="pt-6">
          <div className="space-y-2">
            {localSkills.map((skill, index) => (
              <div key={skill.id} className="flex items-center gap-2 group">
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0.5 opacity-70 hover:opacity-100 focus:ring-0"
                    onClick={() => moveSkillUp(index)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0.5 opacity-70 hover:opacity-100 focus:ring-0"
                    onClick={() => moveSkillDown(index)}
                    disabled={index === localSkills.length - 1}
                    title="Move down"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                </div>
                <Badge
                  variant="secondary"
                  className="flex items-center flex-1 gap-2 px-3 py-2 text-sm"
                >
                  <span>{skill.name}</span>

                  {showLevels && (
                    <div className="flex ml-2 space-x-1">
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
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 transition-colors rounded-full hover:bg-red-100 hover:text-red-600 focus:ring-0"
                  onClick={() => handleRemoveSkill(skill.id)}
                  type="button"
                  title="Remove skill"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Use the arrow buttons to reorder skills.
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
