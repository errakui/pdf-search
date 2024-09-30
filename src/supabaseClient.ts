import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fxewoakhjjkzkksmqzdg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZXdvYWtoampremtrc21xemRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2OTYyODIsImV4cCI6MjA0MzI3MjI4Mn0.6onMUPfkoS_PXmDWHQ26dlrCCAJ7bNnDKplkeBBPJpg'

export const supabase = createClient(supabaseUrl, supabaseKey)