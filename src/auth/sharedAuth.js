import { useCallback, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "majori_shared_auth_token";
export const AUTH_API_BASE = "https://www.majorigames.com";

function apiUrl(path) {
  return `${AUTH_API_BASE}${path}`;
}

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token) {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export async function authFetch(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Authentication request failed");
  return body;
}

export function useSharedAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const session = await authFetch("/api/auth/session", { method: "GET" });
      setUser(session.authenticated ? session.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    storeToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return useMemo(() => ({ user, loading, refresh, signOut }), [user, loading, refresh, signOut]);
}

export async function emailAuth(mode, email, password) {
  const result = await authFetch("/api/auth/email", {
    method: "POST",
    body: JSON.stringify({ mode, email, password }),
  });
  storeToken(result.token);
  return result.user;
}

export function getSolanaProvider(providerName) {
  if (typeof window === "undefined") return null;
  if (providerName === "solflare") return window.solflare || null;
  const solana = window.solana;
  if (solana?.isPhantom) return solana;
  return solana || window.phantom?.solana || null;
}

export async function walletAuth(providerName) {
  const provider = getSolanaProvider(providerName);
  if (!provider) {
    throw new Error(providerName === "solflare" ? "Solflare wallet was not found" : "Phantom wallet was not found");
  }
  if (!provider.signMessage) throw new Error("This wallet does not support message signing");

  const connection = await provider.connect();
  const publicKey = connection.publicKey || provider.publicKey;
  const walletAddress = publicKey?.toString();
  if (!walletAddress) throw new Error("Could not read wallet address");

  const challenge = await authFetch("/api/auth/wallet-challenge", {
    method: "POST",
    body: JSON.stringify({ walletAddress, provider: providerName }),
  });

  const encodedMessage = new TextEncoder().encode(challenge.message);
  const signed = await provider.signMessage(encodedMessage, "utf8");
  const signatureBytes = signed.signature || signed;
  const signature = bytesToBase64(signatureBytes);

  const result = await authFetch("/api/auth/wallet-verify", {
    method: "POST",
    body: JSON.stringify({ walletAddress, message: challenge.message, signature, provider: providerName }),
  });
  storeToken(result.token);
  return result.user;
}

function bytesToBase64(bytes) {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}
