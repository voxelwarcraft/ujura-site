import React, { useEffect, useMemo, useState } from 'react';
import AuthModal from './auth/AuthModal';
import { useSharedAuth } from './auth/sharedAuth';
import { buyNftWithWallet, fetchNftCatalog } from './nftCheckout';
import { useSiteControl } from './useSiteControl';

const raceNames = ['Nexari', 'Korrath', 'Veyra', 'Valthorak'];
const shipClasses = ['Frigate', 'Cruiser', 'Battleship', 'Carrier', 'Dreadnaught', 'Freighter'];

const shipNamesByRace = {
  Nexari: { Frigate: 'Vega', Cruiser: 'Rigel', Battleship: 'Sirius', Carrier: 'Polaris', Dreadnaught: 'Antares', Freighter: 'Arcturus' },
  Korrath: { Frigate: 'Fenrir', Cruiser: 'Jormungandr', Battleship: 'Valhalla', Carrier: 'Ragnarok', Dreadnaught: 'Mjolnir', Freighter: 'Ymir' },
  Veyra: { Frigate: 'Anubis', Cruiser: 'Sekhmet', Battleship: 'Osiris', Carrier: 'Isis Veil', Dreadnaught: 'Apophis', Freighter: 'Aaru' },
  Valthorak: { Frigate: 'Enlil', Cruiser: 'Inanna', Battleship: 'Gilgamesh', Carrier: 'Enki', Dreadnaught: 'Marduk', Freighter: 'Ziggurat' }
};

const stationNamesByRace = {
  Nexari: 'The Apex Spire',
  Korrath: 'The Reckoning Keep',
  Veyra: 'The Eternal Bond',
  Valthorak: 'The Throne of Awakening'
};

const shipClassData = {
  Frigate: { symbol: '△', price: '0.25 SOL', copyRate: '1 copy / 12–24 hrs', runs: '10–20 runs per copy', tier: 'Frigate Ship Blueprint', supplyCount: 10 },
  Cruiser: { symbol: '◇', price: '0.5 SOL', copyRate: '1 copy / 24 hrs', runs: '8–15 runs per copy', tier: 'Cruiser Ship Blueprint', supplyCount: 5 },
  Battleship: { symbol: '⬢', price: '1 SOL', copyRate: '1 copy / 24–36 hrs', runs: '5–10 runs per copy', tier: 'Battleship Ship Blueprint', supplyCount: 5 },
  Carrier: { symbol: '▣', price: '3 SOL', copyRate: '1 copy / 36–48 hrs', runs: '3–6 runs per copy', tier: 'Carrier Ship Blueprint', supplyCount: 3 },
  Dreadnaught: { symbol: '⬡', price: '3 SOL', copyRate: '1 copy / 48–72 hrs', runs: '1–3 runs per copy', tier: 'Dreadnaught Ship Blueprint', supplyCount: 3 },
  Freighter: { symbol: '▤', price: '3 SOL', copyRate: '1 copy / 36–48 hrs', runs: '3–6 runs per copy', tier: 'Freighter Ship Blueprint', supplyCount: 3 }
};

const blueprintNFTs = raceNames.flatMap((race) => shipClasses.map((shipClass) => {
  const data = shipClassData[shipClass];
  return {
    id: `blueprint-${race}-${shipClass}`.toLowerCase(),
    name: `${shipNamesByRace[race][shipClass]} Master Blueprint`,
    race,
    shipClass,
    shipName: shipNamesByRace[race][shipClass],
    category: data.tier,
    supply: `${data.supplyCount} Master Original Blueprints`,
    supplyCount: data.supplyCount,
    remaining: data.supplyCount,
    copyRate: data.copyRate,
    runs: data.runs,
    price: data.price,
    perk: `Permanent production rights for the ${race} ${shipClass}, ${shipNamesByRace[race][shipClass]}. Owners generate limited-use Blueprint Copies over time for in-game ship production.`,
    symbol: data.symbol
  };
}));

const miningBlueprint = {
  id: 'blueprint-independent-mining-barge',
  name: 'Mining Barge Master Blueprint',
  race: 'Independent',
  shipClass: 'Mining Barge',
  category: 'Mining Barge Ship Blueprint',
  supply: '10 Master Original Blueprints',
  supplyCount: 10,
  remaining: 10,
  copyRate: '1 copy / 24–36 hrs',
  runs: '8–15 runs per copy',
  price: '0.25 SOL',
  perk: 'Permanent production rights for the Mining Barge, used for resource extraction, industrial logistics, and mining fleet operations.',
  symbol: '⌬'
};

const founderStationNFTs = raceNames.map((race) => ({
  id: `station-${race}`.toLowerCase(),
  name: `${stationNamesByRace[race]} Founder Capital Station`,
  race,
  stationName: stationNamesByRace[race],
  category: 'Founder Capital Station NFT',
  supply: '1 Founder Station NFT',
  price: '25 SOL',
  creditTax: '2–4% Credits Tax',
  perk: `Founder NFT for ${stationNamesByRace[race]}, the ${race} capital station. The holder receives a 2–4% Credits tax on all market transactions inside the ${race} regional market economy. Credits are the main in-game currency used for player trading, manufacturing, market purchases, and station commerce.`,
  symbol: '◉'
}));

const features = [
  'Player-owned game economy shaped by UJU governance',
  'One universe-wide Starcore war objective',
  'Space combat missions, pirate NPCs, combat sites, and PvP',
  'Ships can be destroyed, and dropped loot can be taken by other players',
  'Security status regions: high-sec, low-sec, null-sec, and Veil space',
  'Pirating, bounty hunting, faction patrols, and outlaw gameplay',
  'Mining asteroids, moon resources, and gas field harvesting',
  'Manufacturing economy powered by resources and Blueprint Copies',
  'Ancient Ruins and Raid Sites with rare pirate faction ship blueprints',
  'Weapons and gear for your character earned through exploration and raids',
  'Founder Capital Station NFTs earn 2–4% Credits tax in their region',
  'Blueprint NFTs let players own production rights, not direct power'
];

