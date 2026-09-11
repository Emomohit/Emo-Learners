import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Edit Profile — EMO Learners" }],
  }),
  component: ProfilePage,
});

type ProfileData = {
  full_name: string;
  branch: string;
  current_semester: number;
  avatar_url: string;
};

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    branch: "CSE",
    current_semester: 1,
    avatar_url: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      nav({ to: "/auth" });
    }
  }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, branch, current_semester, avatar_url")
        .eq("id", user!.id)
        .single();
      
      if (!error && data) {
        setProfile({
          full_name: data.full_name || "",
          branch: data.branch || "CSE",
          current_semester: data.current_semester || 1,
          avatar_url: data.avatar_url || "",
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!profile.full_name.trim()) {
      return toast.error("Name is required");
    }

    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      branch: profile.branch as any,
      current_semester: profile.current_semester,
      avatar_url: profile.avatar_url,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } else {
      toast.success("Profile updated successfully!");
      nav({ to: "/dashboard" });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must be less than 2MB.");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      setProfile((p) => ({ ...p, avatar_url: data.publicUrl }));
      toast.success("Avatar uploaded! Remember to save your profile.");
    } catch (error: any) {
      toast.error(error.message || "Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 py-12 md:py-24">
        <div className="max-w-2xl mx-auto panel p-6 md:p-10">
          <h1 className="font-display text-3xl font-bold mb-8">Edit Profile</h1>
          
          <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-surface flex items-center justify-center border-2 border-border group-hover:border-primary transition-colors">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-6 w-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-lg">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Full Name
                </label>
                <input
                  id="full_name"
                  type="text"
                  required
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="branch" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Branch
                  </label>
                  <select
                    id="branch"
                    value={profile.branch}
                    onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
                  >
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="CSE-IT">Information Technology (CSE-IT)</option>
                    <option value="CSE-CY">Cyber Security (CSE-CY)</option>
                    <option value="AIML">AI & Machine Learning (AIML)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="semester" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Current Semester
                  </label>
                  <select
                    id="semester"
                    value={profile.current_semester}
                    onChange={(e) => setProfile({ ...profile, current_semester: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem} ({Math.ceil(sem / 2)}{sem % 2 === 1 ? 'st' : sem % 2 === 2 && sem !== 2 ? 'nd' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Year)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-4">
              <button
                type="button"
                onClick={() => nav({ to: "/dashboard" })}
                className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Profile</>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
