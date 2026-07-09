import { useCallback, useRef, useState } from "react";
import { FileUp, Loader2, X, FileText } from "lucide-react";
import { toast } from "sonner";

// pdfjs worker setup (uses CDN worker matching installed version)
import * as pdfjsLib from "pdfjs-dist";
// @ts-expect-error - vite ?url import for worker
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

type FileEntry = { name: string; chars: number };

export type PdfDropzoneProps = {
  /** Called with concatenated extracted text every time files change. */
  onText: (text: string, files: FileEntry[]) => void;
  label?: string;
  hint?: string;
  className?: string;
};

async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let out = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it: unknown) => (it as { str?: string }).str ?? "");
    out += strings.join(" ") + "\n\n";
  }
  return out.trim();
}

export function PdfDropzone({ onText, label = "Upload PDFs", hint = "Drop one or more PDFs. Text is extracted in your browser.", className = "" }: PdfDropzoneProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [texts, setTexts] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const emit = useCallback((entries: FileEntry[], parts: string[]) => {
    const combined = parts
      .map((t, i) => `--- ${entries[i]?.name ?? `file ${i + 1}`} ---\n${t}`)
      .join("\n\n");
    onText(combined, entries);
  }, [onText]);

  const addFiles = useCallback(async (list: FileList | File[]) => {
    const pdfs = Array.from(list).filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) { toast.error("Only PDF files are supported"); return; }
    setBusy(true);
    try {
      const newEntries: FileEntry[] = [];
      const newTexts: string[] = [];
      for (const f of pdfs) {
        try {
          const t = await extractPdfText(f);
          newEntries.push({ name: f.name, chars: t.length });
          newTexts.push(t);
        } catch (e) {
          toast.error(`Failed to read ${f.name}: ${(e as Error).message}`);
        }
      }
      const nextEntries = [...files, ...newEntries];
      const nextTexts = [...texts, ...newTexts];
      setFiles(nextEntries);
      setTexts(nextTexts);
      emit(nextEntries, nextTexts);
      if (newEntries.length) toast.success(`Loaded ${newEntries.length} PDF${newEntries.length > 1 ? "s" : ""}`);
    } finally {
      setBusy(false);
    }
  }, [files, texts, emit]);

  function removeAt(i: number) {
    const nextEntries = files.filter((_, idx) => idx !== i);
    const nextTexts = texts.filter((_, idx) => idx !== i);
    setFiles(nextEntries);
    setTexts(nextTexts);
    emit(nextEntries, nextTexts);
  }

  function clearAll() {
    setFiles([]); setTexts([]); onText("", []);
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${drag ? "border-primary bg-primary/5" : "border-border bg-surface/40 hover:border-primary/50"}`}
      >
        {busy ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <FileUp className="h-6 w-6 text-primary" />}
        <div className="font-mono text-[11px] uppercase tracking-widest text-primary">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{(f.chars / 1000).toFixed(1)}k chars</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeAt(i); }} className="rounded p-1 text-muted-foreground hover:bg-border hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button onClick={clearAll} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary">Clear all</button>
        </div>
      )}
    </div>
  );
}
