import { useMemo, useState } from "react";
import { Copy, Eye, KeyRound, Link2, QrCode, ShieldOff } from "lucide-react";

import { Modal } from "./Modal";
import { ActionButton, Field } from "@/components/Bits";
import { useLang } from "@/lib/i18n";
import { shareLinks } from "@/lib/mock-extras";

/** Tiny deterministic QR-ish matrix — decorative placeholder for the real code. */
function QrPreview({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 100000;
    return Array.from({ length: 121 }, (_, i) => {
      h = (h * 1103515245 + 12345) % 2147483648;
      const edge = i < 11 || i > 109 || i % 11 === 0 || i % 11 === 10;
      return edge ? (i + Math.floor(i / 11)) % 2 === 0 : h % 3 !== 0;
    });
  }, [seed]);

  return (
    <div
      className="grid size-32 grid-cols-11 gap-px rounded-md border border-border bg-background p-2"
      role="img"
      aria-label="QR code"
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-foreground/85" : "bg-transparent"} />
      ))}
    </div>
  );
}

export function ShareDialog({
  open,
  onClose,
  token,
}: {
  open: boolean;
  onClose: () => void;
  token: string;
}) {
  const { t, lang } = useLang();
  const [readOnly, setReadOnly] = useState(true);
  const [pwd, setPwd] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const url = `smritocharon.app/shared/${token}`;

  return (
    <Modal open={open} onClose={onClose} title={t("share")}>
      <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 text-xs">
        <Link2 className="size-3.5 shrink-0 text-primary" aria-hidden />
        <span className="truncate">{url}</span>
        <button
          type="button"
          aria-label={t("copyLink")}
          onClick={() => void navigator.clipboard?.writeText(`https://${url}`)}
          className="ml-auto text-primary transition hover:scale-110"
        >
          <Copy className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <label className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 px-3 py-2">
          <span className="flex items-center gap-2">
            <Eye className="size-4 text-primary/80" aria-hidden /> {t("readOnly")}
          </span>
          <input
            type="checkbox"
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 px-3 py-2">
          <span className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary/80" aria-hidden /> {t("passwordProtect")}
          </span>
          <input
            type="checkbox"
            checked={pwd}
            onChange={(e) => setPwd(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
        </label>
        {pwd && (
          <Field label={t("password")}>
            <input
              type="password"
              defaultValue="smriti-1968"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
        )}
        <Field label={t("expiry")}>
          <input
            type="date"
            defaultValue="2026-12-31"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <ActionButton variant="ghost" onClick={() => setShowQr((v) => !v)}>
          <QrCode className="size-4" aria-hidden /> {t("qrCode")}
        </ActionButton>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-destructive/50 px-3 py-2 text-sm text-destructive transition hover:bg-destructive/10"
        >
          <ShieldOff className="size-4" aria-hidden /> {t("revoke")}
        </button>
      </div>

      {showQr && (
        <div className="mt-4 flex justify-center animate-unfurl">
          <QrPreview seed={token} />
        </div>
      )}

      <div className="mt-6">
        <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          {t("shares")}
        </p>
        <ul className="space-y-2">
          {shareLinks.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 px-3 py-2 text-xs"
            >
              <span className="truncate">/{s.token}</span>
              <span className="text-muted-foreground">
                {s.scope[lang]} · {s.views} 👁
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-end">
        <ActionButton onClick={onClose}>{t("save")}</ActionButton>
      </div>
    </Modal>
  );
}
