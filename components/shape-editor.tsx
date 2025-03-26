"use client"

import { useState } from "react"
import type { Element } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Square, Circle, Triangle, Minus, ArrowRight } from "lucide-react"

interface ShapeEditorProps {
  onAddShape: (type: string) => void
  selectedElement: Element | null
  onUpdateElement: (element: Element) => void
}

export default function ShapeEditor({ onAddShape, selectedElement, onUpdateElement }: ShapeEditorProps) {
  const [activeTab, setActiveTab] = useState("basic")

  const isShapeSelected = selectedElement?.type === "shape"

  const updateShapeStyle = (property: string, value: any) => {
    if (!isShapeSelected) return

    onUpdateElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    })
  }

  const renderShapeControls = () => {
    if (!isShapeSelected) {
      return <div className="text-center text-muted-foreground p-2">请先选择形状元素</div>
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fill-color">填充颜色</Label>
          <div className="flex items-center mt-1">
            <Input
              id="fill-color"
              type="color"
              value={selectedElement.style.fill || "#ffffff"}
              onChange={(e) => updateShapeStyle("fill", e.target.value)}
              className="w-10 h-8 p-0 border"
            />
            <Input
              type="text"
              value={selectedElement.style.fill || "#ffffff"}
              onChange={(e) => updateShapeStyle("fill", e.target.value)}
              className="ml-2 w-24"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="stroke-color">边框颜色</Label>
          <div className="flex items-center mt-1">
            <Input
              id="stroke-color"
              type="color"
              value={selectedElement.style.stroke || "#000000"}
              onChange={(e) => updateShapeStyle("stroke", e.target.value)}
              className="w-10 h-8 p-0 border"
            />
            <Input
              type="text"
              value={selectedElement.style.stroke || "#000000"}
              onChange={(e) => updateShapeStyle("stroke", e.target.value)}
              className="ml-2 w-24"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="stroke-width">边框宽度</Label>
          <Input
            id="stroke-width"
            type="number"
            value={selectedElement.style.strokeWidth || 1}
            onChange={(e) => updateShapeStyle("strokeWidth", Number(e.target.value))}
            min="0"
            max="20"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="opacity">不透明度</Label>
          <Input
            id="opacity"
            type="number"
            value={(selectedElement.style.opacity || 1) * 100}
            onChange={(e) => updateShapeStyle("opacity", Number(e.target.value) / 100)}
            min="0"
            max="100"
            className="mt-1"
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic">基本形状</TabsTrigger>
          <TabsTrigger value="advanced">高级形状</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-2">
          <div className="grid grid-cols-5 gap-2">
            <Button variant="outline" onClick={() => onAddShape("rectangle")}>
              <Square className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => onAddShape("circle")}>
              <Circle className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => onAddShape("triangle")}>
              <Triangle className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => onAddShape("line")}>
              <Minus className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => onAddShape("arrow")}>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-2">
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" onClick={() => onAddShape("star")}>
              星形
            </Button>
            <Button variant="outline" onClick={() => onAddShape("hexagon")}>
              六边形
            </Button>
            <Button variant="outline" onClick={() => onAddShape("pentagon")}>
              五边形
            </Button>
            <Button variant="outline" onClick={() => onAddShape("cloud")}>
              云形
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4">{renderShapeControls()}</div>
    </div>
  )
}

