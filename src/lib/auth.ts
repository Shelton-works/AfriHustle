import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'company', additionalData?: any) => {
  const redirectUrl = `${window.location.origin}/`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
        role: role,
        ...additionalData
      }
    }
  });

  if (error) return { error };
  if (!data.user) return { error: new Error("Failed to create user") };

  // Create user role and profiles client-side ONLY if we have an active session (email confirmation is disabled).
  // If email confirmation is enabled, data.session is null and we must rely on the database trigger.
  if (data.user && data.session) {
    try {
      // 1. Ensure the profile exists in public.profiles before referencing it
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      // 2. Create user role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', data.user.id)
        .eq('role', role)
        .maybeSingle();

      if (!existingRole) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role });

        if (roleError) {
          console.error("Error creating role:", roleError);
        }
      }

      // 3. Create student or company profile
      if (role === 'student') {
        const { data: existingStudent } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!existingStudent) {
          const { error: profileError } = await supabase
            .from('student_profiles')
            .insert({
              user_id: data.user.id,
              university: additionalData?.university || null,
              major: additionalData?.major || null
            });

          if (profileError) {
            console.error("Error creating student profile:", profileError);
          }
        }
      } else if (role === 'company') {
        const { data: existingCompany } = await supabase
          .from('company_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!existingCompany) {
          const { error: profileError } = await supabase
            .from('company_profiles')
            .insert({
              user_id: data.user.id,
              company_name: additionalData?.company_name || fullName,
              industry: additionalData?.industry || null
            });

          if (profileError) {
            console.error("Error creating company profile:", profileError);
          }
        }
      }
    } catch (err) {
      console.error("Gracefully handled signup post-creation error:", err);
    }
  }

  return { data, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase signOut error:", error);
    }
    return { error };
  } catch (err) {
    console.error("Unexpected error during signOut:", err);
    return { error: err };
  }
};

export const getSession = async (): Promise<{ session: Session | null; user: User | null }> => {
  const { data: { session } } = await supabase.auth.getSession();
  return { session, user: session?.user ?? null };
};

export const getUserRole = async (userId: string): Promise<'student' | 'company' | null> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data.role as 'student' | 'company';
};
