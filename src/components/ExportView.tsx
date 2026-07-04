import { useState } from "react";
import { useStore } from "../store";
import { buildExportDoc } from "../lib/prompt";
import { Card, Button, CopyButton, ViewHeader } from "./ui";

export function ExportView() {
  const s = useStore((st) => st.s);
  const [doc, setDoc] = useState<string>("");

  const build = () => setDoc(buildExportDoc(s, new Date().toLocaleDateString()));

  const download = () => {
    const md = buildExportDoc(s, new Date().toLocaleDateString());
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ghar-design-file.md";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <ViewHeader
        eyebrow="Sab kuch ek file mein"
        title="Full design file"
        lead="Style + kamre + saare saved prompts ek document mein — carpenter, kitchen wale aur false-ceiling wale ko dene ke liye."
      />
      <Card>
        <div className="flex flex-wrap gap-3.5 items-center mb-3.5">
          <Button variant="primary" onClick={build}>
            Build document
          </Button>
          <CopyButton small text={doc} label="Copy" />
          <Button small onClick={download}>
            Download .md
          </Button>
        </div>
        <pre className="prompt-pre max-h-[520px]">
          {doc || 'Press "Build document".'}
        </pre>
      </Card>
    </div>
  );
}
