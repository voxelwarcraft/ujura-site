export const defaultControlState = {
  version: 1,
  updatedAt: null,
  majori: {
    domain: "majorigames.com",
    statusBanner: {
      enabled: false,
      text: "",
      tone: "cyan",
    },
    hero: {
      eyebrow: "Majori Games Presents",
      title: "Worlds Worth Mastering.",
      body: "We make premium online worlds where players build the economy, fight for status, lose real stakes, and create stories that last.",
      primaryCta: { label: "Explore Games", href: "#games" },
      secondaryCta: { label: "Watch Trailer", href: "#news" },
    },
    navigation: {
      ujuraUrl: "https://ujura.com",
      alphaLabel: "Play Alpha",
      signInLabel: "Sign In",
    },
    foundersPass: {
      enabled: true,
      title: "200 lifetime founder passes",
      body: "Founders Pass are limited NFT passes created to support the critical early development of the Majori Games ecosystem.",
      ctaLabel: "Buy Founders Pass",
    },
    blog: {
      enabled: true,
      eyebrow: "Latest News",
      title: "What's happening",
      intro: "Studio notes, development updates, and worldbuilding drops from Majori Games.",
      posts: [
            {
                  id: "majori-reveals-ujura-makgura",
                  status: "published",
                  featured: true,
                  category: "Studio Update",
                  title: "Majori Games reveals Ujura and Makgura",
                  slug: "majori-games-reveals-ujura-and-makgura",
                  excerpt: "Two original online worlds establish the foundation for Majori's long-term universe strategy.",
                  seoTitle: "Majori Games reveals Ujura and Makgura",
                  seoDescription: "Two original online worlds establish the foundation for Majori's long-term universe strategy.",
                  body: "Majori Games is building a connected ecosystem of online worlds with Ujura and Makgura at the center. Ujura focuses on sci-fi sovereignty, player industry, and risk-driven space conflict, while Makgura explores brutal fantasy PvP, clans, raids, and honor-driven warfare.",
                  author: "Majori Games",
                  publishedAt: "2026-05-04",
                  imageStyle: "linear-gradient(135deg,#101217,#5b7cff)",
                  imageUrl: ""
            },
            {
                  id: "ujura-risk-economy",
                  status: "published",
                  featured: false,
                  category: "Ujura",
                  title: "A sandbox economy where risk creates the story",
                  slug: "ujura-sandbox-economy-risk-story",
                  excerpt: "Mine resources, build ships, control routes, fight pirates, and lose what you bring into battle.",
                  seoTitle: "A sandbox economy where risk creates the story",
                  seoDescription: "Mine resources, build ships, control routes, fight pirates, and lose what you bring into battle.",
                  body: "Ujura is designed around connected systems where every trip matters. Resource hauling, ship production, piracy, security status, PvP, and market pressure all create stories that players can actually affect.",
                  author: "Majori Games",
                  publishedAt: "2026-05-04",
                  imageStyle: "radial-gradient(circle at 35% 22%, rgba(88,231,255,.68), transparent 19%), radial-gradient(circle at 72% 45%, rgba(91,124,255,.42), transparent 26%), linear-gradient(135deg, #030914 0%, #071a38 44%, #180a30 100%)",
                  imageUrl: ""
            },
            {
                  id: "makgura-clans-honor",
                  status: "published",
                  featured: false,
                  category: "Makgura",
                  title: "A brutal fantasy world built around clans and honor",
                  slug: "makgura-clans-and-honor",
                  excerpt: "Warbands, raids, territory, crafted gear, and PvP encounters with real consequence.",
                  seoTitle: "A brutal fantasy world built around clans and honor",
                  seoDescription: "Warbands, raids, territory, crafted gear, and PvP encounters with real consequence.",
                  body: "Makgura brings Majori into a harsh fantasy world where clans, warbands, crafted gear, raids, territory, and player reputation shape the long-term conflict.",
                  author: "Majori Games",
                  publishedAt: "2026-05-04",
                  imageStyle: "radial-gradient(circle at 50% 10%, rgba(240,179,91,.62), transparent 22%), radial-gradient(circle at 18% 65%, rgba(193,72,35,.30), transparent 28%), linear-gradient(135deg, #1a0d09 0%, #321b0f 45%, #070606 100%)",
                  imageUrl: ""
            }
      ]
},
  },
  ujura: {
    domain: "ujura.com",
    statusBanner: {
      enabled: false,
      text: "",
      tone: "blue",
    },
    hero: {
      badge: "Pre-alpha concept now forming",
      title: "A player-owned tactical space MMO where ships, planets, blueprints, and guild wars all connect.",
      body: "Explore a player-owned galaxy of high-sec missions, low-sec piracy, null-sec warfare, pirate faction NPCs, combat sites, contested planets, Veil raid systems, and a player-driven economy built around production, destruction, ownership, governance, ship loss, dropped loot, and the one-of-one Starcore that turns the universe into a warzone.",
      primaryCta: { label: "Explore Ujura", href: "#world" },
      secondaryCta: { label: "View NFT Sale", action: "nfts" },
    },
    toggles: {
      nftSaleEnabled: true,
      seedSaleEnabled: true,
      walletButtonsEnabled: true,
      alphaAccessEnabled: true,
    },
    alpha: {
      title: "Enter the first gate.",
      body: "Get early alpha access for concept art, faction reveals, ship drops, dev logs, blueprint launches, seed round updates, and pre-alpha play windows.",
      ctaLabel: "Play Alpha",
    },
    blog: {
      enabled: true,
      eyebrow: "Transmission Log",
      title: "Ujura updates from the frontier.",
      intro: "Development notes, lore transmissions, economy updates, and sale announcements for Ujura.",
      posts: [
            {
                  id: "ujura-starcore-war-objective",
                  status: "published",
                  featured: true,
                  category: "Game Systems",
                  title: "The Starcore turns the universe into a warzone",
                  slug: "starcore-war-objective",
                  excerpt: "Only one Starcore exists at a time, creating a global PvP flashpoint for null-sec alliances.",
                  seoTitle: "The Starcore turns the universe into a warzone",
                  seoDescription: "Only one Starcore exists at a time, creating a global PvP flashpoint for null-sec alliances.",
                  body: "The Ujura Starcore is a one-of-one war objective. It appears as a dangerous null-sec combat site, must be deployed at a star, and then becomes a global conflict zone where players fight for timed rewards and control.",
                  author: "Ujura Team",
                  publishedAt: "2026-05-04",
                  imageStyle: "radial-gradient(circle at center, rgba(79,163,183,.34), transparent 34%), radial-gradient(circle at 78% 22%, rgba(141,219,236,.22), transparent 20%), linear-gradient(135deg,#020611,#0b1f33)",
                  imageUrl: ""
            },
            {
                  id: "ujura-blueprint-production",
                  status: "published",
                  featured: false,
                  category: "Blueprint Economy",
                  title: "Blueprint ownership is production, not instant power",
                  slug: "blueprint-production-rights",
                  excerpt: "Master Original Blueprints grant production rights while ships still require resources, time, and risk.",
                  seoTitle: "Blueprint ownership is production, not instant power",
                  seoDescription: "Master Original Blueprints grant production rights while ships still require resources, time, and risk.",
                  body: "Blueprints in Ujura are meant to control production rights, not spawn finished power. Owners generate limited-use Blueprint Copies over time, and players still need resources, industry, logistics, and risk to produce ships.",
                  author: "Ujura Team",
                  publishedAt: "2026-05-04",
                  imageStyle: "radial-gradient(circle at 45% 36%, rgba(79,163,183,.36), transparent 26%), linear-gradient(135deg,rgba(79,163,183,.12),rgba(255,255,255,.02))",
                  imageUrl: ""
            },
            {
                  id: "ujura-security-status",
                  status: "draft",
                  featured: false,
                  category: "World Design",
                  title: "High-sec, low-sec, and null-sec shape player risk",
                  slug: "security-status-risk",
                  excerpt: "Security status defines where players can trade safely, pirate for profit, or fight for territory.",
                  seoTitle: "High-sec, low-sec, and null-sec shape player risk",
                  seoDescription: "Security status defines where players can trade safely, pirate for profit, or fight for territory.",
                  body: "High-sec supports safer progression, low-sec opens the door to piracy and richer rewards, and null-sec becomes the lawless player-controlled layer where territory, resources, and Starcore control create conflict.",
                  author: "Ujura Team",
                  publishedAt: "",
                  imageStyle: "radial-gradient(circle at 18% 22%, rgba(141,219,236,.28), transparent 18%), linear-gradient(135deg,#03050a,#0d2234)",
                  imageUrl: ""
            }
      ]
},
  },
};

export function mergeControlState(base, override) {
  if (!override || typeof override !== "object") return base;

  const output = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      output[key] = mergeControlState(base[key], value);
    } else {
      output[key] = value;
    }
  }

  return output;
}
