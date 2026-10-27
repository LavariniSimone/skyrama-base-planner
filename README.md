# Skyrama Base Planner

App desktop (Electron) per pianificare la disposizione della base di Skyrama su una griglia: si definiscono le tipologie di edifici e potenziamenti, si posizionano sulla mappa con il drag & drop e si vedono subito i bonus che i potenziamenti applicano agli edifici vicini.

## Funzionalità

### Griglia
- Dimensioni configurabili dal menù (da 1 a 56 colonne/righe).
- Zoom con la rotella del mouse, pan trascinando lo sfondo, doppio clic per ripristinare lo zoom.
- Ridimensionando la griglia, le card che non entrano più vengono rimesse in deposito automaticamente.

### Tipologie
Ogni tipologia ha nome, colore e dimensioni in celle (fino a 30×30) e può essere di due tipi:

- **Edificio**
  - *Piazzola*: mostra la percentuale di bonus ricevuta dai potenziamenti.
  - *Hotel*: ha un numero di residenti e i minuti per il completamento; mostra i residenti totali, bonus compresi.
- **Potenziamento**
  - Effetto su *Piazzole* (bonus in %) oppure su *Hotel* (residenti aggiuntivi).
  - *Raggio* d'azione in celle (0 = nessun effetto, 1 = celle adiacenti).

### Inventario e posizionamento
- Per ogni tipologia si gestisce il numero totale di copie; quelle non piazzate restano in deposito.
- Si trascina una copia dall'inventario alla griglia; un'anteprima indica se la posizione è valida (niente sovrapposizioni né uscite dai bordi).
- Le card sulla griglia si spostano trascinandole e si ruotano con il tasto destro.
- Passando il mouse su un potenziamento viene evidenziata la sua area d'effetto.
- **Modalità rimozione**: con un clic una card torna in deposito.
- **Rimuovere ...**: rimette in deposito in un colpo solo tutte le piazzole, gli hotel o i potenziamenti.

### Dati
- Lo stato viene salvato in automatico in locale.
- Dal menù si può esportare e importare la configurazione in un file JSON (`skyrama-base-planner.json`).

## Requisiti

- Node.js con npm

## Avvio in sviluppo

```bash
npm install
npm start
```

## Build per Windows

```bash
npm run dist
```

Genera nella cartella `dist/` sia l'installer NSIS sia la versione portable.
