import { createClient, SupabaseClient, User, Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes("your-supabase-project-id");

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: string | null;
}

/**
 * Sign up a new user using Email & Password.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse> {
  if (!supabase) {
    return {
      user: null,
      session: null,
      error: "Supabase credentials are not configured in .env.local yet."
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || ""
      }
    }
  });

  return {
    user: data.user,
    session: data.session,
    error: error ? error.message : null
  };
}

/**
 * Sign in existing user using Email & Password.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (!supabase) {
    return {
      user: null,
      session: null,
      error: "Supabase credentials are not configured in .env.local yet."
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return {
    user: data.user,
    session: data.session,
    error: error ? error.message : null
  };
}

/**
 * Sign in using Google OAuth 2.0 via Supabase.
 */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  if (!supabase) {
    return {
      error: "Supabase credentials are not configured in .env.local yet."
    };
  }

  const redirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "http://localhost:3000/auth/callback";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: "offline",
        prompt: "select_account"
      }
    }
  });

  if (error) {
    if (
      error.message.includes("missing OAuth secret") ||
      error.message.includes("validation_failed") ||
      error.message.includes("Unsupported provider")
    ) {
      return {
        error:
          "Google OAuth Secret missing in Supabase Dashboard. Please enter your Google Client Secret in Supabase Auth -> Providers -> Google."
      };
    }
    return { error: error.message };
  }

  if (data?.url && typeof window !== "undefined") {
    window.location.href = data.url;
  }

  return { error: null };
}


/**
 * Sign out current authenticated user session.
 */
export async function signOutUser(): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: null };
  }

  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

/**
 * Get current authenticated user session.
 */
export async function getCurrentSession(): Promise<{ user: User | null; session: Session | null }> {
  if (!supabase) {
    return { user: null, session: null };
  }

  const { data } = await supabase.auth.getSession();
  return { user: data.session?.user || null, session: data.session };
}

/**
 * Subscribe to Supabase authentication state changes.
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  if (!supabase) {
    return { unsubscribe: () => {} };
  }

  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return authListener.subscription;
}
