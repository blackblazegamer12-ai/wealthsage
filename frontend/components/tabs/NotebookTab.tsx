"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Save, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface NotebookTabProps {
  notes: any[];
  activeNote: any;
  setActiveNote: (note: any) => void;
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  noteContent: string;
  setNoteContent: React.Dispatch<React.SetStateAction<string>>;
  onCreateNewNote: () => void;
  onSaveNote: () => void;
  onAskTutor: () => void;
  isTutorThinking: boolean;
}

export default function NotebookTab({
  notes,
  activeNote,
  setActiveNote,
  noteTitle,
  setNoteTitle,
  noteContent,
  setNoteContent,
  onCreateNewNote,
  onSaveNote,
  onAskTutor,
  isTutorThinking
}: NotebookTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1 block">
          Mathematical Notebook & Tutor
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Quant Reasoning & Formula Notebook
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Document wealth hypotheses with live LaTeX formulas and consult the AI Tutor for mathematical proofs.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-220px)] min-h-[600px] gap-6">
        {/* Left Column: Note List */}
        <div className="w-full lg:w-1/4 glass-panel rounded-3xl p-5 flex flex-col overflow-hidden">
          <button
            type="button"
            onClick={onCreateNewNote}
            className="w-full btn-brass py-3 rounded-2xl mb-4 font-bold transition-all text-xs flex items-center justify-center gap-1.5"
          >
            <Plus size={15} /> New Research Note
          </button>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  setActiveNote(note);
                  setNoteTitle(note.title);
                  setNoteContent(note.content);
                }}
                className="p-3.5 rounded-2xl cursor-pointer transition-all border"
                style={activeNote?.id === note.id
                  ? { backgroundColor: 'var(--accent-subtle)', borderColor: 'var(--border-royal)', boxShadow: '0 2px 8px var(--accent-glow)' }
                  : { backgroundColor: 'transparent', borderColor: 'var(--border-subtle)' }
                }
              >
                <h4 className="font-semibold truncate text-xs" style={{ color: 'var(--text-primary)' }}>{note.title}</h4>
                <p className="text-[10px] truncate mt-1" style={{ color: 'var(--text-muted)' }}>
                  {note.content?.slice(0, 45) || "Empty note content..."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Raw Markdown Editor */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="flex items-center gap-2 glass-panel p-3 rounded-2xl">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="flex-1 bg-transparent text-base font-bold focus:outline-none min-w-0 pl-2"
              style={{ color: 'var(--text-primary)' }}
              placeholder="Note Title..."
            />
            <button
              type="button"
              onClick={onAskTutor}
              disabled={isTutorThinking}
              className="shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all disabled:opacity-50 text-xs font-bold border border-purple-500/40"
              title="Ask AI Quant Tutor"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isTutorThinking ? "animate-spin" : ""}`} />
              {isTutorThinking ? "Synthesizing..." : "Ask Tutor"}
            </button>
            <button
              type="button"
              onClick={onSaveNote}
              className="shrink-0 p-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-xl transition-colors border border-emerald-500/40"
              title="Save Note"
            >
              <Save size={16} />
            </button>
          </div>

          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Document financial logic in Markdown. Use $ for inline math ($E=mc^2$) and $$ for block math ($$A = P(1 + r/n)^{nt}$$)..."
            className="flex-1 glass-panel rounded-3xl p-6 font-mono text-xs focus:outline-none focus:border-[var(--accent-primary)] resize-none leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>

        {/* Right Column: Live Rendered Output */}
        <div className="w-full lg:w-5/12 glass-panel rounded-3xl p-6 sm:p-8 overflow-y-auto prose max-w-none" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-royal)' }}>
          {noteContent ? (
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[[rehypeKatex, { strict: false }]]}
            >
              {noteContent}
            </ReactMarkdown>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-xs italic" style={{ color: 'var(--text-muted)' }}>
              <BookOpen className="w-8 h-8 mb-2 opacity-40" />
              Live Markdown & LaTeX proofs will render here in real-time...
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
