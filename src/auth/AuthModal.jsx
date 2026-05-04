import React, { useState } from "react";
import { emailAuth, walletAuth } from "./sharedAuth";

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "grid",
  placeItems: "center",
  padding: 24,
  background: "rgba(0, 0, 0, .72)",
  backdropFilter: "blur(16px)",
};

const panel = {
  width: "min(560px, 100%)",
  border: "1px solid rgba(255,255,255,.14)",
  borderRadius: 28,
  background: "linear-gradient(145deg, rgba(8,13,24,.96), rgba(5,6,10,.98))",
  boxShadow: "0 30px 90px rgba(0,0,0,.55)",
  color: "white",
  padding: 28,
};

const input = {
  width: "100%",
  border: "1px solid rgba(255,255,255,.14)",
  borderRadius: 16,
  background: "rgba(255,255,255,.06)",
  color: "white",
  padding: "14px 16px",
  outline: "none",
};

const button = {
  border: 0,
  borderRadius: 999,
  padding: "14px 18px",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: ".12em",
  cursor: "pointer",
};

export default function AuthModal({ open, onClose, onAuthenticated, user, signOut }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      const nextUser = await action();
      onAuthenticated?.(nextUser);
      onClose?.();
    } catch (authError) {
      setError(authError.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitEmail(event) {
    event.preventDefault();
    await run(() => emailAuth(mode, email, password));
  }

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-label="Account login">
      <div style={panel}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start" }}>
          <div>
            <div style={{ color: "#8ddbec", fontSize: 12, fontWeight: 900, letterSpacing: ".22em", textTransform: "uppercase" }}>Shared Majori Account</div>
            <h2 style={{ margin: "10px 0 0", fontSize: 40, lineHeight: .9, letterSpacing: "-.06em", textTransform: "uppercase" }}>Sign in once. Use both worlds.</h2>
          </div>
          <button onClick={onClose} style={{ ...button, background: "rgba(255,255,255,.08)", color: "white", padding: "10px 13px" }}>X</button>
        </div>

        {user ? (
          <div style={{ marginTop: 24 }}>
            <div style={{ border: "1px solid rgba(255,255,255,.12)", borderRadius: 18, padding: 16, background: "rgba(255,255,255,.05)" }}>
              <strong>{user.email || "Wallet account"}</strong>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.62)", lineHeight: 1.6 }}>{user.wallets?.length ? `Wallet: ${shortWallet(user.wallets[0])}` : "No wallet linked yet."}</p>
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <button style={{ ...button, background: "#8ddbec", color: "#02050a" }} onClick={() => run(() => walletAuth("phantom"))}>Link Phantom Wallet</button>
              <button style={{ ...button, background: "rgba(141,219,236,.16)", color: "white", border: "1px solid rgba(141,219,236,.35)" }} onClick={() => run(() => walletAuth("solflare"))}>Link Solflare Wallet</button>
              <button style={{ ...button, background: "rgba(255,255,255,.08)", color: "white" }} onClick={() => { signOut?.(); onClose?.(); }}>Sign Out</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
              <button style={{ ...button, background: "#8ddbec", color: "#02050a" }} onClick={() => run(() => walletAuth("phantom"))} disabled={busy}>Connect Phantom</button>
              <button style={{ ...button, background: "rgba(141,219,236,.16)", color: "white", border: "1px solid rgba(141,219,236,.35)" }} onClick={() => run(() => walletAuth("solflare"))} disabled={busy}>Connect Solflare</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0", color: "rgba(255,255,255,.45)", fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>
              <span style={{ height: 1, flex: 1, background: "rgba(255,255,255,.12)" }} /> OR USE EMAIL <span style={{ height: 1, flex: 1, background: "rgba(255,255,255,.12)" }} />
            </div>

            <form onSubmit={submitEmail} style={{ display: "grid", gap: 12 }}>
              <input style={input} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
              <input style={input} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required minLength={8} />
              <button style={{ ...button, background: "white", color: "black" }} disabled={busy}>{busy ? "Working..." : mode === "signup" ? "Create Account" : "Sign In"}</button>
            </form>

            <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={{ marginTop: 14, border: 0, background: "transparent", color: "#8ddbec", cursor: "pointer", fontWeight: 800 }}>
              {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Create one"}
            </button>
          </>
        )}

        {error && <p style={{ marginTop: 16, color: "#ff9b9b", lineHeight: 1.6 }}>{error}</p>}
        <p style={{ margin: "18px 0 0", color: "rgba(255,255,255,.45)", fontSize: 12, lineHeight: 1.6 }}>
          Wallet signatures only prove ownership. They do not approve a transaction or spend funds.
        </p>
      </div>
    </div>
  );
}

function shortWallet(wallet) {
  if (!wallet) return "";
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}
