"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush } from "lucide-react"
import type { Background } from "@/lib/types"

interface BackgroundSettingsDialogProps {
  background: Background
  onBackgroundChange: (background: Background) => void
}

export default function BackgroundSettingsDialog({ background, onBackgroundChange }: BackgroundSettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"color" | "gradient" | "image">(background.type)
  const [colorValue, setColorValue] = useState(background.type === "color" ? background.value : "#ffffff")
  const [gradientValue, setGradientValue] = useState(
    background.type === "gradient" ? background.value : "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
  )
  const [imageValue, setImageValue] = useState(
    background.type === "image" ? background.value : "/placeholder.svg?height=540&width=960",
  )
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 当图片URL变化时更新预览
  useEffect(() => {
    if (activeTab === "image") {
      setImagePreview(imageValue)
    }
  }, [imageValue, activeTab])

  const handleSave = () => {
    const newBackground: Background = {
      type: activeTab,
      value: "",
    }

    switch (activeTab) {
      case "color":
        newBackground.value = colorValue
        break
      case "gradient":
        newBackground.value = gradientValue
        break
      case "image":
        // 确保图片URL有效
        newBackground.value = imageValue.trim() ? `url(${imageValue})` : "#ffffff"
        break
    }

    onBackgroundChange(newBackground)
    setOpen(false)
  }

  const predefinedGradients = [
    "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
    "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
    "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
    "linear-gradient(45deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)",
    "linear-gradient(to right, #000000 0%, #434343 100%)",
  ]

  const predefinedImages = [
    "/placeholder.svg?height=540&width=960",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=960&h=540&fit=crop",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=960&h=540&fit=crop",
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=960&h=540&fit=crop",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=960&h=540&fit=crop",
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Paintbrush className="h-4 w-4 mr-2" />
          背景设置
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>幻灯片背景设置</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="color">纯色</TabsTrigger>
            <TabsTrigger value="gradient">渐变</TabsTrigger>
            <TabsTrigger value="image">图片</TabsTrigger>
          </TabsList>

          <TabsContent value="color" className="mt-4 space-y-4">
            <div>
              <Label htmlFor="bg-color">背景颜色</Label>
              <div className="flex items-center mt-1 space-x-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  className="w-10 h-10 p-1"
                />
                <Input
                  type="text"
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[
                "#ffffff",
                "#000000",
                "#f8fafc",
                "#f1f5f9",
                "#e2e8f0",
                "#cbd5e1",
                "#94a3b8",
                "#64748b",
                "#475569",
                "#334155",
              ].map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  className="w-full h-8 p-0"
                  style={{ backgroundColor: color }}
                  onClick={() => setColorValue(color)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gradient" className="mt-4 space-y-4">
            <div>
              <Label htmlFor="bg-gradient">渐变代码</Label>
              <Input
                id="bg-gradient"
                value={gradientValue}
                onChange={(e) => setGradientValue(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {predefinedGradients.map((gradient) => (
                <Button
                  key={gradient}
                  variant="outline"
                  className="w-full h-16 p-0"
                  style={{ background: gradient }}
                  onClick={() => setGradientValue(gradient)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-4 space-y-4">
            <div>
              <Label htmlFor="bg-image">图片URL</Label>
              <Input
                id="bg-image"
                value={imageValue}
                onChange={(e) => setImageValue(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {predefinedImages.map((image) => (
                <Button
                  key={image}
                  variant="outline"
                  className="w-full h-16 p-0 overflow-hidden"
                  onClick={() => setImageValue(image)}
                >
                  <img src={image || "/placeholder.svg"} alt="背景预览" className="w-full h-full object-cover" />
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <div className="border rounded-md overflow-hidden" style={{ height: "100px" }}>
            <div
              className="w-full h-full"
              style={{
                background:
                  activeTab === "color"
                    ? colorValue
                    : activeTab === "gradient"
                      ? gradientValue
                      : `url(${imageValue}) center/cover no-repeat`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">预览</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>应用背景</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

