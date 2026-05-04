import { Connection, Transaction } from "@solana/web3.js";
import { AUTH_API_BASE, authFetch, getSolanaProvider, walletAuth } from "./auth/sharedAuth";

export async function fetchNftCatalog() {
  const response = await fetch(`${AUTH_API_BASE}/api/nft/catalog`, { cache: "no-store" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Could not load NFT catalog");
  return body;
}

export async function buyNftWithWallet({ itemId, providerName, onAuthenticated }) {
  const provider = getSolanaProvider(providerName);
  if (!provider) throw new Error(providerName === "solflare" ? "Solflare wallet was not found" : "Phantom wallet was not found");
  if (!provider.signTransaction) throw new Error("This wallet cannot sign Solana purchase transactions");

  const user = await walletAuth(providerName);
  onAuthenticated?.(user);
  const walletAddress = provider.publicKey?.toString() || user.wallets?.[0];
  if (!walletAddress) throw new Error("Could not read your connected wallet address");

  const checkout = await authFetch("/api/nft/checkout", {
    method: "POST",
    body: JSON.stringify({ itemId, walletAddress }),
  });

  const transaction = Transaction.from(base64ToBytes(checkout.transaction));
  const signed = await provider.signTransaction(transaction);
  const connection = new Connection(checkout.rpcUrl, "confirmed");
  const signature = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false });
  await connection.confirmTransaction(signature, "confirmed");

  const confirmed = await authFetch("/api/nft/confirm", {
    method: "POST",
    body: JSON.stringify({ orderId: checkout.order.id, signature }),
  });

  return { ...confirmed, signature };
}

function base64ToBytes(value) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}
