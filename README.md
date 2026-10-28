# Skyrama Base Planner

App desktop (Electron) per pianificare la disposizione della base di Skyrama su una griglia: si definiscono le tipologie di edifici e potenziamenti, si posizionano sulla mappa con il drag & drop e si vedono subito i bonus che i potenziamenti applicano agli edifici vicini.

## Funzionalità

### Griglia
- Griglia quadrata, lato configurabile dal menù (da 20 a 56 celle).
- Zoom con la rotella del mouse, pan trascinando lo sfondo, doppio clic per ripristinare lo zoom.
- Ridimensionando la griglia, le card che non entrano più vengono rimosse dalla griglia automaticamente.

### Tipologie
Ogni tipologia ha nome, categoria (Airside, Landside, Decorazione), dimensioni in celle (fino a 30×30) e un'icona opzionale, e può essere di due tipi:

- **Edificio**
  - *Servizio aerei*: mostra la riduzione del tempo di servizio ricevuta dai potenziamenti.
  - *Passeggeri*: ha un numero di passeggeri e i minuti ogni quanto vengono generati; mostra i passeggeri totali, bonus compresi.
- **Potenziamento**
  - Effetto su *Riduzione tempo di servizio* (in %) oppure su *Bonus passeggeri* (passeggeri aggiuntivi).
  - *Raggio* d'azione in celle (0 = nessun effetto, 1 = celle adiacenti).

### Preset
- Dal dialog di una tipologia, «Scegli tra i preset» propone gli oggetti standard di Skyrama (Airside, Landside, Decorazione) con dimensioni, effetti e icona già compilati.
- Le icone non sono incluse nel repository: vengono scaricate al primo utilizzo e conservate in locale; senza connessione le card restano senza icona.
- Ogni preset può riportare i costi in Aircoins e/o Aircash e un limite massimo di card piazzabili (es. Weatherstation 3, First Aid Station 4, Fire Station 2, Weather Balloon 5). Le decorazioni premio (ottenute come ricompensa per continente) non hanno costo e sono limitate a 1.
- All'avvio e all'import le tipologie con icona di preset vengono riallineate automaticamente ai dati del preset: eventuali modifiche manuali a queste tipologie vengono sovrascritte. Le tipologie personalizzate senza icona non hanno costi né limiti.

### Inventario e posizionamento
- L'inventario è un pannello compatto in basso, comprimibile; lo stato compresso viene ricordato. Le tab Airside, Landside e Decorazione filtrano le tipologie, mostrate su una sola riga che scorre in orizzontale anche con la rotella del mouse. Ogni tipologia è una card con icona e nome: passando il mouse compaiono le statistiche (dimensioni, effetti e card piazzate); sotto il nome, per i potenziamenti, compare il valore dell'effetto (es. «-5% servizio» o «+10 passeggeri») e un contatore indica quante ne sono piazzate (con limite: «n/max»). Nel popup compaiono anche i costi, Aircoins e Aircash su righe separate.
- Un clic sulla card apre la modifica della tipologia, dove si gestiscono categoria ed eliminazione. Il pulsante «+» crea una nuova tipologia.
- Si trascina la card dell'inventario sulla griglia, tutte le volte che serve: ogni rilascio valido crea una nuova card piazzata, fino all'eventuale limite del preset (oltre il quale il trascinamento è bloccato con un avviso); un'anteprima indica se la posizione è valida (niente sovrapposizioni né uscite dai bordi).
- Se un layout caricato o importato supera i limiti, le card vengono mantenute ma evidenziate e segnalate con un messaggio; non vengono rimosse.
- Le card sulla griglia si spostano trascinandole e si ruotano con il tasto destro. Anche durante il trascinamento (dalla griglia o dall'inventario) il tasto destro ruota la card in mano; Esc annulla il trascinamento e rilasciare fuori dalla griglia lo annulla. Durante il trascinamento, avvicinandosi ai bordi della griglia zoomata la vista scorre in quella direzione, più velocemente quanto più si è vicini al bordo. Lo scorrimento si attiva solo dopo che la card in mano è entrata nell'area della griglia, non mentre la si porta dall'inventario o all'inizio del trascinamento.
- Passando il mouse su una card compare un popup con icona e dettagli; sui potenziamenti viene anche evidenziata l'area d'effetto.
- **Modalità rimozione**: con un clic la card viene rimossa dalla griglia.
- **Vista isometrica**: lo switch «2D / Isometrica» in alto a destra mostra la base con le icone degli oggetti, con zoom (rotella, doppio clic per ripristinare) e pan come in 2D; è in sola lettura e nasconde inventario e menù, drag & drop e rimozione sono disponibili in vista 2D.
- **Rimuovere ...**: rimuove dalla griglia in un colpo solo tutti gli edifici con servizio aerei, quelli con passeggeri o i potenziamenti.

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

## Disclaimer

Progetto amatoriale di fan, non affiliato né approvato dai proprietari di Skyrama. Nomi, immagini e marchi appartengono ai rispettivi proprietari. Le immagini non sono incluse in questo repository: vengono scaricate a runtime dalle fonti originali e salvate nella cache locale dell'app. La licenza del codice non si applica a tali immagini e marchi.
