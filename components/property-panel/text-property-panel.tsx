"use client"

import type { Element } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextPropertyPanelProps {
  element: Element
  onUpdateElement: (element: Element) => void
}

export default function TextPropertyPanel({ element, onUpdateElement }: TextPropertyPanelProps) {
  const updateStyle = (property: string, value: any) => {
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fontSize">字体大小</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="fontSize"
            min={8}
            max={96}
            step={1}
            value={[element.style.fontSize || 16]}
            onValueChange={(value) => updateStyle("fontSize", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={element.style.fontSize || 16}
            onChange={(e) => updateStyle("fontSize", Number(e.target.value))}
            className="w-16"
            min={8}
            max={96}
          />
        </div>
      </div>

      <div>
        <Label>字体样式</Label>
        <div className="flex mt-1 space-x-1">
          <Button
            variant="outline"
            size="sm"
            className={cn(element.style.fontWeight === "bold" && "bg-muted")}
            onClick={() => updateStyle("fontWeight", element.style.fontWeight === "bold" ? "normal" : "bold")}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(element.style.fontStyle === "italic" && "bg-muted")}
            onClick={() => updateStyle("fontStyle", element.style.fontStyle === "italic" ? "normal" : "italic")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(element.style.textDecoration === "underline" && "bg-muted")}
            onClick={() =>
              updateStyle("textDecoration", element.style.textDecoration === "underline" ? "none" : "underline")
            }
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>对齐方式</Label>
        <div className="flex mt-1 space-x-1">
          <Button
            variant="outline"
            size="sm"
            className={cn(element.style.textAlign === "left" && "bg-muted")}
            onClick={() => updateStyle("textAlign", "left")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(element.style.textAlign === "center" && "bg-muted")}
            onClick={() => updateStyle("textAlign", "center")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(element.style.textAlign === "right" && "bg-muted")}
            onClick={() => updateStyle("textAlign", "right")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="color">文本颜色</Label>
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
        <Label htmlFor="lineHeight">行高</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="lineHeight"
            min={1}
            max={3}
            step={0.1}
            value={[element.style.lineHeight || 1.5]}
            onValueChange={(value) => updateStyle("lineHeight", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={element.style.lineHeight || 1.5}
            onChange={(e) => updateStyle("lineHeight", Number(e.target.value))}
            className="w-16"
            min={1}
            max={3}
            step={0.1}
          />
        </div>
      </div>
    </div>
  )
}

