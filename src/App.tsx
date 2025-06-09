import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Channel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  subscriberCount: number;
  pageToken?: string;
}

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ minSubs: 0, maxSubs: 1000000 });
  const [pageToken, setPageToken] = useState<string | null>(null);

  // Funzione per filtrare i canali in base al numero di iscritti
  const filterChannels = (channelsToFilter: Channel[]): Channel[] => {
    return channelsToFilter.filter(channel => 
      channel.subscriberCount >= filters.minSubs && 
      (filters.maxSubs === 0 || channel.subscriberCount <= filters.maxSubs)
    );
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setChannels([]);
    // Effettua una vera ricerca tramite l'API di YouTube (tramite un endpoint di backend che poi chiama l'API di YouTube tramite la chiave API fornita dall'utente).
    // Nota: sostituisci l'endpoint con quello reale (ad esempio, un endpoint di backend che effettua la chiamata all'API di YouTube tramite la chiave API fornita dall'utente) e gestisci la risposta (ad esempio, mappando i risultati in un oggetto Channel).
    try {
      const response = await fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent(query) + '&type=channel&key=AIzaSyCAoiBFT07SgrkEZyj3MIoRW6bqUANiFko');
      if (!response.ok) {
         throw new Error('Errore nella ricerca');
      }
      const data = await response.json();
      // (esempio di mappatura dei risultati, adattare in base alla risposta reale)
      const mappedChannels: Channel[] = data.items.map((item: any) => ({ id: item.id.channelId, title: item.snippet.title, description: item.snippet.description, thumbnail: item.snippet.thumbnails.default.url, url: 'https://youtube.com/channel/' + item.id.channelId, subscriberCount: (item.statistics && item.statistics.subscriberCount) ? parseInt(item.statistics.subscriberCount, 10) : 0 /* (esempio: numero di iscritti) */ }));
      // Per ogni canale (ad esempio, "mappedChannels") effettuo una chiamata (ad esempio, "fetch") a "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=…" (dove "…" è l'id del canale) tramite l'API di YouTube (ad esempio, tramite "fetch") e, se la risposta è ok, aggiorno (ad esempio, "setChannels([...channels, ...mappedChannels]);") lo stato (ad esempio, "channels") (ad esempio, "setChannels([...channels, ...mappedChannels]);") con il numero di iscritti (ad esempio, "item.statistics.subscriberCount") (ad esempio, "setChannels([...channels, ...mappedChannels]);").
      const promises = mappedChannels.map(async (channel) => {
         const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + channel.id + '&key=AIzaSyCAoiBFT07SgrkEZyj3MIoRW6bqUANiFko');
         if (res.ok) {
            const resData = await res.json();
            if (resData.items && resData.items[0] && resData.items[0].statistics && resData.items[0].statistics.subscriberCount) {
               channel.subscriberCount = parseInt(resData.items[0].statistics.subscriberCount, 10);
            }
         }
         return channel;
      });
      const updatedChannels = await Promise.all(promises);
      // Applico il filtro prima di aggiornare lo stato
      const filteredChannels = filterChannels(updatedChannels);
      setChannels(filteredChannels);
      setPageToken(data.nextPageToken); /* (esempio: aggiorno il token per la pagina successiva) */
    } catch (err) {
       setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
       setLoading(false);
    }
  };

  const handleSearchMore = async () => {
    if (!pageToken) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent(query) + '&type=channel&key=AIzaSyCAoiBFT07SgrkEZyj3MIoRW6bqUANiFko&pageToken=' + pageToken);
      if (!response.ok) {
         throw new Error('Errore nella ricerca');
      }
      const data = await response.json();
      const mappedChannels: Channel[] = data.items.map((item: any) => ({ id: item.id.channelId, title: item.snippet.title, description: item.snippet.description, thumbnail: item.snippet.thumbnails.default.url, url: 'https://youtube.com/channel/' + item.id.channelId, subscriberCount: (item.statistics && item.statistics.subscriberCount) ? parseInt(item.statistics.subscriberCount, 10) : 0 /* (esempio: numero di iscritti) */ }));
      // Per ogni canale (ad esempio, "mappedChannels") effettuo una chiamata (ad esempio, "fetch") a "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=…" (dove "…" è l'id del canale) tramite l'API di YouTube (ad esempio, tramite "fetch") e, se la risposta è ok, aggiorno (ad esempio, "setChannels([...channels, ...mappedChannels]);") lo stato (ad esempio, "channels") (ad esempio, "setChannels([...channels, ...mappedChannels]);") con il numero di iscritti (ad esempio, "item.statistics.subscriberCount") (ad esempio, "setChannels([...channels, ...mappedChannels]);").
      const promises = mappedChannels.map(async (channel) => {
         const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + channel.id + '&key=AIzaSyCAoiBFT07SgrkEZyj3MIoRW6bqUANiFko');
         if (res.ok) {
            const resData = await res.json();
            if (resData.items && resData.items[0] && resData.items[0].statistics && resData.items[0].statistics.subscriberCount) {
               channel.subscriberCount = parseInt(resData.items[0].statistics.subscriberCount, 10);
            }
         }
         return channel;
      });
      const updatedChannels = await Promise.all(promises);
      // Applico il filtro ai nuovi canali e li unisco a quelli esistenti
      const filteredNewChannels = filterChannels(updatedChannels);
      setChannels([...channels, ...filteredNewChannels]);
      setPageToken(data.nextPageToken); /* (esempio: aggiorno il token per la pagina successiva) */
    } catch (err) {
       setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
       setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: { xs: 2, sm: 4, md: 8 }, 
        px: { xs: 1, sm: 2, md: 3 }, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'url("https://cms.studyinsweden.se//app/uploads/2016/05/research.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)', // This creates the transparency effect
          zIndex: 0
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 3, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        boxShadow: 1, 
        p: 2, 
        maxWidth: 'sm', 
        mx: 'auto', 
        width: '100%',
        position: 'relative', // This ensures the content stays above the background
        zIndex: 1 // This ensures the content stays above the background
      }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'primary.main' }}> Channel Scanner (YouTube) </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
          <TextField
            fullWidth
            label="Cerca un argomento o una frase"
            variant="outlined"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            startIcon={<SearchIcon />}
            sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
          >
            Cerca
          </Button>
        </Box>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
          <TextField
            label="Min iscritti"
            type="number"
            value={filters.minSubs}
            onChange={(e) => {
              const newMinSubs = parseInt(e.target.value, 10) || 0;
              setFilters({ ...filters, minSubs: newMinSubs });
              // Riapplico il filtro ai canali esistenti quando cambia il filtro
              setChannels(filterChannels(channels));
            }}
          />
          <TextField
            label="Max iscritti"
            type="number"
            value={filters.maxSubs}
            onChange={(e) => {
              const newMaxSubs = parseInt(e.target.value, 10) || 0;
              setFilters({ ...filters, maxSubs: newMaxSubs });
              // Riapplico il filtro ai canali esistenti quando cambia il filtro
              setChannels(filterChannels(channels));
            }}
          />
        </Box>
        <List sx={{ width: '100%' }}>
          {channels.map(channel => (
            <ListItem key={channel.id} alignItems="flex-start" disableGutters component="a" href={channel.url} target="_blank" sx={{ borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
              <ListItemAvatar>
                <Avatar src={channel.thumbnail} alt={channel.title} />
              </ListItemAvatar>
              <ListItemText
                primary={channel.title}
                secondary={channel.description + " (Iscritti: " + channel.subscriberCount + ")"}
              />
            </ListItem>
          ))}
        </List>
        {pageToken && (
          <Button onClick={handleSearchMore} sx={{ mt: 2, bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}>Carica altro (o "Next")</Button>
        )}
      </Box>
    </Container>
  );
};

export default App;
