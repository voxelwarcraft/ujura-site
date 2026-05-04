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
