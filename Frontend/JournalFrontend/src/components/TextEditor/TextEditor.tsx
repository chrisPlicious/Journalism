"use client";

import type React from "react";
import { useRef, useState, useEffect, forwardRef } from "react";
import { Bold, Italic, Underline, Undo2, Redo2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ value = "", onChange, placeholder = "Start writing...", className, disabled, error }, ref) => {
    const editorRef = useRef<HTMLDivElement | null>(null);

    // history & redo stacks
    const [history, setHistory] = useState<string[]>([]);
    const [future, setFuture] = useState<string[]>([]);

    const [active, setActive] = useState<string[]>([]);

    const listenersRef = useRef<
      | {
          el?: HTMLDivElement | null;
          beforeInput?: EventListenerOrEventListenerObject;
          keydown?: EventListenerOrEventListenerObject;
        }
      | undefined
    >(undefined);

    // when external value changes, update editor and clear history
    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
        setHistory([]);
        setFuture([]);
      }
    }, [value]);

    const pushToHistory = (snapshot: string) => {
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last === snapshot) return prev;
        const MAX = 150;
        const next = [...prev, snapshot];
        return next.length > MAX ? next.slice(next.length - MAX) : next;
      });
      setFuture([]);
    };

    function applyCommand(command: string) {
      if (!editorRef.current) return;
      pushToHistory(editorRef.current.innerHTML);
      document.execCommand(command, false, "");
      const content = editorRef.current.innerHTML;
      onChange?.(content);
    }

    function toggleFormat(format: string) {
      applyCommand(format);
      // Update active state based on queryCommandState
      setActive((prev) => {
        const isActive = document.queryCommandState(format);
        if (isActive) {
          return prev.includes(format) ? prev : [...prev, format];
        } else {
          return prev.filter((x) => x !== format);
        }
      });
    }

    const handleInput = () => {
      if (onChange && editorRef.current) {
        const content = editorRef.current.innerHTML;
        onChange(content);
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      if (!editorRef.current) return;
      pushToHistory(editorRef.current.innerHTML);
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      handleInput();
    };

    const handleUndo = () => {
      if (!editorRef.current || history.length === 0) return;
      const prev = history[history.length - 1];
      const current = editorRef.current.innerHTML;
      setHistory((h) => h.slice(0, -1));
      setFuture((f) => [current, ...f]);
      editorRef.current.innerHTML = prev;
      onChange?.(prev);
      try {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      } catch {}
    };

    const handleRedo = () => {
      if (!editorRef.current || future.length === 0) return;
      const next = future[0];
      const current = editorRef.current.innerHTML;
      setFuture((f) => f.slice(1));
      setHistory((h) => [...h, current]);
      editorRef.current.innerHTML = next;
      onChange?.(next);
      try {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      } catch {}
    };

    useEffect(() => {
      return () => {
        if (listenersRef.current?.el && listenersRef.current.beforeInput) {
          listenersRef.current.el.removeEventListener(
            "beforeinput",
            listenersRef.current.beforeInput
          );
        }
        if (listenersRef.current?.el && listenersRef.current.keydown) {
          listenersRef.current.el.removeEventListener(
            "keydown",
            listenersRef.current.keydown
          );
        }
      };
    }, []);

    const isFormatActive = (format: string) => {
      try {
        return document.queryCommandState(format);
      } catch {
        return active.includes(format);
      }
    };

    return (
      <div className={cn("w-full", className)}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 mb-3">
          {/* Bold / Italic / Underline group */}
          <button
            type="button"
            onClick={() => toggleFormat("bold")}
            disabled={disabled}
            aria-label="Bold"
            className={cn(
              "inline-flex items-center justify-center bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded-lg p-2 transition-colors disabled:opacity-50",
              isFormatActive("bold") && "bg-[var(--sage-100)] text-[var(--sage-700)]"
            )}
          >
            <Bold className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat("italic")}
            disabled={disabled}
            aria-label="Italic"
            className={cn(
              "inline-flex items-center justify-center bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded-lg p-2 transition-colors disabled:opacity-50",
              isFormatActive("italic") && "bg-[var(--sage-100)] text-[var(--sage-700)]"
            )}
          >
            <Italic className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat("underline")}
            disabled={disabled}
            aria-label="Underline"
            className={cn(
              "inline-flex items-center justify-center bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded-lg p-2 transition-colors disabled:opacity-50",
              isFormatActive("underline") && "bg-[var(--sage-100)] text-[var(--sage-700)]"
            )}
          >
            <Underline className="h-[18px] w-[18px]" />
          </button>

          {/* Separator */}
          <div className="border-r border-[var(--border)] mx-1 h-6" />

          {/* Undo / Redo group */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0 || disabled}
            aria-label="Undo (Ctrl/Cmd+Z)"
            className="inline-flex items-center justify-center bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded-lg p-2 transition-colors disabled:opacity-50"
          >
            <Undo2 className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={future.length === 0 || disabled}
            aria-label="Redo (Ctrl/Cmd+Y / Ctrl/Cmd+Shift+Z)"
            className="inline-flex items-center justify-center bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded-lg p-2 transition-colors disabled:opacity-50"
          >
            <Redo2 className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Editor area */}
        <div className="relative">
          <div
            ref={(node) => {
              if (listenersRef.current?.el && listenersRef.current.el !== node) {
                try {
                  listenersRef.current.el.removeEventListener(
                    "beforeinput",
                    listenersRef.current.beforeInput!
                  );
                  listenersRef.current.el.removeEventListener(
                    "keydown",
                    listenersRef.current.keydown!
                  );
                } catch {}
                listenersRef.current = undefined;
              }

              editorRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
              }

              if (node && !listenersRef.current) {
                const beforeInput = (_e: Event) => {
                  try {
                    pushToHistory((node as HTMLDivElement).innerHTML);
                  } catch {}
                };

                const keydown = (e: KeyboardEvent) => {
                  const z = e.key.toLowerCase() === "z";
                  const y = e.key.toLowerCase() === "y";
                  const isMeta = e.ctrlKey || e.metaKey;
                  if (isMeta && z) {
                    e.preventDefault();
                    if (e.shiftKey) handleRedo();
                    else handleUndo();
                  } else if (isMeta && y) {
                    e.preventDefault();
                    handleRedo();
                  }
                };

                node.addEventListener("beforeinput", beforeInput as EventListener);
                node.addEventListener("keydown", keydown as EventListener);

                listenersRef.current = {
                  el: node,
                  beforeInput,
                  keydown,
                };
              }
            }}
            contentEditable={!disabled}
            className={cn(
              "min-h-[400px] w-full p-6 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[17px] font-normal leading-[1.7] focus:outline-none focus-within:ring-2 focus-within:ring-[var(--ring)] focus:border-[var(--primary)] transition-colors",
              error && "border-destructive focus-within:ring-destructive",
              disabled && "opacity-50 cursor-not-allowed bg-muted"
            )}
            onInput={handleInput}
            onBlur={() => {
              if (onChange && editorRef.current) {
                onChange(editorRef.current.innerHTML);
              }
            }}
            onPaste={handlePaste}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />

          {placeholder && !value && (
            <div
              className="absolute pointer-events-none text-[var(--muted-foreground)] italic text-[17px] leading-[1.7]"
              style={{
                top: "1.5rem",
                left: "1.5rem",
              }}
            >
              {placeholder}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TextEditor.displayName = "TextEditor";

export default TextEditor;
