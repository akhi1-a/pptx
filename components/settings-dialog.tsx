"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"

interface SettingsDialogProps {
  width: number
  height: number
  onSizeChange: (width: number, height: number) => void
}

export default function SettingsDialog({ width, height, onSizeChange }: SettingsDialogProps) {
  const [newWidth, setNewWidth] = useState(width)
  const [newHeight, setNewHeight] = useState(height)
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    // 确保宽高在合理范围内
    const validWidth = Math.max(320, Math.min(1920, newWidth))
    const validHeight = Math.max(180, Math.min(1080, newHeight))

    onSizeChange(validWidth, validHeight)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>幻灯片设置</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-right">
              宽度
            </Label>
            <Input
              id="width"
              type="number"
              value={newWidth}
              onChange={(e) => setNewWidth(Number(e.target.value))}
              className="col-span-3"
              min="320"
              max="1920"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              高度
            </Label>
            <Input
              id="height"
              type="number"
              value={newHeight}
              onChange={(e) => setNewHeight(Number(e.target.value))}
              className="col-span-3"
              min="180"
              max="1080"
            />
          </div>
          <div className="text-sm text-muted-foreground">推荐尺寸: 960×540 (16:9), 800×600 (4:3)</div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>保存设置</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

