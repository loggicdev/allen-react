import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase env vars missing");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const email = "davinanuque@gmail.com";
  const password = "12345678";
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Error creating user:", error.message);
      process.exit(1);
    }
    console.log("User created:", data.user);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

main();
