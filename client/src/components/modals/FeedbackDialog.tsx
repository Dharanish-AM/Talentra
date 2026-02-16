import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataStore } from '@/store/dataStore';
import { toast } from '@/hooks/use-toast';
import { InterviewSlot } from '@/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview?: InterviewSlot | null;
}

export default function FeedbackDialog({ open, onOpenChange, interview }: Props) {
  const updateInterviewResult = useDataStore((s) => s.updateInterviewResult);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!interview) return;
    updateInterviewResult(interview.id, interview.result || 'pending', feedback);
    toast({ title: 'Feedback saved', description: `Feedback for ${interview.studentName} has been recorded.` });
    setFeedback('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Interview Feedback</DialogTitle>
          <DialogDescription>Add feedback for {interview?.studentName}</DialogDescription>
        </DialogHeader>
        <div><Label>Feedback</Label><Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Candidate showed strong technical skills..." rows={5} /></div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
