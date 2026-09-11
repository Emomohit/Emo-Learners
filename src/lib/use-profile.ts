import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type StudentProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  branch: string | null;
  current_semester: number | null;
  academic_year: number | null;
  created_at: string;
  updated_at: string;
};

export function useStudentProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["student-profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) throw new Error("Sign in to view your profile.");
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      return data as StudentProfile;
    },
  });
}

export async function getPrivateAvatarUrl(path: string | null) {
  if (!path) return null;
  const { data, error } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
  if (error) return path.startsWith("http") ? path : null;
  return data.signedUrl;
}