const factions = [
  { name: 'Nexari', number: '01', icon: '▲', vibe: 'High-tech empire + precision warfare', text: 'The Nexari are disciplined, advanced, and built around command structure. Their fleets favor precision, shields, clean engineering, and controlled battlefield pressure.', traits: ['Precision fleets', 'Shield systems', 'Advanced tech', 'Order + control'] },
  { name: 'Korrath', number: '02', icon: '✦', vibe: 'War clans + brutal frontline power', text: 'The Korrath are forged by conquest, survival, and heavy fleet warfare. Their ships hit hard, hold territory, and dominate direct conflict in low-sec and null-sec.', traits: ['Heavy firepower', 'Armor ships', 'War clans', 'Frontline combat'] },
  { name: 'Veyra', number: '03', icon: '◌', vibe: 'Veil science + anomaly mastery', text: 'The Veyra push into strange physics, relic systems, and Veil research. Their ships feel experimental, elusive, and dangerous in unpredictable space.', traits: ['Veil research', 'Stealth systems', 'Anomaly tech', 'Unpredictable tactics'] },
  { name: 'Valthorak', number: '04', icon: '◇', vibe: 'Industrial sovereignty + deep-space logistics', text: 'The Valthorak are builders, miners, haulers, and territorial operators. They turn infrastructure, production, and supply lines into power.', traits: ['Industrial power', 'Freighter culture', 'Resource control', 'Territory logistics'] }
];

const systems = [
  { name: 'Highsec Orbits', label: 'Protected Space', text: 'Safer missions, starter combat sites, trade hubs, faction patrols, market access, and lower-risk progression for new pilots.', icon: '◇' },
  { name: 'Lowsec Fractures', label: 'Pirate Frontier', text: 'Weaker law, richer combat sites, pirate faction NPCs, hauler ambushes, bounty hunting, and player-driven piracy.', icon: '✦' },
  { name: 'Nullsec Frontiers', label: 'Lawless Territory', text: 'Full PvP regions where alliances fight over planets, moons, gas fields, outposts, rare resources, pirate sites, and the Starcore.', icon: '◎' },
  { name: 'Veil Systems', label: 'Dungeon Space', text: 'Temporary wormhole-style systems filled with brutal planets, rare bosses, relics, and endgame loot.', icon: '✧' }
];

const gameplayLoop = [
  { step: '01', title: 'Choose Your Space', text: 'Run safer missions in high-sec, hunt better rewards in low-sec, or enter null-sec where PvP, piracy, and guild warfare control the map.', icon: '◇' },
  { step: '02', title: 'Run Missions + Combat Sites', text: 'Take contracts, clear pirate faction NPCs, scan combat anomalies, and push into escalating combat sites for better loot.', icon: '✦' },
  { step: '03', title: 'Harvest Space Resources', text: 'Mine asteroid belts, extract moon resources, scan gas fields, and haul raw materials through risky routes.', icon: '⌬' },
  { step: '04', title: 'Risk Loss + Loot', text: 'If your ship is destroyed, you can lose it and drop loot. Other players can take your wreck, cargo, modules, and valuable resources.', icon: '☠' },
  { step: '05', title: 'Manufacture + Build', text: 'Refine resources and use Blueprint Copies to manufacture ships, modules, outposts, and economy-driving items.', icon: '▣' },
  { step: '06', title: 'Pirate, Defend + Go to War', text: 'Ambush haulers, defend trade routes, fight pirate factions, and battle players over Starcore, moons, gas fields, and territory.', icon: '⚔' }
];

