// components/forms/PersonalForm.tsx
"use client";

import { useState } from "react";
import { Personal } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalFormProps {
  personal: Personal;
  setPersonal: (personal: Personal) => void;
}

const PersonalForm = ({ personal, setPersonal }: PersonalFormProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPersonal({ ...personal, [name]: value });
  };

  return (
    <div className="pt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={personal.name}
          onChange={handleChange}
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={personal.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={personal.phone}
          onChange={handleChange}
          placeholder="(123) 456-7890"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={personal.location}
          onChange={handleChange}
          placeholder="New York, NY"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website/Portfolio (optional)</Label>
        <Input
          type="url"
          id="website"
          name="website"
          value={personal.website}
          onChange={handleChange}
          placeholder="https://portfolio.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          value={personal.summary}
          onChange={handleChange}
          rows={4}
          placeholder="A brief summary of your professional background and career goals"
        />
      </div>
    </div>
  );
};

export default PersonalForm;
