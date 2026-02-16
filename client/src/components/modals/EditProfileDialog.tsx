import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { StudentProfile } from '@/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: StudentProfile;
  onSave: (profile: StudentProfile) => void;
}

export default function EditProfileDialog({ open, onOpenChange, profile, onSave }: Props) {
  const [form, setForm] = useState<StudentProfile>({ ...profile });
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = () => {
    onSave(form);
    toast({ title: 'Profile updated', description: 'Your profile has been saved.' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your academic and contact details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Department</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>CGPA</Label><Input type="number" step="0.1" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: parseFloat(e.target.value) })} /></div>
            <div><Label>Backlogs</Label><Input type="number" value={form.backlogs} onChange={(e) => setForm({ ...form, backlogs: parseInt(e.target.value) })} /></div>
          </div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label>Graduation Year</Label><Input type="number" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: parseInt(e.target.value) })} /></div>
          <div>
            <Label>Skills</Label>
            <div className="mt-2 flex flex-wrap gap-1">
              {form.skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  {s}
                  <button onClick={() => removeSkill(s)} className="ml-1 text-accent/60 hover:text-accent">×</button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add skill..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <Button type="button" variant="outline" size="sm" onClick={addSkill}>Add</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
