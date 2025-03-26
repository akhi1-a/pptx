"use client"

import type { Element } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ImagePropertyPanelProps {
  element: Element
  onUpdateElement: (element: Element) => void
}

export default function ImagePropertyPanel({ element, onUpdateElement }: ImagePropertyPanelProps) {
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
        <Label htmlFor="borderRadius">圆角</Label>
        <div className="flex items-center mt-1 space-x-2">
          <Slider
            id="borderRadius"
            min={0}
            max={50}
            step={1}
            value={[element.style.borderRadius || 0]}
            onValueChange={(value) => updateStyle("borderRadius", value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={element.style.borderRadius || 0}
            onChange={(e) => updateStyle("borderRadius", Number(e.target.value))}
            className="w-16"
            min={0}
            max={50}
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
        <Label htmlFor="objectFit">填充方式</Label>
        <Select value={element.style.objectFit || "cover"} onValueChange={(value) => updateStyle("objectFit", value)}>
          <SelectTrigger id="objectFit">
            <SelectValue placeholder="选择填充方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">覆盖 (Cover)</SelectItem>
            <SelectItem value="contain">包含 (Contain)</SelectItem>
            <SelectItem value="fill">填充 (Fill)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="filter">滤镜效果</Label>
        <Select value={element.style.filter || "none"} onValueChange={(value) => updateStyle("filter", value)}>
          <SelectTrigger id="filter">
            <SelectValue placeholder="选择滤镜" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">无</SelectItem>
            <SelectItem value="grayscale(100%)">灰度</SelectItem>
            <SelectItem value="sepia(100%)">复古</SelectItem>
            <SelectItem value="blur(2px)">模糊</SelectItem>
            <SelectItem value="brightness(150%)">明亮</SelectItem>
            <SelectItem value="contrast(200%)">高对比度</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