const gameSystems = [
  { title: 'Space Combat Missions', tag: 'PVE COMBAT', icon: '✦', text: 'Players can take space missions from stations, factions, agents, and regional contacts. Missions send pilots into asteroid belts, deadspace pockets, pirate hideouts, convoy ambushes, defense contracts, and faction combat assignments.', bullets: ['Station mission agents', 'Faction combat contracts', 'Escort and defense missions', 'Pirate hunting assignments', 'Convoy interception', 'Rewards in Credits, loot, and reputation'] },
  { title: 'Combat Sites + Pirate NPCs', tag: 'PIRATE FACTION PVE', icon: '☠', text: 'Combat sites are scannable space encounters filled with pirate faction NPCs, elite captains, rare spawns, and escalating rooms. Harder sites can drop rare modules, character gear materials, ship components, and pirate faction blueprint rewards.', bullets: ['Scannable combat anomalies', 'Pirate faction NPC fleets', 'Elite captain spawns', 'Escalating combat rooms', 'Rare loot tables', 'Pirate faction blueprint chances'] },
  { title: 'PvP, Pirating + Security Status', tag: 'PLAYER CONFLICT', icon: '⚔', text: 'Ujura space is divided by security status. High-sec protects newer players and trade, low-sec introduces piracy, ambushes, and better rewards, while null-sec is lawless guild territory where players fight over routes, moons, gas fields, planets, outposts, and the Starcore. Ship destruction carries real risk because destroyed ships can drop loot that other players take.', bullets: ['High-sec safer missions and trade', 'Low-sec piracy and better loot', 'Null-sec full player warfare', 'Hauler ambushes and ransom gameplay', 'Destroyed ships can drop loot', 'Security status shapes risk and reward'] },
  { title: 'Asteroid, Moon + Gas Harvesting', tag: 'RESOURCE ECONOMY', icon: '⌬', text: 'Ujura’s industrial economy starts in space. Players mine asteroid belts, harvest moon materials, scan and extract gas fields, then move those resources through dangerous routes into refining, manufacturing, markets, and war production.', bullets: ['Asteroid belt mining', 'Moon resource harvesting', 'Gas field scanning and extraction', 'Refining and hauling routes', 'Manufacturing supply chains', 'Resources create conflict'] },
  { title: 'Planets Are Full Game Zones', tag: 'SPACE + GROUND LAYER', icon: '◈', text: 'Planets are a full second progression layer where players land, explore Dofus-style maps, fight mobs and bosses, enter Ancient Ruins and Raid Sites, collect loot, and extract everything back through space. Planet content can reward rare pirate faction ship blueprints along with weapons and gear for your character.', bullets: ['5–10 main zones per planet', '20–50+ effective areas', 'Ancient Ruins and Raid Sites', 'Rare pirate faction ship blueprints', 'Character weapons and gear', 'Loot must be extracted to ship'] },
  { title: 'The Ujura Starcore', tag: 'ONE-OF-ONE WAR OBJECTIVE', icon: '✦', text: 'Only one Starcore exists at a time. It appears as a high-risk null-sec combat site, gets looted, then must be deployed at a star within 1 hour. Once deployed, every player receives a global announcement and the star becomes the main PvP battleground.', bullets: ['Only one active Starcore', 'Deploy at any null-sec star', '10-minute capture requirement', 'Rewards paid every 22 minutes', 'Active for 7–14 days', 'Control shifts through PvP'] },
  { title: 'Blueprint NFT Economy', tag: 'PRODUCTION, NOT PAY-TO-WIN', icon: '▣', text: 'Master Original Blueprint NFTs give production rights for specific ships or items, but they do not create ships directly. Owners generate limited-use Blueprint Copies over time. Players still need resources, crafting time, and gameplay participation to produce the actual ships.', bullets: ['NFTs control production rights', 'Blueprint Copies are in-game only', 'Copies have limited crafting runs', 'Each race has each ship class', 'Scarcity lives at production level', 'Ships still enter PvP and economy'] },
  { title: 'Founder Station Taxes', tag: 'REGIONAL MARKET OWNERSHIP', icon: '◉', text: 'Founder Capital Station NFT holders receive a 2–4% Credits tax on all market transactions in their race’s region. Credits are the main in-game currency used for trading, manufacturing, market purchases, and station commerce.', bullets: ['Credits are the main currency', '2–4% regional market tax', 'One station NFT per race', 'Applies to race regional markets', 'Station commerce matters', 'Markets become strategic assets'] }
];

const nftStats = [
  { label: 'Racial Ship Designs', value: '24' },
  { label: 'Racial Blueprint NFTs', value: '116' },
  { label: 'Mining Barge Blueprints', value: '10' },
  { label: 'Founder Capital Stations', value: '4' },
  { label: 'Total NFT Supply', value: '130' }
];

const blueprintSupplySummary = [
  { className: 'Frigate', ships: '4 race ships', perShip: '10 blueprints each', total: '40 total', price: '0.25 SOL' },
  { className: 'Cruiser', ships: '4 race ships', perShip: '5 blueprints each', total: '20 total', price: '0.5 SOL' },
  { className: 'Battleship', ships: '4 race ships', perShip: '5 blueprints each', total: '20 total', price: '1 SOL' },
  { className: 'Carrier', ships: '4 race ships', perShip: '3 blueprints each', total: '12 total', price: '3 SOL' },
  { className: 'Dreadnaught', ships: '4 race ships', perShip: '3 blueprints each', total: '12 total', price: '3 SOL' },
  { className: 'Freighter', ships: '4 race ships', perShip: '3 blueprints each', total: '12 total', price: '3 SOL' },
  { className: 'Mining Barge', ships: '1 independent ship', perShip: '10 blueprints', total: '10 total', price: '0.25 SOL' }
];

const ujuDetails = [
  { label: 'Max Supply', value: '8M', caption: 'Only 8,000,000 UJU can ever exist' },
  { label: 'Player Rewards', value: '60%', caption: '4,800,000 UJU earned through Starcore control' },
  { label: 'Seed Round', value: '10%', caption: '800,000 UJU at $0.05' },
  { label: 'Public Sale', value: '15%', caption: '1,200,000 UJU at $0.10' },
  { label: 'NFT Revenue', value: 'Share', caption: 'Planned future NFT revenue share' },
  { label: 'Team / Dev', value: '10%', caption: '800,000 UJU for building Ujura' },
  { label: 'Treasury', value: '5%', caption: '400,000 UJU ecosystem reserve' }
];

const tokenUtility = [
  'Governance voting rights on Ujura’s game direction, economy decisions, balance proposals, faction updates, and future feature priorities',
  'Access to cosmetic skins, visual upgrades, limited seasonal cosmetics, ship trails, faction-themed skins, station cosmetics, and profile cosmetics',
  'A share of future game revenue generated from Ujura NFT sales, subject to final legal structure and approved distribution mechanics',
  'Faster mining cycle time perks for miners, industrial players, and resource-focused guild operations',
  'Faster skill training perks to accelerate progression through ship mastery, crafting paths, professions, and specialization trees',
  'Reduced in-game market transaction fees for trading, production, item sales, Blueprint Copy commerce, and player-to-player markets',
  'Access to special events, community votes, ecosystem rewards, tournament eligibility, and long-term holder benefits'
];

const ujuDistribution = [
  { name: 'Player Rewards', percent: 60, amount: '4,800,000 UJU', note: 'Earned by controlling the Ujura Starcore' },
  { name: 'Public Seed Round', percent: 10, amount: '800,000 UJU', note: '$0.05 per UJU' },
  { name: 'Public Sale', percent: 15, amount: '1,200,000 UJU', note: '$0.10 per UJU' },
  { name: 'Team / Dev', percent: 10, amount: '800,000 UJU', note: 'Development allocation' },
  { name: 'Treasury', percent: 5, amount: '400,000 UJU', note: 'Ecosystem reserve' }
];

const seedPackages = [
  { amount: '5,000 UJU', price: '$250', tag: 'Scout' },
  { amount: '20,000 UJU', price: '$1,000', tag: 'Captain' },
  { amount: '100,000 UJU', price: '$5,000', tag: 'Founder' }
];

