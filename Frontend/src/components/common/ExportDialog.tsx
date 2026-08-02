import { useState } from "react";
import { FileArchive, FileCode2, FileText, FileType2 } from "lucide-react";

import { Modal } from "./Modal";
import { ActionButton } from "@/components/Bits";
import { useLang } from "@/lib/i18n";

type Format = "zip" | "json" | "md" | "pdf";

const formats: { id: Format; icon: typeof FileArchive; key: "exportZip" | "exportJson" | "exportMd" | "exportPdf" }[] = [
  { id: "zip", icon: FileArchive, key: "exportZip" },
  { id: "json", icon: FileCode2, key: "exportJson" },
  { id: "md", icon: FileText, key: "exportMd" },
  { id: "pdf", icon: FileType2, key: "exportPdf" },
];

/** Reusable export dialog — ZIP / JSON / Markdown / PDF. */
export function ExportDialog({
  open,
  onClose,
  target,
}: {
  open: boolean;
  onClose: () => void;
  target?: string;
}) {
  const { t } = useLang();
  const [picked, setPicked] = useState<Format>("zip");
  const [busy, setBusy] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={t("export")}>
      {target && <p className="mb-4 text-sm text-muted-foreground">{target}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {formats.map(({ id, icon: Icon, key }) => (
          <button
            key={id}
            type="button"
            aria-pressed={picked === id}
            onClick={() => setPicked(id)}
            className={`flex items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all duration-300 hover:-translate-y-0.5 ${
              picked === id
                ? "border-primary bg-primary/8 text-primary"
                : "border-border bg-background/60 hover:border-primary/40"
            }`}
          >
            <Icon className="size-5" aria-hidden />
            {t(key)}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <ActionButton variant="ghost" onClick={onClose}>
          {t("cancel")}
        </ActionButton>
        <ActionButton
          onClick={() => {
            setBusy(true);
            setTimeout(() => {
              setBusy(false);
              onClose();
            }, 1200);
          }}
        >
          {busy ? t("loading") : t("download")}
        </ActionButton>
      </div>
    </Modal>
  );
}
