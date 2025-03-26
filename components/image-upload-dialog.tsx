"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Image, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadDialogProps {
  onImageSelect: (imageUrl: string) => void
}

export default function ImageUploadDialog({ onImageSelect }: ImageUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // 检查文件类型
    if (!file.type.match("image.*")) {
      alert("请选择图片文件")
      return
    }

    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setPreview(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    if (preview) {
      onImageSelect(preview)
      setOpen(false)
      setPreview(null)
    }
  }

  const handleCancel = () => {
    setPreview(null)
    setOpen(false)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Image className="h-4 w-4 mr-2" />
          上传图片
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>上传图片</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12",
              "hover:bg-muted/50 transition-colors",
              dragActive && "border-primary bg-muted/50",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">拖放图片到此处，或</p>
            <Button onClick={handleButtonClick} variant="secondary" size="sm">
              选择图片
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto max-h-[300px] object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={() => setPreview(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleConfirm}>确认使用</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

