"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MoveUp, MoveDown, ArrowUpToLine, ArrowDownToLine } from "lucide-react"
import type { Element, Slide } from "@/lib/types"

interface LayerPropertyPanelProps {
  element: Element
  currentSlide: Slide
  onMoveElementForward?: (element: Element) => void
  onMoveElementBackward?: (element: Element) => void
  onMoveElementToFront?: (element: Element) => void
  onMoveElementToBack?: (element: Element) => void
}

export default function LayerPropertyPanel({
  element,
  currentSlide,
  onMoveElementForward,
  onMoveElementBackward,
  onMoveElementToFront,
  onMoveElementToBack,
}: LayerPropertyPanelProps) {
  const elementIndex = currentSlide.elements.findIndex((el) => el.id === element.id)
  const isTopElement = elementIndex === currentSlide.elements.length - 1
  const isBottomElement = elementIndex === 0
  const isLocked = element.style.locked || false
  const isHidden = element.style.hidden || false

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">层级控制</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveElementToFront?.(element)}
            disabled={isTopElement}
            className="flex items-center justify-center"
          >
            <ArrowUpToLine className="h-4 w-4 mr-2" />
            置于顶层
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveElementToBack?.(element)}
            disabled={isBottomElement}
            className="flex items-center justify-center"
          >
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            置于底层
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveElementForward?.(element)}
            disabled={isTopElement}
            className="flex items-center justify-center"
          >
            <MoveUp className="h-4 w-4 mr-2" />
            上移一层
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveElementBackward?.(element)}
            disabled={isBottomElement}
            className="flex items-center justify-center"
          >
            <MoveDown className="h-4 w-4 mr-2" />
            下移一层
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-2">当前层级信息</h4>
        <div className="text-sm text-muted-foreground">
          <p>
            层级位置: {elementIndex + 1} / {currentSlide.elements.length}
          </p>
          <p>元素类型: {getElementTypeName(element.type)}</p>
          <p>元素ID: {element.id}</p>
        </div>
      </div>
    </div>
  )
}

function getElementTypeName(type: string): string {
  switch (type) {
    case "text":
      return "文本"
    case "image":
      return "图片"
    case "shape":
      return "形状"
    case "table":
      return "表格"
    case "chart":
      return "图表"
    case "icon":
      return "图标"
    default:
      return type
  }
}

