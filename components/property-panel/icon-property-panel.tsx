"use client"

import type { Element } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import * as LucideIcons from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IconPropertyPanelProps {
  element: Element
  onUpdateElement: (element: Element) => void
}

export default function IconPropertyPanel({ element, onUpdateElement }: IconPropertyPanelProps) {
  const updateStyle = (property: string, value: any) => {
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    })
  }

  const updateContent = (value: string) => {
    onUpdateElement({
      ...element,
      content: value,
    })
  }

  // 获取所有Lucide图标
  const iconNames = Object.keys(LucideIcons).filter(
    (key) => typeof LucideIcons[key as keyof typeof LucideIcons] === "function" && key !== "createLucideIcon",
  )

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="color">图标颜色</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Input
            id="color"
            type="color"
            value={element.style.color || "#000000"}
            onChange={(e) => updateStyle("color", e.target.value)}
            className="w-10 h-10 p-1"
          />
          <Input
            type="text"
            value={element.style.color || "#000000"}
            onChange={(e) => updateStyle("color", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="size">图标大小</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="size"
            min={12}
            max={96}
            step={1}
            value={[element.style.size || 24]}
            onValueChange={(value) => updateStyle("size", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={element.style.size || 24}
            onChange={(e) => updateStyle("size", Number(e.target.value))}
            className="w-16"
            min={12}
            max={96}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="rotation">旋转角度</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="rotation"
            min={0}
            max={360}
            step={1}
            value={[element.style.rotation || 0]}
            onValueChange={(value) => updateStyle("rotation", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={element.style.rotation || 0}
            onChange={(e) => updateStyle("rotation", Number(e.target.value))}
            className="w-16"
            min={0}
            max={360}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="opacity">不透明度</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="opacity"
            min={0}
            max={1}
            step={0.01}
            value={[element.style.opacity || 1]}
            onValueChange={(value) => updateStyle("opacity", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={Math.round((element.style.opacity || 1) * 100)}
            onChange={(e) => updateStyle("opacity", Number(e.target.value) / 100)}
            className="w-16"
            min={0}
            max={100}
          />
        </div>
      </div>

      <div>
        <Label>选择图标</Label>
        <ScrollArea className="h-60 mt-1 border rounded-md p-2">
          <div className="grid grid-cols-4 gap-2">
            {iconNames.map((name) => {
              // @ts-ignore - 动态访问Lucide图标
              const IconComponent = LucideIcons[name as keyof typeof LucideIcons]
              return (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center justify-center p-2 h-16",
                    element.content === name && "bg-muted",
                  )}
                  onClick={() => updateContent(name)}
                >
                  <IconComponent className="h-6 w-6 mb-1" />
                  <div className="text-xs truncate w-full text-center">{name}</div>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

