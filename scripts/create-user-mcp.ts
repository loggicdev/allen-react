import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzzeewrkdruavnnecypl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6emVld3JrZHJ1YXZubmVjeXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDQ0NDQsImV4cCI6MjA2ODAyMDQ0NH0.-SBE14H0vUeNtUmDiaStAN30dmFcQCHuO-QMAV0nyb0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const email = 'davinanuque@gmail.com';
  const password = '12345678';
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: 'Davi Nanuque',
          phone: '+5511994072477',
          nickname: 'davinanuque',
        }
      }
    });
    if (error) {
      console.error('Error creating user:', error.message);
      process.exit(1);
    }
    console.log('User created:', data.user);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

main();
