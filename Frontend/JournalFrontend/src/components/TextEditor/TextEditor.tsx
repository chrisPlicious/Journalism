"use client";

import type React from "react";
import { useRef, useState, useEffect, forwardRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "../ui/button-group";
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
  ({ value = "", onChange, placeholder, className, disabled, error }, ref) => {
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

    function onToggleChange(newVal: string[] | null) {
      const newActive = newVal ?? [];
      const added = newActive.filter((x) => !active.includes(x));

      added.forEach((k) => {
        if (k === "bold") applyCommand("bold");
        if (k === "italic") applyCommand("italic");
        if (k === "underline") applyCommand("underline");
      });

      setActive(newActive);
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

    const handleClear = () => {
      if (!editorRef.current) return;
      pushToHistory(editorRef.current.innerHTML);
      editorRef.current.innerHTML = "";
      setActive([]);
      onChange?.("");
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

    return (
      <Card className={cn("w-full bg-zinc-50", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="multiple"
              variant={"outline"}
              className="inline-flex p-1"
              value={active}
              onValueChange={onToggleChange}
              aria-label="text formatting"
              disabled={disabled}
            >
              <ToggleGroupItem
                value="bold"
                aria-label="bold"
                disabled={disabled}
                className="inline-flex items-center justify-center px-3 py-2 rounded-md 
               hover:bg-muted/60 disabled:opacity-50
               data-[state=on]:bg-black data-[state=on]:text-white"
              >
                <Bold className="w-4 h-4" />
              </ToggleGroupItem>

              <ToggleGroupItem
                value="italic"
                aria-label="italic"
                disabled={disabled}
                className="inline-flex items-center justify-center px-3 py-2 rounded-md 
               hover:bg-muted/60 disabled:opacity-50
               data-[state=on]:bg-black data-[state=on]:text-white"
              >
                <Italic className="w-4 h-4" />
              </ToggleGroupItem>

              <ToggleGroupItem
                value="underline"
                aria-label="underline"
                disabled={disabled}
                className="inline-flex items-center justify-center px-3 py-2 rounded-md 
               hover:bg-muted/60 disabled:opacity-50
               data-[state=on]:bg-black data-[state=on]:text-white"
              >
                <Underline className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={history.length === 0 || disabled}
                aria-label="Undo (Ctrl/Cmd+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={future.length === 0 || disabled}
                aria-label="Redo (Ctrl/Cmd+Y / Ctrl/Cmd+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </ButtonGroup>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
            >
              Clear
            </Button>
          </div>

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
                  // keydown,
                };
              }
            }}
            contentEditable={!disabled}
            className={cn(
              "min-h-[200px] w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-ring",
              error && "border-destructive focus:ring-destructive",
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
              className="absolute pointer-events-none text-muted-foreground"
              style={{
                top: "4.75rem",
                left: "1.75rem",
              }}
            >
              {placeholder}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

TextEditor.displayName = "TextEditor";

export default TextEditor;