const roadmap = [
  { phase: 'Phase 01', title: 'World Reveal', text: 'Launch the Ujura website, whitepaper, faction overview, Starcore concept, and game systems reveal.' },
  { phase: 'Phase 02', title: 'Blueprint NFT Launch', text: 'Release Master Original Blueprint NFTs and Founder Capital Station NFTs tied to production rights and regional markets.' },
  { phase: 'Phase 03', title: 'UJU Seed Round', text: 'Open the public seed round interface at $0.05 per UJU and prepare wallet-based allocation flow.' },
  { phase: 'Phase 04', title: 'Playable Prototype', text: 'Ship the first playable slice with starmap movement, missions, combat sites, tactical combat, and early ship progression.' },
  { phase: 'Phase 05', title: 'Starcore Wars', text: 'Introduce the one-of-one Starcore objective and test large-scale conflict, capture, and reward cycles.' },
  { phase: 'Phase 06', title: 'Industry + Territory', text: 'Add asteroid mining, moon harvesting, gas field extraction, manufacturing, orbital control, ground exploration, outposts, planetary PvP, and territory warfare.' }
];

function getPublishedPosts(blog) {
  return (blog?.posts || [])
    .filter((post) => post.status === 'published')
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return String(b.publishedAt || '').localeCompare(String(a.publishedAt || ''));
    });
}

function blogArtStyle(post) {
  if (post.imageUrl) {
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,.16), rgba(0,0,0,.28)), url("${post.imageUrl}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }
  return { background: post.imageStyle || 'radial-gradient(circle at center, rgba(79,163,183,.3), transparent 34%), linear-gradient(135deg, rgba(79,163,183,.12), rgba(255,255,255,.02))' };
}

function formatPostDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function scrollToId(id) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  const control = useSiteControl('ujura');
  const auth = useSharedAuth();
  const [activePage, setActivePage] = useState('home');
  const [authOpen, setAuthOpen] = useState(false);

  function goHome() {
    setActivePage('home');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  function goNfts() {
    setActivePage('nfts');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  function scrollHome(id) {
    setActivePage('home');
    setTimeout(() => scrollToId(id), 0);
  }

  return (
    <div className="site-shell">
      <div className="background-grid" />
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={goHome}>
            <span className="brand-mark">◎</span>
            <span>
              <span className="brand-name">UJURA</span>
              <span className="brand-sub">Tactical Space MMO</span>
            </span>
          </button>
          <nav className="nav">
            <button onClick={() => scrollHome('#world')}>World</button>
            <button onClick={() => scrollHome('#loop')}>Gameplay</button>
            <button onClick={() => scrollHome('#systems')}>Security</button>
            <button onClick={() => scrollHome('#factions')}>Factions</button>
            <button onClick={() => scrollHome('#game-details')}>Details</button>
            {control.toggles.nftSaleEnabled && <button onClick={goNfts}>NFTs</button>}
            {control.toggles.seedSaleEnabled && <button onClick={() => scrollHome('#seed')}>UJU Seed</button>}
            {control.blog?.enabled && <button onClick={() => scrollHome('#blog')}>Blog</button>}
            <button onClick={() => scrollHome('#roadmap')}>Roadmap</button>
          </nav>
          <div className="topbar-actions">
            {control.toggles.alphaAccessEnabled && (
              <button className="sci-button ghost" onClick={() => setAuthOpen(true)}>{control.alpha.ctaLabel}</button>
            )}
            {control.toggles.walletButtonsEnabled && (
              <button className="sci-button" onClick={() => setAuthOpen(true)}>
                {auth.user ? auth.user.email || 'Account' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </header>
      {control.statusBanner.enabled && control.statusBanner.text && (
        <div className="control-banner">{control.statusBanner.text}</div>
      )}
      <main>{activePage === 'nfts' && control.toggles.nftSaleEnabled ? <NftSalesPage onBack={goHome} control={control} onAuthOpen={() => setAuthOpen(true)} /> : <HomePage goNfts={goNfts} control={control} onAuthOpen={() => setAuthOpen(true)} />}</main>
      <footer>
        <p>© 2026 Ujura. All rights reserved.</p>
        <p>A tactical sci-fi world by Majori Games.</p>
      </footer>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={auth.refresh}
        user={auth.user}
        signOut={auth.signOut}
      />
    </div>
  );
}

function HomePage({ goNfts, control, onAuthOpen }) {
  const primaryHref = control.hero.primaryCta.href || '#world';
  const [activePost, setActivePost] = useState(null);

  function handlePrimaryClick() {
    if (primaryHref.startsWith('#')) {
      scrollToId(primaryHref);
      return;
    }
    window.location.href = primaryHref;
  }

  return (
    <>
      <section className="hero section-pad">
        <div className="hero-copy reveal">
          <div className="badge">{control.hero.badge}</div>
          <h1>{control.hero.title}</h1>
          <p>{control.hero.body}</p>
          <div className="button-row">
            <button className="sci-button" onClick={handlePrimaryClick}>{control.hero.primaryCta.label} →</button>
            {control.toggles.nftSaleEnabled && (
              <button className="sci-button ghost" onClick={goNfts}>{control.hero.secondaryCta.label}</button>
            )}
          </div>
          <div className="stats-row">
            <Stat value="1" label="Live Starcore" />
            <Stat value="130" label="Total NFT Supply" />
            <Stat value="8M" label="Max UJU Supply" />
          </div>
        </div>
        <HeroHud />
      </section>

      <section id="world" className="section-pad two-col">
        <div>
          <p className="eyebrow">The Vision</p>
          <h2>The important pieces are all connected.</h2>
          <p className="muted big">Ujura is designed as a player-owned game where every layer matters: space missions, pirate faction NPCs, combat sites, high-sec safety, low-sec pirating, null-sec PvP, ship loss, dropped loot, asteroid mining, moon harvesting, gas field extraction, planet access, Ancient Ruins, Raid Sites, character gear, manufacturing, Blueprint Copies, UJU governance, PvP destruction, and guild warfare all feed the same economy.</p>
        </div>
        <div className="feature-grid">{features.map((feature) => <Feature key={feature}>{feature}</Feature>)}</div>
      </section>

      <LoopSection />
      <SystemsSection />
      <FactionsSection />
      <GameDetailsSection />
      {control.toggles.nftSaleEnabled && <NftPreviewSection goNfts={goNfts} />}
      {control.toggles.seedSaleEnabled && <SeedSection onAuthOpen={onAuthOpen} />}
      {control.blog?.enabled && <BlogSection blog={control.blog} onOpenPost={setActivePost} />}
      <RoadmapSection />
      {control.toggles.alphaAccessEnabled && <AlphaSection control={control} onAuthOpen={onAuthOpen} />}
      <BlogModal post={activePost} onClose={() => setActivePost(null)} />
    </>
  );
}

function NftSalesPage({ onBack, control, onAuthOpen }) {
  const auth = useSharedAuth();
  const [raceFilter, setRaceFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [catalogState, setCatalogState] = useState({ settings: { saleConfigured: false }, items: [] });
  const [catalogNotice, setCatalogNotice] = useState('');
  const [purchaseState, setPurchaseState] = useState({});

  async function loadCatalog() {
    try {
      const nextCatalog = await fetchNftCatalog();
      setCatalogState(nextCatalog);
      setCatalogNotice(nextCatalog.settings.saleConfigured ? '' : 'Solana checkout is installed, but the treasury wallet is not configured yet.');
    } catch (error) {
      setCatalogNotice(error.message);
    }
  }

  useEffect(() => {
    loadCatalog();
  }, []);

  const liveItems = useMemo(() => new Map((catalogState.items || []).map((item) => [item.id, item])), [catalogState.items]);

  function withLiveInventory(drop) {
    const live = liveItems.get(drop.id);
    if (!live) return drop;
    return { ...drop, ...live, price: live.price || drop.price, remaining: live.remaining };
  }

  const filteredBlueprints = useMemo(() => blueprintNFTs.filter((drop) => {
    const raceMatch = raceFilter === 'All' || drop.race === raceFilter;
    const classMatch = classFilter === 'All' || drop.shipClass === classFilter;
    return raceMatch && classMatch;
  }).map(withLiveInventory), [raceFilter, classFilter, liveItems]);

  async function handleBuy(drop, providerName) {
    setPurchaseState((current) => ({ ...current, [drop.id]: { busy: true, message: `Opening ${providerName === 'solflare' ? 'Solflare' : 'Phantom'}...` } }));
    try {
      const result = await buyNftWithWallet({
        itemId: drop.id,
        providerName,
        onAuthenticated: auth.refresh,
      });
      setPurchaseState((current) => ({
        ...current,
        [drop.id]: {
          busy: false,
          message: `Payment confirmed. Order ${result.order.id} now holds your blueprint entitlement. Future NFT delivery will be tracked in the backend.`,
        },
      }));
      await loadCatalog();
    } catch (error) {
      setPurchaseState((current) => ({ ...current, [drop.id]: { busy: false, message: error.message } }));
    }
  }

  const marketplaceReady = Boolean(catalogState.settings?.saleConfigured);

  return (
    <>
      <section className="hero section-pad">
        <div className="hero-copy reveal">
          <div className="badge">Founder NFT Sale</div>
          <h1>Own production rights and founder station identity inside Ujura.</h1>
          <p>The Ujura NFT sale includes 24 racial ship designs with 116 total Master Original Blueprint NFTs, 10 Mining Barge Master Original Blueprints, and four Founder Capital Station NFTs for Nexari, Korrath, Veyra, and Valthorak. Founder Capital Station holders earn a 2–4% Credits tax on all market transactions in their race’s region.</p>
          <div className="button-row">
            {control.toggles.walletButtonsEnabled && <button className="sci-button" onClick={onAuthOpen}>Connect Wallet</button>}
            <button className="sci-button ghost">View Sale Terms</button>
            <button className="text-link" onClick={onBack}>← Back to Site</button>
          </div>
          {catalogNotice && <p className="checkout-alert">{catalogNotice}</p>}
        </div>
        <NftSaleHud />
      </section>

      <section className="section-pad slim">
        <div className="stats-row five">{nftStats.map((stat) => <Stat key={stat.label} value={stat.value} label={stat.label} />)}</div>
      </section>

      <section className="section-pad">
        <SectionHeader eyebrow="Supply Breakdown" title="Class-based Master Original Blueprint supply." text="Each race has one ship design in each class. Blueprint supply depends on ship class, with more Frigate blueprints and fewer capital and industrial ship blueprints." />
        <div className="supply-grid">{blueprintSupplySummary.map((item) => <SupplyCard key={item.className} item={item} />)}</div>
      </section>

      <section className="section-pad">
        <SectionHeader eyebrow="Racial Ship Master Blueprints" title="24 ship designs. 116 racial blueprint NFTs." text="Filter by race or class, then purchase the Master Original Blueprint NFT that controls production rights for that ship." />
        <div className="filter-bar">
          {['All', ...raceNames].map((race) => <button key={race} className={raceFilter === race ? 'active' : ''} onClick={() => setRaceFilter(race)}>{race}</button>)}
        </div>
        <div className="filter-bar secondary">
          {['All', ...shipClasses].map((shipClass) => <button key={shipClass} className={classFilter === shipClass ? 'active' : ''} onClick={() => setClassFilter(shipClass)}>{shipClass}</button>)}
        </div>
        <div className="card-grid three">{filteredBlueprints.map((drop) => <NftCard key={`${drop.race}-${drop.shipClass}`} drop={drop} onBuy={handleBuy} purchase={purchaseState[drop.id]} marketplaceReady={marketplaceReady} />)}</div>
      </section>

      <section className="section-pad">
        <SectionHeader eyebrow="Independent Industrial Blueprint" title="10 Mining Barge Master Original Blueprints." text="The Mining Barge is one independent industrial ship with 10 total Master Original Blueprints available. It supports asteroid mining, moon operations, gas extraction support, resource logistics, and industrial guild play." />
        <div className="card-grid three"><NftCard drop={withLiveInventory(miningBlueprint)} onBuy={handleBuy} purchase={purchaseState[miningBlueprint.id]} marketplaceReady={marketplaceReady} /></div>
      </section>

      <section className="section-pad">
        <SectionHeader eyebrow="Founder Capital Stations" title="Four Founder Capital Station NFTs." text="Each race has one named capital station NFT. The holder earns a 2–4% Credits tax on every market transaction in that race’s regional economy. Credits are the main in-game currency." />
        <div className="card-grid four">{founderStationNFTs.map((drop) => {
          const liveDrop = withLiveInventory(drop);
          return <StationCard key={drop.name} drop={liveDrop} onBuy={handleBuy} purchase={purchaseState[drop.id]} marketplaceReady={marketplaceReady} />;
        })}</div>
      </section>

      <section className="section-pad two-col">
        <div className="panel big-panel">
          <p className="eyebrow">How It Works</p>
          <h2>NFTs control production and regional market ownership.</h2>
          <p className="muted big">A Master Original Blueprint NFT generates limited-use Blueprint Copies over time. Founder Capital Station NFTs collect a 2–4% Credits tax from market transactions in their race’s region. Credits are the main in-game currency used for trading, manufacturing, station commerce, and player-to-player markets.</p>
        </div>
        <div className="mini-grid">
          {['Own Master Original Blueprint NFT', 'Generate limited Blueprint Copies', 'Gather resources through gameplay', 'Craft ships/items in-game', 'Use Credits as the main in-game currency', 'Founder Stations earn 2–4% regional market tax', 'Ship loss and loot drops create demand', 'Destruction keeps the economy alive'].map((item) => <MiniLine key={item}>{item}</MiniLine>)}
        </div>
      </section>
    </>
  );
}

function HeroHud() {
  return (
    <div className="hud-card reveal delay">
      <div className="hud-title"><div><p>Combat Overview</p><h3>Veyra Gate / Null-Sec</h3></div><span>Starcore Active</span></div>
      <div className="starmap">
        <OrbitNode className="node-main" pulse />
        <OrbitNode className="node-a" />
        <OrbitNode className="node-b" />
        <OrbitNode className="node-c" />
        <OrbitNode className="node-d" />
        <div className="route r1" />
        <div className="route r2" />
        <div className="hud-note left"><b>Global Alert</b><br />The Ujura Starcore has been deployed.</div>
        <div className="hud-note right">Security: <b>Null-Sec</b><br />Loot Risk: <b>Active</b><br />Veil Signature: <b>Detected</b></div>
        <div className="hud-bottom"><span><b>Objective</b>Control Starcore</span><span><b>Capture</b>10 Minutes</span><span><b>Rewards</b>50 UJU / 22 min</span></div>
      </div>
    </div>
  );
}

function NftSaleHud() {
  return (
    <div className="hud-card reveal delay">
      <div className="hud-title"><div><p>Genesis Sale</p><h3>130 Total NFTs</h3></div><span>116 + 10 + 4</span></div>
      <div className="sale-panel">
        <div className="progress-label"><span>Drop Structure</span><b>Blueprints + Stations</b></div>
        <div className="progress"><span style={{ width: '42%' }} /></div>
        <div className="mini-grid compact">{nftStats.map((stat) => <div key={stat.label} className="mini-stat"><small>{stat.label}</small><b>{stat.value}</b></div>)}</div>
      </div>
    </div>
  );
}

function LoopSection() {
  return <section id="loop" className="section-pad"><SectionHeader eyebrow="Gameplay Loop" title="Run missions, hunt pirates, mine resources, risk your ship, manufacture, and go to war." text="Missions and combat sites create loot, asteroids and moons create resources, blueprints turn resources into ships, and PvP destruction creates demand." /><div className="card-grid three">{gameplayLoop.map((item) => <InfoCard key={item.step} item={item} />)}</div></section>;
}

function SystemsSection() {
  return <section id="systems" className="section-pad"><SectionHeader eyebrow="Security Status" title="High-sec, low-sec, and null-sec decide how dangerous space becomes." text="High-sec is safer for missions and trade, low-sec opens the door to piracy and richer rewards, and null-sec becomes full player-controlled warfare over resources, planets, outposts, and Starcore control." /><div className="card-grid four">{systems.map((system) => <SimpleCard key={system.name} item={system} />)}</div></section>;
}

function FactionsSection() {
  return <section id="factions" className="section-pad"><SectionHeader eyebrow="Factions" title="Four powers competing for the same impossible future." text="Each faction shapes visual identity, political flavor, ship culture, regional markets, and the kind of player fantasy people buy into." /><div className="card-grid two">{factions.map((race) => <FactionCard key={race.name} race={race} />)}</div></section>;
}

function GameDetailsSection() {
  return <section id="game-details" className="section-pad"><SectionHeader eyebrow="Game Details" title="The systems that actually make Ujura work." text="Space missions, combat sites, pirate faction NPCs, security status, pirating, PvP, ship loss, dropped loot, the Starcore, mining, manufacturing, planets, outposts, blueprints, and Veil raids all connect into one economy." /><div className="core-loop panel"><div><p className="eyebrow">Core Loop</p><h2>The economy begins with movement and ends in war.</h2><p className="muted big">Players run missions, scan combat sites, fight pirate faction NPCs, mine asteroids, harvest moons, extract gas, risk ship loss, drop loot on death, manufacture ships, and choose how much danger they want. High-sec supports safer progression, low-sec brings piracy and ambushes, and null-sec turns everything into PvP territory warfare.</p></div><div className="mini-grid">{['High-sec protects early progression', 'Low-sec enables piracy and ambushes', 'Null-sec creates full PvP warfare', 'Missions and combat sites create loot', 'Pirate faction NPCs guard rare rewards', 'Destroyed ships can drop loot', 'Other players can take wrecked cargo', 'Asteroids, moons, and gas fields create resources', 'Blueprints turn resources into ships', 'PvP destroys supply and creates demand'].map((item) => <MiniLine key={item}>{item}</MiniLine>)}</div></div><div className="card-grid two details-grid">{gameSystems.map((system) => <SystemCard key={system.title} system={system} />)}</div></section>;
}

function NftPreviewSection({ goNfts }) {
  const previewDrops = [blueprintNFTs[0], blueprintNFTs[7], blueprintNFTs[14], miningBlueprint];
  return <section id="nfts" className="section-pad"><SectionHeader eyebrow="NFT Sale" title="130 total NFTs power production and regional market ownership." text="The dedicated NFT page includes 116 racial ship Master Original Blueprint NFTs, 10 Mining Barge Master Original Blueprints, and 4 Founder Capital Station NFTs that earn 2–4% Credits tax in their race’s region." /><div className="stats-row five">{nftStats.map((stat) => <Stat key={stat.label} value={stat.value} label={stat.label} />)}</div><div className="card-grid four preview-cards">{previewDrops.map((drop) => <NftCard key={drop.name} drop={drop} compact />)}</div><div className="center"><button className="sci-button" onClick={goNfts}>Open NFT Sales Page</button></div></section>;
}

function SeedSection({ onAuthOpen }) {
  return <section id="seed" className="section-pad"><SectionHeader eyebrow="UJU Tokenomics" title="Seed round: $0.05 per UJU. Public sale: $0.10 per UJU." text="UJU is the ownership and governance layer for the player-owned Ujura economy, with planned access to a share of future game revenue from NFT sales. It has an 8,000,000 max supply." /><div className="token-grid"><div className="panel"><div className="token-head"><div><p className="eyebrow">Token Overview</p><h2>UJU Coin</h2><p className="muted">UJU holders can vote on game direction, access cosmetics, receive in-game perks like faster mining cycle time, faster skill training, less market transaction fees, and are planned to receive a share of future NFT revenue subject to final legal structure.</p></div><div className="uju-mark">UJU</div></div><div className="stats-row token-stats">{ujuDetails.map((item) => <Stat key={item.label} value={item.value} label={item.label} caption={item.caption} />)}</div><DistributionBars /></div><SeedCheckout onAuthOpen={onAuthOpen} /></div></section>;
}

function DistributionBars() {
  return <div className="distribution"><p className="eyebrow">UJU Distribution</p>{ujuDistribution.map((item) => <div className="dist-row" key={item.name}><div className="dist-label"><span><b>{item.name}</b><small>{item.amount} · {item.note}</small></span><strong>{item.percent}%</strong></div><div className="progress"><span style={{ width: `${item.percent}%` }} /></div></div>)}<p className="eyebrow utility-title">UJU Utility</p><div className="mini-grid utility-list">{tokenUtility.map((item) => <MiniLine key={item}>{item}</MiniLine>)}</div></div>;
}

function SeedCheckout({ onAuthOpen }) {
  return <div className="panel checkout"><p className="eyebrow">Buy UJU</p><h2>Public Seed Checkout</h2><p className="muted">The public seed round is 10% of supply: 800,000 UJU at $0.05 per coin. Public sale later is 15% of supply: 1,200,000 UJU at $0.10 per coin.</p><div className="price-pair"><div><small>Public Seed Round</small><b>$0.05</b><span>800,000 UJU · 10%</span></div><div><small>Public Sale</small><b>$0.10</b><span>1,200,000 UJU · 15%</span></div></div>{seedPackages.map((pack) => <button className="allocation" key={pack.tag}><span><small>{pack.tag}</small><b>{pack.amount}</b></span><strong>{pack.price}</strong></button>)}<div className="input-box"><small>Custom UJU Amount</small><div><input placeholder="50,000" /><span>UJU</span></div><p><span>Estimated cost</span><b>$2,500.00</b></p></div><div className="button-row"><button className="sci-button" onClick={onAuthOpen}>Connect Wallet</button><button className="sci-button ghost" onClick={onAuthOpen}>Purchase UJU</button></div><p className="disclaimer">Legal review, KYC/AML, smart contract audits, jurisdiction rules, vesting, revenue-share eligibility, and risk disclosures are required before any real sale or NFT revenue-sharing mechanism.</p></div>;
}

function RoadmapSection() {
  return <section id="roadmap" className="section-pad"><SectionHeader eyebrow="Roadmap" title="Building Ujura in phases." text="A believable path from concept to playable world, with each phase adding more of the economy, ownership, combat, and territorial warfare layer." /><div className="card-grid three">{roadmap.map((item) => <div className="panel" key={item.phase}><p className="eyebrow">{item.phase}</p><h3>{item.title}</h3><p className="muted">{item.text}</p></div>)}</div></section>;
}

function BlogSection({ blog, onOpenPost }) {
  const posts = getPublishedPosts(blog);
  if (posts.length === 0) return null;
  return (
    <section id="blog" className="section-pad">
      <SectionHeader eyebrow={blog.eyebrow || 'Transmission Log'} title={blog.title || 'Ujura updates from the frontier.'} text={blog.intro || 'Development notes and announcements from Ujura.'} />
      <div className="card-grid three">
        {posts.map((post) => (
          <article className="blog-card" key={post.id || post.slug || post.title}>
            <div className="blog-art" style={blogArtStyle(post)}>
              <span>{post.category}</span>
            </div>
            <div className="blog-body">
              <div className="blog-meta">
                {post.publishedAt && <span>{formatPostDate(post.publishedAt)}</span>}
                {post.featured && <span>Featured</span>}
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <button className="text-link" onClick={() => onOpenPost(post)}>Read Transmission</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AlphaSection({ control, onAuthOpen }) {
  return <section id="access" className="alpha-section"><div className="alpha-icon">✦</div><h2>{control.alpha.title}</h2><p>{control.alpha.body}</p><button className="sci-button" onClick={onAuthOpen}>{control.alpha.ctaLabel}</button></section>;
}

function BlogModal({ post, onClose }) {
  if (!post) return null;
  return (
    <div className="blog-modal">
      <article className="blog-modal-card">
        <div className="blog-modal-art" style={blogArtStyle(post)} />
        <div className="blog-modal-body">
          <div className="blog-meta">
            <span>{post.category}</span>
            {post.publishedAt && <span>{formatPostDate(post.publishedAt)}</span>}
            {post.author && <span>By {post.author}</span>}
          </div>
          <h2>{post.title}</h2>
          <p className="muted big">{post.excerpt}</p>
          <div className="blog-fulltext">{post.body}</div>
          <button className="sci-button" onClick={onClose}>Close Transmission</button>
        </div>
      </article>
    </div>
  );
}

function NftCard({ drop, compact = false, onBuy, purchase, marketplaceReady = false }) {
  const disabled = !marketplaceReady || purchase?.busy || (drop.remaining ?? drop.supplyCount) <= 0;
  return <article className={`nft-card ${compact ? 'compact' : ''}`}><div className="nft-art"><span className="nft-category">{drop.category}</span><div className="nft-symbol">{drop.symbol}</div></div><div className="nft-body"><div className="nft-title-row"><div><h3>{drop.name}</h3><span className="remaining">{drop.remaining ?? drop.supplyCount} Remaining</span><small>{drop.supply}</small></div><b className="price">{drop.price}</b></div><p>{drop.perk}</p><p><b>Copy Rate:</b> {drop.copyRate}</p><p><b>Runs:</b> {drop.runs}</p>{onBuy ? <div className="button-row"><button className="sci-button" disabled={disabled} onClick={() => onBuy(drop, 'phantom')}>{purchase?.busy ? 'Processing...' : 'Buy with Phantom'}</button><button className="sci-button ghost" disabled={disabled} onClick={() => onBuy(drop, 'solflare')}>Buy with Solflare</button></div> : <div className="button-row"><button className="sci-button">Buy Blueprint</button><button className="sci-button ghost">Details</button></div>}{purchase?.message && <p className="purchase-message">{purchase.message}</p>}</div></article>;
}

function StationCard({ drop, onBuy, purchase, marketplaceReady = false }) {
  const disabled = !marketplaceReady || purchase?.busy || (drop.remaining ?? drop.supplyCount) <= 0;
  return <article className="station-card"><div className="nft-art station-art"><span className="nft-category">{drop.race}</span><div className="nft-symbol">{drop.symbol}</div></div><div className="nft-body"><div className="nft-title-row"><div><h3>{drop.name}</h3><span className="remaining">{drop.remaining ?? drop.supplyCount} Remaining</span><small>{drop.supply}</small></div><b className="price">{drop.price}</b></div><p>{drop.perk}</p><div className="tax-box">{drop.creditTax} on regional market transactions</div><div className="button-row"><button className="sci-button" disabled={disabled} onClick={() => onBuy?.(drop, 'phantom')}>{purchase?.busy ? 'Processing...' : 'Buy with Phantom'}</button><button className="sci-button ghost" disabled={disabled} onClick={() => onBuy?.(drop, 'solflare')}>Buy with Solflare</button></div>{purchase?.message && <p className="purchase-message">{purchase.message}</p>}</div></article>;
}

function SupplyCard({ item }) {
  return <div className="supply-card"><p className="eyebrow">{item.className}</p><h3>{item.total}</h3><p>{item.ships}</p><small>{item.perShip}</small><b>{item.price}</b></div>;
}

function InfoCard({ item }) {
  return <div className="panel info-card"><div className="info-head"><span className="icon-box">{item.icon}</span><small>{item.step}</small></div><h3>{item.title}</h3><p className="muted">{item.text}</p></div>;
}

function SimpleCard({ item }) {
  return <div className="panel simple-card"><span className="icon-box">{item.icon}</span><div className="tag">{item.label}</div><h3>{item.name}</h3><p className="muted">{item.text}</p></div>;
}

function FactionCard({ race }) {
  return <div className="panel faction-card"><div className="faction-head"><div><small>{race.number}</small><h3>{race.name}</h3><p>{race.vibe}</p></div><span className="icon-box">{race.icon}</span></div><p className="muted">{race.text}</p><div className="traits">{race.traits.map((trait) => <span key={trait}>{trait}</span>)}</div></div>;
}

function SystemCard({ system }) {
  return <div className="panel system-card"><div className="system-head"><div><div className="tag">{system.tag}</div><h3>{system.title}</h3></div><span className="icon-box">{system.icon}</span></div><p className="muted">{system.text}</p><div className="mini-grid">{system.bullets.map((bullet) => <MiniLine key={bullet}>{bullet}</MiniLine>)}</div></div>;
}

function Feature({ children }) {
  return <div className="feature"><span>◆</span>{children}</div>;
}

function MiniLine({ children }) {
  return <div className="mini-line"><span>◆</span>{children}</div>;
}

function Stat({ value, label, caption }) {
  return <div className="stat"><b>{value}</b><span>{label}</span>{caption && <small>{caption}</small>}</div>;
}

function SectionHeader({ eyebrow, title, text }) {
  return <div className="section-header"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><p className="muted">{text}</p></div>;
}

function OrbitNode({ className = '', pulse = false }) {
  return <div className={`orbit-node ${className}`}>{pulse && <span className="pulse" />}<i /></div>;
}
