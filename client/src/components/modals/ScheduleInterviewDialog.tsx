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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataStore } from "@/store/dataStore";
import { toast } from "@/hooks/use-toast";
import { Application } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: Application | null;
}

export default function ScheduleInterviewDialog({
  open,
  onOpenChange,
  application,
}: Props) {
  const { addInterview, updateApplicationStatus } = useDataStore();
  const [form, setForm] = useState({
    date: "",
    time: "",
    mode: "online" as "online" | "offline",
    link: "",
  });

  const handleSubmit = () => {
    if (!application || !form.date || !form.time) {
      toast({
        title: "Missing fields",
        description: "Please fill date and time.",
        variant: "destructive",
      });
      return;
    }
    addInterview({
      driveId: application.driveId,
      studentId: application.studentId,
      studentName: application.studentName,
      date: form.date,
      time: form.time,
      mode: form.mode,
      link: form.mode === "online" ? form.link : undefined,
      result: "pending",
    });
    updateApplicationStatus(application.id, "interview");
    toast({
      title: "Interview scheduled",
      description: `Interview with ${application.studentName} has been scheduled.`,
    });
    setForm({ date: "", time: "", mode: "online", link: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Schedule an interview for {application?.studentName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Time *</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Mode</Label>
            <Select
              value={form.mode}
              onValueChange={(v: "online" | "offline") =>
                setForm({ ...form, mode: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.mode === "online" && (
            <div>
              <Label>Meeting Link</Label>
              <Input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://meet.example.com/..."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
