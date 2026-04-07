import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataStore } from '@/store/dataStore';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCompanyDialog({ open, onOpenChange }: Props) {
  const addCompany = useDataStore((s) => s.addCompany);
  const [form, setForm] = useState({ name: '', industry: '', description: '', website: '', contactEmail: '' });

  const handleSubmit = () => {
    if (!form.name || !form.industry || !form.description || !form.contactEmail) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    addCompany(form);
    toast({ title: 'Company added', description: `${form.name} has been registered.` });
    setForm({ name: '', industry: '', description: '', website: '', contactEmail: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>Register a new company for campus recruitment.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Company Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. TechCorp" /></div>
          <div><Label>Industry *</Label><Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. IT Services" /></div>
          <div><Label>Description *</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief company description..." /></div>
          <div><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." /></div>
          <div><Label>Contact Email *</Label><Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="contact@company.com" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Company</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
