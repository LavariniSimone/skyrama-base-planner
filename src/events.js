(function (root) {
  const data = [
    {
      event: 'Halloween Event 2011',
      items: [
        { icon: 'event-halloween-event-2011-haunted-house.png', category: 'landside', name: 'Haunted House', w: 4, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 50, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/38c6899c101d472d2f2ea05e48bdf88c53395578.png' },
        { icon: 'event-halloween-event-2011-pumpkin.png', category: 'landside', name: 'Pumpkin', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 2, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/7bdeae551c9479fece700801bbe63f8e5339556f.png' },
        { icon: 'event-halloween-event-2011-floating-skeleton.png', category: 'decorazione', name: 'Floating Skeleton', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 1, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/819efc5e2ce25127da9416d1f63f73605339556d.png' },
        { icon: 'event-halloween-event-2011-autumns-tree.png', category: 'decorazione', name: 'Autumn\'s Tree', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 1, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/1d851ff3a0182acf1aa84288cf89484f53395568.png' },
        { icon: 'event-halloween-event-2011-autumns-tree-2.png', category: 'decorazione', name: 'Autumn\'s Tree 2', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 1, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/4873c346ffdf8db1616628e695820cc35339556a.png' }
      ]
    },
    {
      event: 'Winter-Weeks Event 2011',
      items: [
        { icon: 'event-winter-weeks-event-2011-igloo.png', category: 'landside', name: 'Igloo', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 13, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/060ddb8aadf22b3759723a1e6ea8dbd253396ebb.png' },
        { icon: 'event-winter-weeks-event-2011-snowcastle.png', category: 'landside', name: 'Snowcastle', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 25, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/5ad6949504643ea17a3852cab76ccdd053396ebd.png' },
        { icon: 'event-winter-weeks-event-2011-christmas-presents.png', category: 'decorazione', name: 'Christmas Presents', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/7c1fe94ad50ce316c1e2ab57df49224f53396e5a.png' },
        { icon: 'event-winter-weeks-event-2011-snowflake.png', category: 'decorazione', name: 'Snowflake', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/09ca687808dea3e89cf033c822f99f3553396e62.png' },
        { icon: 'event-winter-weeks-event-2011-christmas-tree-1.png', category: 'decorazione', name: 'Christmas Tree 1', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 1, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/a6c72272aef2a8080886ae6e7d4b2c8453396e5d.png' },
        { icon: 'event-winter-weeks-event-2011-christmas-tree-2.png', category: 'decorazione', name: 'Christmas Tree 2', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 5, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/6dfef3eb9996a6c07e880377a1e7057553396e5f.png' },
        { icon: 'event-winter-weeks-event-2011-lord-van-der-flake.png', category: 'decorazione', name: 'Lord van der Flake', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2.5, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/df39e68a7198ffa5190bb5ef30d8630853396e64.png' }
      ]
    },
    {
      event: 'Valentine\'s Event 2012',
      items: [
        { icon: 'event-valentines-event-2012-romantic-hotel.png', category: 'landside', name: 'Romantic Hotel', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 100, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/6b823066904ede1bb6a584a0b2f12b7653397793.png' },
        { icon: 'event-valentines-event-2012-roses-1.png', category: 'decorazione', name: 'Roses 1', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 1, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/240609038fb96708478aa522793497c05339778b.png' },
        { icon: 'event-valentines-event-2012-roses-2.png', category: 'decorazione', name: 'Roses 2', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 1, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/30444a167829599899d3cec75ebbc6125339778e.png' }
      ]
    },
    {
      event: 'Easter Event 2012',
      items: [
        { icon: 'event-easter-event-2012-mrs-luckyfoots-egg-emporium.png', category: 'landside', name: 'Mrs. Luckyfoot\'s Egg Emporium', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 18, minuti: 8, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/6ac0c43d8ae2f22ed1f2d45b4a1c0402533979ac.png' },
        { icon: 'event-easter-event-2012-egg-basket.png', category: 'decorazione', name: 'Egg Basket', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 3, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/4ac8d8ad410ea3447a778ae0b75bd07953397998.png' },
        { icon: 'event-easter-event-2012-rock-face.png', category: 'decorazione', name: 'Rock Face', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 1, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/2bcc8a400220094034e1f6b7802cf2015339799b.png' },
        { icon: 'event-easter-event-2012-wind-turbine.png', category: 'decorazione', name: 'Wind Turbine', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/d3a4ab2682d1e2471548f2c75b9f783f5339799d.png' }
      ]
    },
    {
      event: 'May Days Event 2012',
      items: [
        { icon: 'event-may-days-event-2012-may-day-hideaway-bar.png', category: 'landside', name: 'May Day hideaway bar', w: 6, h: 5, kind: 'edificio', piazzola: false, hotel: true, residenti: 120, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/26a43295b821d3af1b23d9912eaab82453397c97.png' },
        { icon: 'event-may-days-event-2012-hawaiian-turbine.png', category: 'decorazione', name: 'Hawaiian turbine', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/63748ce41c4e5c756817ff022c8f873f53397c94.png' }
      ]
    },
    {
      event: 'Birthday Event 2012',
      items: [
        { icon: 'event-birthday-event-2012-cake-tower.png', category: 'landside', name: 'Cake tower', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 64, minuti: 150, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/ea8fc00d3876c493b3b09a83a8f37686533980dd.png' },
        { icon: 'event-birthday-event-2012-gift-turbine.png', category: 'decorazione', name: 'Gift turbine', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/0d8bc2e82caec1b240e826bea2e8bd97533980d7.png' }
      ]
    },
    {
      event: 'Summer Days Event 2012',
      items: [
        { icon: 'event-summer-days-event-2012-skyrama-airena.png', category: 'landside', name: 'Skyrama Airena', w: 5, h: 5, kind: 'edificio', piazzola: false, hotel: true, residenti: 125, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/b4505800a953309c7ce04bcfdc6c7f19533982ed.png' },
        { icon: 'event-summer-days-event-2012-winners-platform.png', category: 'decorazione', name: 'Winner\'s Platform', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 6, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/efea038b530538255530bd8832be21be533982e8.png' },
        { icon: 'event-summer-days-event-2012-record-radar.png', category: 'decorazione', name: 'Record Radar', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2.2, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/1f832912e0fbabdb72a7ebb198365bda533982eb.png' }
      ]
    },
    {
      event: 'Pirate Storm Event 2012',
      items: [
        { icon: 'event-pirate-storm-event-2012-treasure-island.png', category: 'landside', name: 'Treasure island', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 65, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/4db975e46ee6badb1ffc4613a668f492533985e0.png' },
        { icon: 'event-pirate-storm-event-2012-palm-grove.png', category: 'decorazione', name: 'Palm Grove', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 6, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/04481065b47c6ba164c1c49dbce22db3533985db.png' },
        { icon: 'event-pirate-storm-event-2012-tropical-storm.png', category: 'decorazione', name: 'Tropical storm', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2.2, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/1e510f776e7847106dddb4571f9981f9533985dd.png' }
      ]
    },
    {
      event: 'Oktoberfest Event 2012',
      items: [
        { icon: 'event-oktoberfest-event-2012-brewer-air.png', category: 'landside', name: 'Brewer-air', w: 5, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 105, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/a06efd3ac0d2ff5603718d026c75139b533988f3.png' },
        { icon: 'event-oktoberfest-event-2012-stone-mug.png', category: 'decorazione', name: 'Stone mug', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 4, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/3d009a56858a3ee9040b39eb1ccfbc3d533988eb.png' },
        { icon: 'event-oktoberfest-event-2012-cerverama.png', category: 'decorazione', name: 'Cerverama', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 4, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/9c9bd0b799de6bf46ffeffe32e45d63b533988f0.png' }
      ]
    },
    {
      event: 'Creepy Weeks Event 2012',
      items: [
        { icon: 'event-creepy-weeks-event-2012-frankenfly-castle.png', category: 'landside', name: 'Frankenfly Castle', w: 5, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 105, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/ae06581c878f056d9fa61a941f9190b653398cf7.png' },
        { icon: 'event-creepy-weeks-event-2012-grim-pilot.png', category: 'decorazione', name: 'Grim Pilot', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/6da454bc3cb7ed172de974c415700c9d53398cf2.png' },
        { icon: 'event-creepy-weeks-event-2012-cold-as-death-claw.png', category: 'decorazione', name: 'Cold-as-Death Claw', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/5a3f72332589b2ea800daf29ec9bbee553398cf5.png' }
      ]
    },
    {
      event: 'Space Week Event 2012',
      items: [
        { icon: 'event-space-week-event-2012-space-bus-station.png', category: 'landside', name: 'Space Bus Station', w: 5, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 120, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/60ffb4fe70e0238a7cf1d8593c71e718533996b0.png' },
        { icon: 'event-space-week-event-2012-skyriane-5.png', category: 'decorazione', name: 'Skyriane 5', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 10, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/5edb5e99ab411a18d21dca5b8cd8da8a533996ab.png' },
        { icon: 'event-space-week-event-2012-teflon-dish.png', category: 'decorazione', name: 'Teflon Dish', w: 3, h: 3, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 5, raggio: 3, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/103bfeede42f0fa257099d97cd13a4fe533996ad.png' }
      ]
    },
    {
      event: 'Polar Weeks Event 2012',
      items: [
        { icon: 'event-polar-weeks-event-2012-cookie-house.png', category: 'landside', name: 'Cookie House', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 35, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/e9b79baf809d7bc3f7133c4193bf7feb53399c94.png' },
        { icon: 'event-polar-weeks-event-2012-snowcastle.png', category: 'landside', name: 'Snowcastle', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 25, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/5ad6949504643ea17a3852cab76ccdd053396ebd.png' },
        { icon: 'event-polar-weeks-event-2012-christmas-tree-2.png', category: 'decorazione', name: 'Christmas Tree 2', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 5, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/6dfef3eb9996a6c07e880377a1e7057553396e5f.png' },
        { icon: 'event-polar-weeks-event-2012-lord-van-der-flake.png', category: 'decorazione', name: 'Lord van der Flake', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2.5, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/df39e68a7198ffa5190bb5ef30d8630853396e64.png' }
      ]
    },
    {
      event: 'History Event 2013',
      items: [
        { icon: 'event-history-event-2013-katies-departure-hall.png', category: 'landside', name: 'Katie\'s Departure Hall', w: 5, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 90, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/694d7167c6e57772113dc02e5c839c8e53399f30.png' },
        { icon: 'event-history-event-2013-ramaqua-tower.png', category: 'decorazione', name: 'RamAqua Tower', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 6, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/bb7f8f842463a000db46d0c82b825d4d53399f2b.png' },
        { icon: 'event-history-event-2013-steam-and-mirrors-machine.png', category: 'decorazione', name: 'Steam and Mirrors Machine', w: 3, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 6, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/997a0186b1f833dc35efba2c9d03187853399f2d.png' }
      ]
    },
    {
      event: 'VIP Event 2013',
      items: [
        { icon: 'event-vip-event-2013-oyster-bar.png', category: 'landside', name: 'Oyster Bar', w: 5, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 150, minuti: 20, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/b76230a0f56fd5e242aae034643aa7755339a222.png' },
        { icon: 'event-vip-event-2013-royal-treatments.png', category: 'decorazione', name: 'Royal Treatments', w: 3, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 8, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/3bb905bf6c2b85f0009645ac09d84c325339a21d.png' },
        { icon: 'event-vip-event-2013-spotlight.png', category: 'decorazione', name: 'Spotlight', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/925c5aa2e7e211cd217e5a050a771b325339a21f.png' }
      ]
    },
    {
      event: 'Emergency Event 2013',
      items: [
        { icon: 'event-emergency-event-2013-air-patrol.png', category: 'landside', name: 'Air Patrol', w: 5, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 120, minuti: 15, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/53dc1b5679a89e52ffd4a1cececb6ec25339b680.png' },
        { icon: 'event-emergency-event-2013-loudspeaker.png', category: 'decorazione', name: 'Loudspeaker', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/1f0492f7537e03ab33c3bb026efaf0ee5339b67b.png' },
        { icon: 'event-emergency-event-2013-alert-phase-redlight.png', category: 'decorazione', name: 'Alert Phase Redlight', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/ca4a933b70bca7e6c30f92d9ad6fde0b5339b67d.png' }
      ]
    },
    {
      event: 'Science Week Event 2013',
      items: [
        { icon: 'event-science-week-event-2013-observatory.png', category: 'landside', name: 'Observatory', w: 4, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 55, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/5afa581238dff4222a942aad8dfe293e5339ba60.png' },
        { icon: 'event-science-week-event-2013-tesla-coil.png', category: 'decorazione', name: 'Tesla Coil', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 3, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/bee4b56e00deb8958d45617a7f341d105339ba5b.png' },
        { icon: 'event-science-week-event-2013-dual-dishes.png', category: 'decorazione', name: 'Dual Dishes', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 1.5, raggio: 4, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/ab089699d9e92765cb5b303cf5487bf35339ba5e.png' }
      ]
    },
    {
      event: 'Summer Event 2013',
      items: [
        { icon: 'event-summer-event-2013-hot-sundae.png', category: 'landside', name: 'Hot Sundae', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 55, minuti: 5, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/eb2dc72b5f2827b9ceea91a7703ffe495339bc03.png' },
        { icon: 'event-summer-event-2013-tropical-paradise.png', category: 'decorazione', name: 'Tropical Paradise', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 4, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/69e6cbd637d1ebb9135f3acd8cdf228f5339bbff.png' },
        { icon: 'event-summer-event-2013-sunlight.png', category: 'decorazione', name: 'Sunlight', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 1.5, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0331/e72bdf4893860eeda14b5139afc0fe445339bc01.png' }
      ]
    },
    {
      event: 'Golden \'50s Event 2013',
      items: [
        { icon: 'event-golden-50s-event-2013-radio-tower.png', category: 'landside', name: 'Radio Tower', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 45, minuti: 10, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/c4223506e7290059f0c720785c4e7a07533a26da.png' },
        { icon: 'event-golden-50s-event-2013-rockin-guitar.png', category: 'decorazione', name: 'Rockin\' Guitar', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 3, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/75ecbf335926c3d10ef741b58f424d7f533a26d3.png' },
        { icon: 'event-golden-50s-event-2013-easy-lifter.png', category: 'decorazione', name: 'Easy Lifter', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/1032b5e117698f6ff6689ce2e45bab54533a26d5.png' }
      ]
    },
    {
      event: 'Japan Event 2013',
      items: [
        { icon: 'event-japan-event-2013-maison-skykokku.png', category: 'landside', name: 'Maison Skykokku', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 240, minuti: 60, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/890c74f412b15f1ea61f53b116ed3cf2533a2d22.png' },
        { icon: 'event-japan-event-2013-sky-long.png', category: 'decorazione', name: 'Sky-Long', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 8, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/c05238d1086cd77ea54e63dec1c4e7a9533a2d24.png' },
        { icon: 'event-japan-event-2013-air-bolt.png', category: 'decorazione', name: 'Air Bolt', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 6, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/ceb53482b815e3f3d8232d052942826b533a2d1a.png' }
      ]
    },
    {
      event: 'Halloween Event 2013',
      items: [
        { icon: 'event-halloween-event-2013-departure-hall.png', category: 'landside', name: 'Departure Hall', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 50, minuti: 5, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/ddb135ae42571f4d3de1b3c39ba9e5e6533a30ab.png' },
        { icon: 'event-halloween-event-2013-hanging-lamp.png', category: 'decorazione', name: 'Hanging Lamp', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 3, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/e1c81b9eca27c16edf77b6b52581376d533a30ad.png' },
        { icon: 'event-halloween-event-2013-decoranium.png', category: 'decorazione', name: 'Decoranium', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/8e5de2d8a6a6b5cf09720e57e3d42d2b533a30a9.png' }
      ]
    },
    {
      event: 'Winter Event 2013',
      items: [
        { icon: 'event-winter-event-2013-confection-claim.png', category: 'landside', name: 'Confection Claim', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 500, minuti: 120, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/ac9b67b8aca6219002ac31089f8649c3533a340c.png' },
        { icon: 'event-winter-event-2013-blue-light-special.png', category: 'decorazione', name: 'Blue Light Special', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 3, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/a9775ed2570de178336985e660b0fb50533a3416.png' }
      ]
    },
    {
      event: 'XPlanes-Event 2014',
      items: [
        { icon: 'event-xplanes-event-2014-global-intelligence-agency.png', category: 'landside', name: 'Global Intelligence Agency', w: 6, h: 6, kind: 'edificio', piazzola: false, hotel: true, residenti: 1700, minuti: 60, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/460d12c4e8801bdcbcf6551993bbf58c533a3840.png' },
        { icon: 'event-xplanes-event-2014-air-shaft.png', category: 'decorazione', name: 'Air Shaft', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 4, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/5328b8f2481517de9a332fcc68a8f4e2533a3848.png' },
        { icon: 'event-xplanes-event-2014-airport-fire-brigade.png', category: 'decorazione', name: 'Airport Fire Brigade', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 10, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0401/ec79a250d2e86e7ebbfbe77a6842db58533a3843.png' }
      ]
    },
    {
      event: 'The Airline Weeks I',
      items: [
        { icon: 'event-the-airline-weeks-i-airplus-service-center.png', category: 'landside', name: 'Airplus Service Center', w: 5, h: 5, kind: 'edificio', piazzola: false, hotel: true, residenti: 500, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0409/0e121a2326ec2391e49d474d3998dbb4534556c1.png' },
        { icon: 'event-the-airline-weeks-i-airplus-flag.png', category: 'decorazione', name: 'Airplus Flag', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0409/8e0a3f127456f158ac4044491f25bd99534556be.png' },
        { icon: 'event-the-airline-weeks-i-central-bus-station.png', category: 'decorazione', name: 'Central Bus Station', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 9, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0409/f8b861adb8fab1822b18a827cf1ffb22534556c3.png' }
      ]
    },
    {
      event: 'The Airline Weeks II',
      items: [
        { icon: 'event-the-airline-weeks-ii-mega-hangar.png', category: 'landside', name: 'Mega Hangar', w: 5, h: 5, kind: 'edificio', piazzola: false, hotel: true, residenti: 3000, minuti: 180, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0617/012f4fcacdac9b6aed0af48d30374bb4539f6bba.png' },
        { icon: 'event-the-airline-weeks-ii-jumbo-flag-flag-ulence.png', category: 'decorazione', name: 'Jumbo Flag "Flag-ulence"', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 6, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0617/7fabf826bd81531210f99847267244b1539f6bbd.png' },
        { icon: 'event-the-airline-weeks-ii-rolling-escalator.png', category: 'decorazione', name: 'Rolling Escalator', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0617/3372883bce938aa63c9ed7e31943a52c539f6bc0.png' }
      ]
    },
    {
      event: 'Concept Planes Event 2014',
      items: [
        { icon: 'event-concept-planes-event-2014-hydropolis.png', category: 'landside', name: 'Hydropolis', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 375, minuti: 90, effetto: '', quantita: 0, raggio: 0 },
        { icon: 'event-concept-planes-event-2014-green-glow.png', category: 'decorazione', name: 'Green Glow', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 2, raggio: 2 },
        { icon: 'event-concept-planes-event-2014-sky-spiral.png', category: 'decorazione', name: 'Sky Spiral', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 2 }
      ]
    },
    {
      event: 'The Golden Age of Aviation',
      items: [
        { icon: 'event-the-golden-age-of-aviation-moma-museum-of-modern-aviation.png', category: 'landside', name: 'MoMA - Museum of Modern Aviation', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 350, minuti: 30, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0917/692cb5d4c11e986c676f985d848ea4395419ef8f.png' },
        { icon: 'event-the-golden-age-of-aviation-mem-aerial.png', category: 'decorazione', name: '"Mem-aerial"', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 3, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0917/834d43c1982cd332e922e1b7cde729815419ef92.png' },
        { icon: 'event-the-golden-age-of-aviation-airport-floodlight.png', category: 'decorazione', name: 'Airport floodlight', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0917/61b3b0ded86cc7dcf747f44061a320c15419ef94.png' },
        { icon: 'event-the-golden-age-of-aviation-classic-small-runway.png', category: 'airside', name: 'Classic Small Runway', w: 12, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0917/8c44c6a33027921415a0b922938e83915419f186.png' },
        { icon: 'event-the-golden-age-of-aviation-classic-medium-runway.png', category: 'airside', name: 'Classic Medium Runway', w: 17, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0917/a145255f28e9374f6d855c2ec395f1155419f183.png' },
        { icon: 'event-the-golden-age-of-aviation-classic-medium-bay.png', category: 'airside', name: 'Classic Medium Bay', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0917/f91bef22b6d49d1a4c5385898185deea5419f181.png' },
        { icon: 'event-the-golden-age-of-aviation-classic-helipad.png', category: 'airside', name: 'Classic Helipad', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0917/67fe23dc9db532f3d2e43be03ea16a8c5419f17e.png' }
      ]
    },
    {
      event: 'Creepy Weeks 2014',
      items: [
        { icon: 'event-creepy-weeks-2014-haunted-terminal.png', category: 'landside', name: 'Haunted Terminal', w: 4, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 2150, minuti: 240, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1025/653192670eed238af98dc7250451555a544b83b4.png' },
        { icon: 'event-creepy-weeks-2014-halloween-lamp.png', category: 'decorazione', name: 'Halloween Lamp', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 2, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1025/a07949dde6dd416b5d769ffac6158c6c544b83b9.png' },
        { icon: 'event-creepy-weeks-2014-bone-fence.png', category: 'decorazione', name: 'Bone Fence', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 5, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1025/aa094d7c03a86154e5990c48518d99c5544b83b7.png' },
        { icon: 'event-creepy-weeks-2014-haunted-small-runway.png', category: 'airside', name: 'Haunted Small Runway', w: 12, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1025/912f543d16fd7750e26516d4d492a0ee544b8454.png' },
        { icon: 'event-creepy-weeks-2014-haunted-medium-runway.png', category: 'airside', name: 'Haunted Medium Runway', w: 17, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1025/275708b04a5cb7a6a0f495153f56586e544b8457.png' },
        { icon: 'event-creepy-weeks-2014-haunted-parking-lot.png', category: 'airside', name: 'Haunted Parking Lot', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1025/70a05cb5bb0a8b0ef419276e04e62a75544b8450.png' },
        { icon: 'event-creepy-weeks-2014-haunted-helipad.png', category: 'airside', name: 'Haunted Helipad', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1025/87df99b1306fd31e49d06a38cb223393544b8452.png' }
      ]
    },
    {
      event: 'Polarama Weeks 2014',
      items: [
        { icon: 'event-polarama-weeks-2014-arctic-dome.png', category: 'landside', name: 'Arctic Dome', w: 5, h: 5, kind: 'edificio', piazzola: false, hotel: true, residenti: 6000, minuti: 360, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1203/6d053ff76809725b4b9e0b1b4d1fc723547f3a0f.png' },
        { icon: 'event-polarama-weeks-2014-frosty-geodome.png', category: 'decorazione', name: 'Frosty Geodome', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 20, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1203/d8eb09cb2e288de5ee22eb20fcf2da4e547f380f.png' },
        { icon: 'event-polarama-weeks-2014-arctic-circle.png', category: 'decorazione', name: 'Arctic Circle', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 6, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1203/9751a3627a3b413c5a9c9e64a171fbe4547f3811.png' },
        { icon: 'event-polarama-weeks-2014-arctic-small-runway.png', category: 'airside', name: 'Arctic Small Runway', w: 12, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1203/4e9e76db5e320c9711d6fe3dc630e4d2547f3683.png' },
        { icon: 'event-polarama-weeks-2014-arctic-medium-runway.png', category: 'airside', name: 'Arctic Medium Runway', w: 17, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1203/50c44ef1355c2c23e824983d437a925a547f3686.png' },
        { icon: 'event-polarama-weeks-2014-arctic-medium-bay.png', category: 'airside', name: 'Arctic Medium Bay', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1203/d66536246ae29924cdea80b6a30728cb547f380a.png' },
        { icon: 'event-polarama-weeks-2014-arctic-medium-cargo-bay.png', category: 'airside', name: 'Arctic Medium Cargo Bay', w: 6, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1216/4f6a2c420626e61e4e6b50e2befa3aca54908129.png' },
        { icon: 'event-polarama-weeks-2014-arctic-helipad.png', category: 'airside', name: 'Arctic Helipad', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/1203/7838a7bbe1e4a0a753c35d13415df4fb547f3688.png' }
      ]
    },
    {
      event: 'Most Wanted Event 2015',
      items: [
        { icon: 'event-most-wanted-event-2015-aero-cinema.png', category: 'landside', name: 'Aero Cinema', w: 3, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 220, minuti: 60, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0224/0a028df8da7b758175c13264cdc8b88b54ecfc78.png' },
        { icon: 'event-most-wanted-event-2015-pigskin-blimp.png', category: 'decorazione', name: 'Pigskin Blimp', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 18, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0224/7e306f483c33aac1fc6bee57690c334154ecfc7a.png' },
        { icon: 'event-most-wanted-event-2015-loading-ramp.png', category: 'decorazione', name: 'Loading Ramp', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 10, raggio: 1, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0224/c2599b54f6af554f16b781841315dbbe54ecfc7c.png' }
      ]
    },
    {
      event: 'Emergency Event 2015',
      items: [
        { icon: 'event-emergency-event-2015-skywatch.png', category: 'landside', name: 'Skywatch', w: 3, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 680, minuti: 180, effetto: '', quantita: 0, raggio: 0, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0409/3f4e80346f0edf48e4e2a61f0d4df83255266332.png' },
        { icon: 'event-emergency-event-2015-destination-board.png', category: 'decorazione', name: 'Destination Board', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 4, raggio: 2, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0409/5bd8664bf2b96bae8a6fdb777af2cedb55266337.png' },
        { icon: 'event-emergency-event-2015-light-tower.png', category: 'decorazione', name: 'Light Tower', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 4, raggio: 4, url: 'https://sharedimages.bpsecure.com/CMTool_FileUpload/support/cmt/0409/3b6c600c82bc593554174124b4e6e5e355266339.png' }
      ]
    },
    {
      event: 'Airshow Event 2015',
      items: [
        { icon: 'event-airshow-event-2015-grandstand.png', category: 'landside', name: 'Grandstand', w: 3, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 450, minuti: 120, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/airshow072015_building.png' },
        { icon: 'event-airshow-event-2015-red-balloon.png', category: 'decorazione', name: 'Red Balloon', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 6, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/airshow072015_deco.png' },
        { icon: 'event-airshow-event-2015-gas-truck.png', category: 'decorazione', name: 'Gas truck', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 11, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/airshow072015_tech_deco.png' }
      ]
    },
    {
      event: 'Waterplanes Event 2015',
      items: [
        { icon: 'event-waterplanes-event-2015-lakefront-cafe.png', category: 'landside', name: 'Lakefront café', w: 3, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 200, minuti: 20, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/waterplanes082015_building.png' },
        { icon: 'event-waterplanes-event-2015-wave-flag.png', category: 'decorazione', name: 'Wave flag', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 6, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/waterplanes082015_deco.png' },
        { icon: 'event-waterplanes-event-2015-towair-plane.png', category: 'decorazione', name: 'TowAir Plane', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 4, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/waterplanes082015_tech_deco.png' }
      ]
    },
    {
      event: 'UFO Weeks 2015',
      items: [
        { icon: 'event-ufo-weeks-2015-observatorsky.png', category: 'landside', name: 'Observatorsky', w: 1, h: 1, kind: 'edificio', piazzola: false, hotel: true, residenti: 250, minuti: 360, effetto: '', quantita: 0, raggio: 0 },
        { icon: 'event-ufo-weeks-2015-unknown-fallen-object.png', category: 'decorazione', name: 'Unknown Fallen Object', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 5, raggio: 2 },
        { icon: 'event-ufo-weeks-2015-stable-signal.png', category: 'decorazione', name: 'Stable Signal', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 6, raggio: 2 }
      ]
    },
    {
      event: 'Polar Event 2015',
      items: [
        { icon: 'event-polar-event-2015-polairstation.png', category: 'landside', name: 'PolAirStation', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 3800, minuti: 600, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/polarevent122015_building.png' },
        { icon: 'event-polar-event-2015-icebair.png', category: 'decorazione', name: 'IceBair', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/polarevent122015_deco.png' },
        { icon: 'event-polar-event-2015-snowplow.png', category: 'decorazione', name: 'Snowplow', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 15, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/polarevent122015_tech_deco.png' }
      ]
    },
    {
      event: 'Future Weeks 2016',
      items: [
        { icon: 'event-future-weeks-2016-biopolis.png', category: 'landside', name: 'Biopolis', w: 5, h: 5, kind: 'edificio', piazzola: false, hotel: true, residenti: 2100, minuti: 120, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/futureevent012016_building.png' },
        { icon: 'event-future-weeks-2016-fusionair.png', category: 'decorazione', name: 'FusionAir', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 16, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/futureevent012016_deco.png' },
        { icon: 'event-future-weeks-2016-cargobot.png', category: 'decorazione', name: 'Cargobot', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 14, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/futureevent012016_tech_deco.png' }
      ]
    },
    {
      event: 'Movie Star Event 2016',
      items: [
        { icon: 'event-movie-star-event-2016-retro-cinema.png', category: 'landside', name: 'Retro Cinema', w: 3, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 700, minuti: 60, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/movieevent022016_building.png' },
        { icon: 'event-movie-star-event-2016-aviator-statue.png', category: 'decorazione', name: 'Aviator Statue', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 8, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/movieevent022016_deco.png' },
        { icon: 'event-movie-star-event-2016-house-balloon-stack.png', category: 'decorazione', name: 'House Balloon Stack', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 18, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/movieevent022016_tech_deco.png' }
      ]
    },
    {
      event: 'Wildlife Event 2016',
      items: [
        { icon: 'event-wildlife-event-2016-jungle-hut.png', category: 'landside', name: 'Jungle Hut', w: 3, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 1600, minuti: 330, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/wildlifeevent042016_building.png' },
        { icon: 'event-wildlife-event-2016-elephant-balloon.png', category: 'decorazione', name: 'Elephant Balloon', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 7, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/wildlifeevent042016_deco.png' },
        { icon: 'event-wildlife-event-2016-safari-car.png', category: 'decorazione', name: 'Safari Car', w: 1, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 15, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/wildlifeevent042016_tech_deco.png' }
      ]
    },
    {
      event: 'Football Weeks Event 2016',
      items: [
        { icon: 'event-football-weeks-event-2016-football-stadium.png', category: 'landside', name: 'Football Stadium', w: 8, h: 6, kind: 'edificio', piazzola: false, hotel: true, residenti: 9120, minuti: 240, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/emevent052016_building.png' },
        { icon: 'event-football-weeks-event-2016-football-fountain.png', category: 'decorazione', name: 'Football Fountain', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 10, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/emevent052016_deco.png' },
        { icon: 'event-football-weeks-event-2016-floodlight.png', category: 'decorazione', name: 'Floodlight', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/emevent052016_tech_deco.png' }
      ]
    },
    {
      event: 'Airlympics Event 2016',
      items: [
        { icon: 'event-airlympics-event-2016-hall-of-fame.png', category: 'landside', name: 'Hall of Fame', w: 3, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 3000, minuti: 360, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/olympicevent092016_building.png' },
        { icon: 'event-airlympics-event-2016-discobolos-statue.png', category: 'decorazione', name: 'Discobolos Statue', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/olympicevent092016_deco.png' },
        { icon: 'event-airlympics-event-2016-broadcasting-van.png', category: 'decorazione', name: 'Broadcasting Van', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/olympicevent092016_tech_deco.png' }
      ]
    },
    {
      event: 'Fly By Night Weeks Event 2016',
      items: [
        { icon: 'event-fly-by-night-weeks-event-2016-witching-tower.png', category: 'landside', name: 'Witching Tower', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 1150, minuti: 180, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/halloweenevent102016_building.png' },
        { icon: 'event-fly-by-night-weeks-event-2016-spooky-woods.png', category: 'decorazione', name: 'Spooky Woods', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/halloweenevent102016_deco.png' },
        { icon: 'event-fly-by-night-weeks-event-2016-baggage-hearse.png', category: 'decorazione', name: 'Baggage Hearse', w: 3, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 12, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/halloweenevent102016_tech_deco.png' }
      ]
    },
    {
      event: 'Arctic Skies Weeks Event 2016',
      items: [
        { icon: 'event-arctic-skies-weeks-event-2016-ice-station.png', category: 'landside', name: 'Ice Station', w: 3, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 3000, minuti: 360, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/arcticevent122016_building.png' },
        { icon: 'event-arctic-skies-weeks-event-2016-igloo.png', category: 'decorazione', name: 'Igloo', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/arcticevent122016_deco.png' },
        { icon: 'event-arctic-skies-weeks-event-2016-space-heater.png', category: 'decorazione', name: 'Space Heater', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/arcticevent122016_tech_deco.png' }
      ]
    },
    {
      event: 'Love in the Sky Weeks Event 2017',
      items: [
        { icon: 'event-love-in-the-sky-weeks-event-2017-heartbreak-hotel.png', category: 'landside', name: 'Heartbreak Hotel', w: 4, h: 5, kind: 'edificio', piazzola: false, hotel: true, residenti: 3000, minuti: 360, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/valentinesevent022017_building.png' },
        { icon: 'event-love-in-the-sky-weeks-event-2017-love-sculpture.png', category: 'decorazione', name: 'LOVE Sculpture', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/valentinesevent022017_deco.png' },
        { icon: 'event-love-in-the-sky-weeks-event-2017-romantic-billboard.png', category: 'decorazione', name: 'Romantic Billboard', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/valentinesevent022017_tech_deco.png' }
      ]
    },
    {
      event: 'Skyrace Weeks Event 2017',
      items: [
        { icon: 'event-skyrace-weeks-event-2017-skyrace-bleachers.png', category: 'landside', name: 'Skyrace Bleachers', w: 3, h: 1, kind: 'edificio', piazzola: false, hotel: true, residenti: 280, minuti: 120, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skyrace2017_building.png' },
        { icon: 'event-skyrace-weeks-event-2017-skyrace-tent.png', category: 'decorazione', name: 'Skyrace Tent', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 12, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/skyrace2017_deco.png' },
        { icon: 'event-skyrace-weeks-event-2017-skyrace-obstacle.png', category: 'decorazione', name: 'Skyrace Obstacle', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 10, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/skyrace2017_tech_deco.png' },
        { icon: 'event-skyrace-weeks-event-2017-skyrace-parkway.png', category: 'airside', name: 'Skyrace Parkway', w: 5, h: 3, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skyrace2017_parkingplace_small.png' },
        { icon: 'event-skyrace-weeks-event-2017-small-skyrace-runway.png', category: 'airside', name: 'Small Skyrace Runway', w: 12, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skyrace2017_runway_small.png' }
      ]
    },
    {
      event: 'Flashback Event XXII 2022',
      items: [
        { icon: 'event-flashback-event-xxii-2022-hot-sundae-2022.png', category: 'landside', name: 'Hot Sundae 2022', w: 2, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 360, minuti: 120, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/iceshop_mm_2022.png' },
        { icon: 'event-flashback-event-xxii-2022-gyro-pad.png', category: 'airside', name: 'Gyro-pad', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/largehelipad_mm_2022.png' }
      ]
    },
    {
      event: 'UFO Weeks 2022',
      items: [
        { icon: 'event-ufo-weeks-2022-dk-mm-2022.png', category: 'landside', name: 'DK-MM 2022', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 5000, minuti: 420, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/building01_mm_2022.png' },
        { icon: 'event-ufo-weeks-2022-pc-mm-2022.png', category: 'landside', name: 'PC-MM 2022', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 240, minuti: 20, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/building03_mm_2022.png' },
        { icon: 'event-ufo-weeks-2022-small-bay-2022.png', category: 'airside', name: 'Small Bay 2022', w: 5, h: 3, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/smallbay_mm_2022.png' }
      ]
    },
    {
      event: 'Creepy Weeks 2022',
      items: [
        { icon: 'event-creepy-weeks-2022-wk-mm-2022.png', category: 'landside', name: 'WK-MM 2022', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 1000, minuti: 60, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/building04_mm_2022.png' }
      ]
    },
    {
      event: 'Skyrace Weeks 2023 (Flashback)',
      items: [
        { icon: 'event-skyrace-weeks-2023-flashback-bc-mm-2023.png', category: 'landside', name: 'BC-MM 2023', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 6000, minuti: 480, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/building04_mm_2022.png' }
      ]
    },
    {
      event: 'Flashback Event XXIV',
      items: [
        { icon: 'event-flashback-event-xxiv-col-trbn.png', category: 'landside', name: 'COL-TRBN', w: 3, h: 1, kind: 'edificio', piazzola: false, hotel: true, residenti: 160, minuti: 60, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/col2023_stand.png' },
        { icon: 'event-flashback-event-xxiv-col-trn-b.png', category: 'landside', name: 'COL-TRN-B', w: 3, h: 2, kind: 'edificio', piazzola: false, hotel: true, residenti: 250, minuti: 60, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/col2023_standbig.png' },
        { icon: 'event-flashback-event-xxiv-col-wf.png', category: 'decorazione', name: 'COL-WF', w: 1, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 6, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/col2023_waveflag.png' }
      ]
    },
    {
      event: 'Winter Weeks 2023',
      items: [
        { icon: 'event-winter-weeks-2023-waterway-xmas-23.png', category: 'airside', name: 'Waterway XMAS-23', w: 16, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/seaplane_runway_winter.png' }
      ]
    },
    {
      event: 'Birthday Event 2024',
      items: [
        { icon: 'event-birthday-event-2024-srbe2024-bt13.png', category: 'landside', name: 'SRBE2024-BT13', w: 3, h: 3, kind: 'edificio', piazzola: false, hotel: true, residenti: 1500, minuti: 120, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/birthdaytower_2024.png' },
        { icon: 'event-birthday-event-2024-srbe2024-dc01.png', category: 'decorazione', name: 'SRBE2024-DC01', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 13, raggio: 1, url: 'https://www.skyrama.com/data/gui/store/birthday2024_deco.png' }
      ]
    },
    {
      event: 'Galactic Weeks 2024',
      items: [
        { icon: 'event-galactic-weeks-2024-run-w4y-l-runway.png', category: 'airside', name: 'RUN-W4Y - L-Runway', w: 20, h: 4, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/spaceevent2024_large_runway.png' }
      ]
    },
    {
      event: 'Hot-Cold Winter Weeks 2025',
      items: [
        { icon: 'event-hot-cold-winter-weeks-2025-crystal-tower.png', category: 'landside', name: 'Crystal Tower', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 1750, minuti: 60, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/winterevent2025_icetower.png' },
        { icon: 'event-hot-cold-winter-weeks-2025-inferno-tower.png', category: 'landside', name: 'Inferno Tower', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 8000, minuti: 240, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/winterevent2025_firetower.png' },
        { icon: 'event-hot-cold-winter-weeks-2025-frostfire-inn.png', category: 'landside', name: 'Frostfire Inn', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 20000, minuti: 480, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/winterevent2025_fireicehotel.png' },
        { icon: 'event-hot-cold-winter-weeks-2025-molten-pillar.png', category: 'decorazione', name: 'Molten Pillar', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 25, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/winterevent2025_firedeco.png' },
        { icon: 'event-hot-cold-winter-weeks-2025-frozen-pillar.png', category: 'decorazione', name: 'Frozen Pillar', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 20, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/winterevent2025_icedeco.png' }
      ]
    },
    {
      event: 'Skygate Weeks 2026',
      items: [
        { icon: 'event-skygate-weeks-2026-shrine-of-the-dunes.png', category: 'landside', name: 'Shrine of the Dunes', w: 5, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 12000, minuti: 360, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygateevent2026_temple.png' },
        { icon: 'event-skygate-weeks-2026-stargate-sanctuary.png', category: 'landside', name: 'Stargate Sanctuary', w: 5, h: 5, kind: 'edificio', piazzola: false, hotel: true, residenti: 28000, minuti: 600, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygateevent2026_pyramid.png' },
        { icon: 'event-skygate-weeks-2026-azure-obelisk.png', category: 'decorazione', name: 'Azure Obelisk', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 25, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/skygateevent2026_deco.png' },
        { icon: 'event-skygate-weeks-2026-stonegate.png', category: 'decorazione', name: 'Stonegate', w: 3, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 20, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/skygateevent2026_stonegate.png' },
        { icon: 'event-skygate-weeks-2026-skygate-of-amun.png', category: 'decorazione', name: 'Skygate of Amun', w: 3, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'piazzole', quantita: 25, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/skygateevent2026_techdeco.png' },
        { icon: 'event-skygate-weeks-2026-sandstrip.png', category: 'airside', name: 'Sandstrip', w: 20, h: 4, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygateevent2026_large_runway.png' }
      ]
    },
    {
      event: 'Birthday Event 2026',
      items: [
        { icon: 'event-birthday-event-2026-aurora-tower.png', category: 'landside', name: 'Aurora Tower', w: 5, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 3000, minuti: 180, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/birthdaytower_2026.png' },
        { icon: 'event-birthday-event-2026-small-sandstrip.png', category: 'airside', name: 'Small Sandstrip', w: 12, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygateevent2026_large_runway.png' },
        { icon: 'event-birthday-event-2026-medium-sandstrip.png', category: 'airside', name: 'Medium Sandstrip', w: 17, h: 3, kind: 'edificio', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygateevent2026_medium_runway.png' }
      ]
    },
    {
      event: 'Luxury Weeks Event 2026',
      items: [
        { icon: 'event-luxury-weeks-event-2026-diamond-palace.png', category: 'landside', name: 'Diamond Palace', w: 4, h: 4, kind: 'edificio', piazzola: false, hotel: true, residenti: 12500, minuti: 300, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/luxury_hotel.png' },
        { icon: 'event-luxury-weeks-event-2026-grand-entrance.png', category: 'decorazione', name: 'Grand Entrance', w: 2, h: 1, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 10, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/luxury_hotelsign_deco.png' },
        { icon: 'event-luxury-weeks-event-2026-blue-majesty.png', category: 'decorazione', name: 'Blue Majesty', w: 2, h: 2, kind: 'potenziamento', piazzola: false, hotel: false, residenti: 0, minuti: 0, effetto: 'hotel', quantita: 25, raggio: 2, url: 'https://www.skyrama.com/data/gui/store/luxury_diamond_deco.png' },
        { icon: 'event-luxury-weeks-event-2026-s-parking-space.png', category: 'airside', name: 'S Parking Space', w: 5, h: 3, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygate_bay_small.png' },
        { icon: 'event-luxury-weeks-event-2026-m-parking-space.png', category: 'airside', name: 'M Parking Space', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygate_bay_medium.png' },
        { icon: 'event-luxury-weeks-event-2026-l-parking-space.png', category: 'airside', name: 'L Parking Space', w: 6, h: 5, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygate_bay_large.png' },
        { icon: 'event-luxury-weeks-event-2026-skygate-helipad.png', category: 'airside', name: 'Skygate Helipad', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/skygate_helipad_large.png' },
        { icon: 'event-luxury-weeks-event-2026-luxury-helipad.png', category: 'airside', name: 'Luxury Helipad', w: 5, h: 4, kind: 'edificio', piazzola: true, hotel: false, residenti: 0, minuti: 0, effetto: '', quantita: 0, raggio: 0, url: 'https://www.skyrama.com/data/gui/store/luxury_helipad_large.png' }
      ]
    }
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.SKYRAMA_EVENTS = data;
})(typeof globalThis !== 'undefined' ? globalThis : this);
