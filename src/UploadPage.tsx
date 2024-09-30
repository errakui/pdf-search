import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // Normalizza il nome del file per evitare caratteri problematici
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;

      // Carica il file su Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('pdfs')
        .upload(`pdfs/${fileName}`, file);

      if (uploadError) throw new Error('Errore durante il caricamento del file.');

      // Chiama l'Edge Function per elaborare il PDF
      const { data: functionData, error: functionError } = await supabase.functions.invoke('process-pdf', {
        body: { filePath: `pdfs/${fileName}` },
      });

      if (functionError) throw new Error(`Errore durante l'elaborazione del PDF: ${functionError.message}`);

      setMessage('File caricato ed elaborato con successo!');
    } catch (error: any) {
      setMessage(`Errore: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Carica un PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Carica PDF</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadPage;
