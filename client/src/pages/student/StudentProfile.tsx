import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { studentApi } from "@/services/student.api";
import PageHeader from "@/components/shared/PageHeader";
import EditProfileDialog from "@/components/modals/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { StudentProfile as StudentProfileType } from "@/types";
import { Pencil, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function StudentProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfileType | undefined>();
  const [showEdit, setShowEdit] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentApi.getProfile();
        setProfile(data);
        if (data.resumeUrl) {
          // Extract filename from path
          const fileName = data.resumeUrl.split(/[\\/]/).pop();
          setResumeName(fileName || "Resume.pdf");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsUploading(true);
        const updatedProfile = await studentApi.uploadResume(file);
        setProfile(updatedProfile);
        setResumeName(file.name);
        toast({
          title: "Resume uploaded",
          description: "Your resume has been uploaded successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload resume. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleViewResume = () => {
    if (profile?.resumeUrl) {
      // Clean path separators (replace backslashes with forward slashes)
      const cleanPath = profile.resumeUrl.replace(/\\/g, "/");
      // Get base URL (remove /api from the end if present)
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
        "http://localhost:8000";

      // Construct full URL
      const url = `${baseUrl}/${cleanPath}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your academic and professional details."
        action={
          profile ? (
            <Button onClick={() => setShowEdit(true)} className="gap-2">
              <Pencil className="h-4 w-4" /> Edit Profile
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-bold text-primary">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {user?.name}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {profile && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Department", value: profile.department },
                { label: "CGPA", value: profile.cgpa.toFixed(1) },
                { label: "Backlogs", value: profile.backlogs },
                { label: "Phone", value: profile.phone },
                { label: "Graduation Year", value: profile.graduationYear },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs font-medium text-muted-foreground">
                    {field.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-3 font-display text-sm font-semibold text-foreground">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {skill}
                </span>
              ))}
              {(!profile || profile.skills.length === 0) && (
                <p className="text-xs text-muted-foreground">
                  No skills added yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-3 font-display text-sm font-semibold text-foreground">
              Resume
            </h3>
            {resumeName ? (
              <div
                className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleViewResume}
                title="Click to view resume"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive text-xs font-bold">
                  PDF
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {resumeName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded just now
                  </p>
                </div>
                <label
                  className={`cursor-pointer text-xs font-medium text-primary hover:underline ${isUploading ? "pointer-events-none opacity-50" : ""}`}
                >
                  {isUploading ? "Uploading..." : "Replace"}
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            ) : (
              <label className="block cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {isUploading ? "Uploading..." : "Click to upload your resume"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF format, max 5MB
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {profile && (
        <EditProfileDialog
          open={showEdit}
          onOpenChange={setShowEdit}
          profile={profile}
          onSave={(updated) => setProfile(updated)}
        />
      )}
    </div>
  );
}
