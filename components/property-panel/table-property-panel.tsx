"use client"

import type { Element } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface TablePropertyPanelProps {
  element: Element
  onUpdateElement: (element: Element) => void
}

export default function TablePropertyPanel({ element, onUpdateElement }: TablePropertyPanelProps) {
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
        <Label htmlFor="borderColor">边框颜色</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Input
            id="borderColor"
            type="color"
            value={element.style.borderColor || "#000000"}
            onChange={(e) => updateStyle("borderColor", e.target.value)}
            className="w-10 h-10 p-1"
          />
          <Input
            type="text"
            value={element.style.borderColor || "#000000"}
            onChange={(e) => updateStyle("borderColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="borderWidth">边框宽度</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="borderWidth"
            min={0}
            max={10}
            step={1}
            value={[element.style.borderWidth || 1]}
            onValueChange={(value) => updateStyle("borderWidth", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={element.style.borderWidth || 1}
            onChange={(e) => updateStyle("borderWidth", Number(e.target.value))}
            className="w-16"
            min={0}
            max={10}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="headerBackground">表头背景色</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Input
            id="headerBackground"
            type="color"
            value={element.style.headerBackground || "#f1f5f9"}
            onChange={(e) => updateStyle("headerBackground", e.target.value)}
            className="w-10 h-10 p-1"
          />
          <Input
            type="text"
            value={element.style.headerBackground || "#f1f5f9"}
            onChange={(e) => updateStyle("headerBackground", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cellPadding">单元格内边距</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="cellPadding"
            min={0}
            max={20}
            step={1}
            value={[element.style.cellPadding || 4]}
            onValueChange={(value) => updateStyle("cellPadding", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={element.style.cellPadding || 4}
            onChange={(e) => updateStyle("cellPadding", Number(e.target.value))}
            className="w-16"
            min={0}
            max={20}
          />
        </div>
      </div>
    </div>
  )
}

