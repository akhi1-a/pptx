"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  initialValue: string
  onChange: (value: string) => void
  style?: React.CSSProperties
}

export default function RichTextEditor({ initialValue, onChange, style }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue
    }
  }, [initialValue])

  const handleChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value)
    handleChange()
    editorRef.current?.focus()
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 border-b flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("bold")}
          className="h-8 px-2 text-muted-foreground"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("italic")}
          className="h-8 px-2 text-muted-foreground"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("underline")}
          className="h-8 px-2 text-muted-foreground"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border my-auto mx-1"></span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyLeft")}
          className="h-8 px-2 text-muted-foreground"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyCenter")}
          className="h-8 px-2 text-muted-foreground"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyRight")}
          className="h-8 px-2 text-muted-foreground"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border my-auto mx-1"></span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertUnorderedList")}
          className="h-8 px-2 text-muted-foreground"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertOrderedList")}
          className="h-8 px-2 text-muted-foreground"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className={cn("min-h-[200px] p-3 focus:outline-none", isFocused && "ring-2 ring-ring ring-offset-1")}
        style={style}
        onInput={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

