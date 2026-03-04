'use client';

type Tool = 'brush' | 'fill' | 'eraser';

export default function Toolbar({
  tool,
  setTool,
  undo,
  redo,
  clear,
  save,
  exportPdf
}: {
  tool: Tool;
  setTool: (t: Tool) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  save: () => void;
  exportPdf: () => void;
}) {
  const tools: { key: Tool; label: string }[] = [
    { key: 'brush', label: '🖌️ Brush' },
    { key: 'fill', label: '🪣 Fill' },
    { key: 'eraser', label: '🧽 Eraser' }
  ];

  return (
    <div className="toolbar">
      {tools.map((t) => (
        <button key={t.key} className="tool-btn" onClick={() => setTool(t.key)} style={{ background: tool === t.key ? '#ffd93d' : 'white' }}>
          {t.label}
        </button>
      ))}
      <button className="tool-btn" onClick={undo}>↩️ Undo</button>
      <button className="tool-btn" onClick={redo}>↪️ Redo</button>
      <button className="tool-btn" onClick={clear}>🧼 Clear</button>
      <button className="tool-btn" onClick={save}>💾 Save</button>
      <button className="tool-btn" onClick={exportPdf}>🖨️ Print</button>
    </div>
  );
}
