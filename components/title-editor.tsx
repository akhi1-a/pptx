"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface TitleEditorProps {
  title: string
  onTitleChange: (title: string) => void
}

export default function TitleEditor({ title, onTitleChange }: TitleEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    if (editedTitle.trim()) {
      onTitleChange(editedTitle)
    } else {
      setEditedTitle(title)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur()
    } else if (e.key === "Escape") {
      setEditedTitle(title)
      setIsEditing(false)
    }
  }

  return (
    <div className="flex items-center">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="font-medium border-b border-primary bg-transparent outline-none px-1 mr-4"
        />
      ) : (
        <div className="flex items-center">
          <div className="font-medium mr-2" onDoubleClick={handleDoubleClick}>
            {title}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

