"use client"

import type { Element } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ShapePropertyPanelProps {
  element: Element
  onUpdateElement: (element: Element) => void
}

export default function ShapePropertyPanel({ element, onUpdateElement }: ShapePropertyPanelProps) {
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

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="shapeType">形状类型</Label>
        <Select value={element.content} onValueChange={updateContent}>
          <SelectTrigger id="shapeType">
            <SelectValue placeholder="选择形状" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangle">矩形</SelectItem>
            <SelectItem value="circle">圆形</SelectItem>
            <SelectItem value="triangle">三角形</SelectItem>
            <SelectItem value="line">线条</SelectItem>
            <SelectItem value="arrow">箭头</SelectItem>
            <SelectItem value="star">星形</SelectItem>
            <SelectItem value="hexagon">六边形</SelectItem>
            <SelectItem value="pentagon">五边形</SelectItem>
            <SelectItem value="cloud">云形</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fill">填充颜色</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Input
            id="fill"
            type="color"
            value={element.style.fill || "#ffffff"}
            onChange={(e) => updateStyle("fill", e.target.value)}
            className="w-10 h-10 p-1"
          />
          <Input
            type="text"
            value={element.style.fill || "#ffffff"}
            onChange={(e) => updateStyle("fill", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="stroke">边框颜色</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Input
            id="stroke"
            type="color"
            value={element.style.stroke || "#000000"}
            onChange={(e) => updateStyle("stroke", e.target.value)}
            className="w-10 h-10 p-1"
          />
          <Input
            type="text"
            value={element.style.stroke || "#000000"}
            onChange={(e) => updateStyle("stroke", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="strokeWidth">边框宽度</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="strokeWidth"
            min={0}
            max={20}
            step={1}
            value={[element.style.strokeWidth || 1]}
            onValueChange={(value) => updateStyle("strokeWidth", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={element.style.strokeWidth || 1}
            onChange={(e) => updateStyle("strokeWidth", Number(e.target.value))}
            className="w-16"
            min={0}
            max={20}
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
    </div>
  )
}

