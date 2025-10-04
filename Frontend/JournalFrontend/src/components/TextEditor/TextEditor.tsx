"use client";

import type React from "react";

import { useRef, useState, useEffect, forwardRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from "lucide-react";
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
    const [active, setActive] = useState<string[]>([]);

    useEffect(() => {
      if (editorRef.current) {
        const currentContent = editorRef.current.innerHTML;
        if (currentContent !== value) {
          editorRef.current.innerHTML = value;
          // Trigger onChange if the content was cleared externally (like form reset)
          if (value === "" && currentContent !== "" && onChange) {
            onChange("");
          }
        }
      }
    }, [value, onChange]);


    
    function applyCommand(command: string) {
      document.execCommand(command, false, "");
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
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

        // Debug logging to help troubleshoot validation issues
        console.log("[v0] Text editor content changed:", {
          htmlContent: content,
          textContent: editorRef.current.textContent?.trim(),
          isEmpty: !content || content.trim() === "" || content === "<br>",
        });
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      handleInput();
    };

    const handleBlur = () => {
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    };

    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (editorRef.current) {
                  editorRef.current.innerHTML = "";
                  if (onChange) onChange("");
                }
                setActive([]);
              }}
              disabled={disabled}
            >
              Clear
            </Button>
          </div>

          <div
            ref={(node) => {
              editorRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            contentEditable={!disabled}
            className={cn(
              "min-h-[200px] w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-ring",
              error && "border-destructive focus:ring-destructive",
              disabled && "opacity-50 cursor-not-allowed bg-muted"
            )}
            onInput={handleInput}
            onBlur={handleBlur}
            onPaste={handlePaste}
            data-placeholder={placeholder}
            style={{
              ...(placeholder &&
                !value && {
                  position: "relative",
                }),
            }}
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
