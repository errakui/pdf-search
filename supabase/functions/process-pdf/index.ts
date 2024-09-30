import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import pdf from "https://esm.sh/pdf-parse";

// CORS headers per consentire le richieste dal frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",  // Consentire tutte le origini (puoi sostituire "*" con l'URL specifico durante la produzione)
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",  // Consentire i metodi POST, GET e OPTIONS
};

const supabaseUrl = "https://fxewoakhjjkzkksmqzdg.supabase.co";
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZXdvYWtoampremtrc21xemRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzY5NjI4MiwiZXhwIjoyMDQzMjcyMjgyfQ.WNaqNQaG0gq9DiGNx0DIND2AVh4N7m6t5Tft-I1PYHM";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    // Rispondere correttamente alle richieste OPTIONS (preflight) con i CORS headers
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { filePath } = await req.json();

    // Scarica il file PDF da Supabase Storage
    const { data, error } = await supabase.storage.from('pdfs').download(filePath);
    if (error) throw new Error(`Errore nel download del file: ${error.message}`);

    // Usa pdf-parse per estrarre il testo dal PDF
    const buffer = await data.arrayBuffer();
    const pdfData = await pdf(Buffer.from(buffer));
    const extractedText = pdfData.text;

    // Salva il testo estratto nel database
    const { error: dbError } = await supabase
      .from('pdf_metadata')
      .update({ content: extractedText })
      .eq('storage_path', filePath);

    if (dbError) throw new Error(`Errore durante l'aggiornamento del database: ${dbError.message}`);

    return new Response(JSON.stringify({ message: "PDF processato con successo" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
