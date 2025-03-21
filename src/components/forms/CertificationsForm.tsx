// components/CertificationsForm.tsx
"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, parse, isValid } from "date-fns";
import { Certification } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/datepicker";
import { Trash2Icon } from "lucide-react";

interface CertificationsFormProps {
  certifications: Certification[];
  setCertifications: (certifications: Certification[]) => void;
}

const CertificationsForm = ({
  certifications,
  setCertifications,
}: CertificationsFormProps) => {
  const [activeCertification, setActiveCertification] = useState<number | null>(
    certifications.length > 0 ? 0 : null
  );

  const emptyCertification: Certification = {
    id: uuidv4(),
    name: "",
    issuer: "",
    date: "",
    url: "",
    description: "",
  };

  const handleAddCertification = () => {
    const newCertifications = [...certifications, emptyCertification];
    setCertifications(newCertifications);
    setActiveCertification(newCertifications.length - 1);
  };

  const handleRemoveCertification = (index: number) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
    if (activeCertification === index) {
      setActiveCertification(
        newCertifications.length > 0
          ? Math.min(index, newCertifications.length - 1)
          : null
      );
    } else if (activeCertification !== null && index < activeCertification) {
      setActiveCertification(activeCertification - 1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (activeCertification === null) return;
    const { name, value } = e.target;
    const updatedCertifications = [...certifications];
    updatedCertifications[activeCertification] = {
      ...updatedCertifications[activeCertification],
      [name]: value,
    };
    setCertifications(updatedCertifications);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (activeCertification === null) return;
    const formattedDate = date ? format(date, "MMM yyyy") : "";
    const updatedCertifications = [...certifications];
    updatedCertifications[activeCertification] = {
      ...updatedCertifications[activeCertification],
      date: formattedDate,
    };
    setCertifications(updatedCertifications);
  };

  // Helper function to parse date string to Date object
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      const date = parse(dateStr, "MMM yyyy", new Date());
      return isValid(date) ? date : undefined;
    } catch {
      return undefined;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Certifications</h2>
        <Button onClick={handleAddCertification} variant="outline" size="sm">
          + Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="p-4 text-center border border-gray-300 border-dashed rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No certifications added yet. Click the button above to add your
            certifications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 pb-2 overflow-x-auto">
            {certifications.map((cert, index) => (
              <Button
                key={cert.id}
                onClick={() => setActiveCertification(index)}
                variant={activeCertification === index ? "secondary" : "ghost"}
                size="sm"
                className="whitespace-nowrap"
              >
                {cert.name || `Certification ${index + 1}`}
              </Button>
            ))}
          </div>

          {activeCertification !== null && (
            <div className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certification Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={certifications[activeCertification].name}
                  onChange={handleChange}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization</Label>
                <Input
                  id="issuer"
                  name="issuer"
                  value={certifications[activeCertification].issuer}
                  onChange={handleChange}
                  placeholder="Amazon Web Services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date Earned</Label>
                <DatePicker
                  date={parseDate(certifications[activeCertification].date)}
                  onDateChange={handleDateChange}
                  placeholder="DD-MM-YYYY"
                  inputFormat="dd-MM-yyyy"
                  format="MMM yyyy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Credential URL (optional)</Label>
                <Input
                  id="url"
                  name="url"
                  value={certifications[activeCertification].url}
                  onChange={handleChange}
                  placeholder="https://www.credential.net/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={certifications[activeCertification].description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of the certification or skills demonstrated"
                />
              </div>

              <Separator />

              <Button
                onClick={() => handleRemoveCertification(activeCertification)}
                variant="destructive"
                size="sm"
                className="flex items-center"
              >
                <Trash2Icon className="w-4 h-4 mr-2" />
                Remove this certification
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationsForm;
