import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrorMessage('Inserisci una query di ricerca valida.');
      return;
    }

    setSearching(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('pdf_metadata')
        .select('filename, storage_path')
        .textSearch('content', searchQuery, {
          type: 'plain',
          config: 'english',
        });

      if (error) throw error;

      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
        setErrorMessage('Nessun risultato trovato per la tua ricerca.');
      }
    } catch (error: any) {
      setErrorMessage(`Errore durante la ricerca: ${error.message}`);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <h2>Ricerca nei PDF</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Inserisci il testo da cercare"
        disabled={searching}
      />
      <button onClick={handleSearch} disabled={searching}>
        {searching ? 'Ricerca in corso...' : 'Cerca'}
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <ul>
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <li key={index}>
              <a href={`https://fxewoakhjjkzkksmqzdg.supabase.co/storage/v1/object/public/${result.storage_path}`}>
                {result.filename}
              </a>
            </li>
          ))
        ) : (
          !searching && <p>Nessun risultato trovato.</p>
        )}
      </ul>
    </div>
  );
};

export default SearchPage;
