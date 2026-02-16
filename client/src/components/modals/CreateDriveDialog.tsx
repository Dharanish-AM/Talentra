import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataStore } from "@/store/dataStore";
import { DEPARTMENTS } from "@/constants";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateDriveDialog({ open, onOpenChange }: Props) {
  const { companies, addDrive } = useDataStore();
  const [form, setForm] = useState({
    companyId: "",
    title: "",
    role: "",
    description: "",
    package: "",
    location: "",
    minCgpa: "7.0",
    maxBacklogs: "0",
    deadline: "",
    driveDate: "",
    status: "upcoming" as const,
    allowedDepartments: [] as string[],
  });

  const toggleDept = (dept: string) => {
    setForm((f) => ({
      ...f,
      allowedDepartments: f.allowedDepartments.includes(dept)
        ? f.allowedDepartments.filter((d) => d !== dept)
        : [...f.allowedDepartments, dept],
    }));
  };

  const handleSubmit = () => {
    const company = companies.find((c) => c.id === form.companyId);
    if (!company || !form.title || !form.role) {
      toast({
        title: "Missing fields",
        description: "Fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    addDrive({
      companyId: form.companyId,
      companyName: company.name,
      title: form.title,
      role: form.role,
      description: form.description,
      package: form.package,
      location: form.location,
      eligibility: {
        minCgpa: parseFloat(form.minCgpa),
        allowedDepartments: form.allowedDepartments,
        maxBacklogs: parseInt(form.maxBacklogs),
      },
      deadline: form.deadline,
      driveDate: form.driveDate,
      status: form.status,
    });
    toast({
      title: "Drive created",
      description: `${form.title} has been created.`,
    });
    setForm({
      companyId: "",
      title: "",
      role: "",
      description: "",
      package: "",
      location: "",
      minCgpa: "7.0",
      maxBacklogs: "0",
      deadline: "",
      driveDate: "",
      status: "upcoming",
      allowedDepartments: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Job Drive</DialogTitle>
          <DialogDescription>
            Set up a new campus recruitment drive.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Company *</Label>
            <Select
              value={form.companyId}
              onValueChange={(v) => setForm({ ...form, companyId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Campus 2025"
              />
            </div>
            <div>
              <Label>Role *</Label>
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Software Engineer"
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Package</Label>
              <Input
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value })}
                placeholder="₹12 LPA"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Bangalore"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Min CGPA</Label>
              <Input
                type="number"
                step="0.1"
                value={form.minCgpa}
                onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
              />
            </div>
            <div>
              <Label>Max Backlogs</Label>
              <Input
                type="number"
                value={form.maxBacklogs}
                onChange={(e) =>
                  setForm({ ...form, maxBacklogs: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: any) => setForm({ ...form, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
            <div>
              <Label>Drive Date</Label>
              <Input
                type="date"
                value={form.driveDate}
                onChange={(e) =>
                  setForm({ ...form, driveDate: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label>Allowed Departments</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => toggleDept(dept)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    form.allowedDepartments.includes(dept)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Drive</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
