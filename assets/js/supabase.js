// assets/js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = "https://rymehgsoarjeecuwyhny.supabase.co"

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5bWVoZ3NvYXJqZWVjdXd5aG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTc0ODUsImV4cCI6MjA4NjIzMzQ4NX0.K9BUapByrh6TsSi5jEkL8HGLDmMT_tGSSykl7LGxIec"

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)
