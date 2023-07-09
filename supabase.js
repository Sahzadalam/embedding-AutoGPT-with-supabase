const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://vsvruqboklarraycphzr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdnJ1cWJva2xhcnJheWNwaHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyMDE5MjQsImV4cCI6MjAwMTc3NzkyNH0.tHFILZuJgDHPAmVfoA7d6FVWH747Qk7Rt9Dqsf6L4cI";
const supabase = createClient(supabaseUrl, supabaseKey, {
  persistSession: false,
});

module.exports = supabase;
