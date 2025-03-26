"use client"

import { useState } from "react"
import type { Slide } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  slides: Slide[]
  currentSlideIndex: number
  onSlideSelect: (index: number) => void
  onAddSlide: () => void
}

export default function Sidebar({ slides, currentSlideIndex, onSlideSelect, onAddSlide }: SidebarProps) {
  const [isEditing, setIsEditing] = useState<number | null>(null)

  const renderSlidePreview = (slide: Slide, index: number) => {
    // Calculate scale to fit the thumbnail
    const scale = 0.2

    return (
      <div
        key={slide.id}
        className={cn(
          "relative border rounded-md overflow-hidden cursor-pointer transition-all mb-3 group",
          index === currentSlideIndex ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50",
        )}
        style={{
          width: 192,
          height: 108,
        }}
        onClick={() => onSlideSelect(index)}
      >
        <div
          className="absolute inset-0"
          style={{
            background: slide.background.value,
          }}
        >
          {slide.elements.map((element) => {
            if (element.type === "text") {
              return (
                <div
                  key={element.id}
                  style={{
                    position: "absolute",
                    left: element.position.x * scale,
                    top: element.position.y * scale,
                    width: element.size.width * scale,
                    height: element.size.height * scale,
                    fontSize: (element.style.fontSize || 16) * scale,
                    fontWeight: element.style.fontWeight,
                    color: element.style.color,
                    textAlign: element.style.textAlign as any,
                    overflow: "hidden",
                  }}
                >
                  {element.content}
                </div>
              )
            }
            if (element.type === "image") {
              return (
                <div
                  key={element.id}
                  style={{
                    position: "absolute",
                    left: element.position.x * scale,
                    top: element.position.y * scale,
                    width: element.size.width * scale,
                    height: element.size.height * scale,
                    backgroundImage: `url(${element.content})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )
            }
            return null
          })}
        </div>
        <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">{index + 1}</div>
      </div>
    )
  }

  return (
    <div className="w-56 border-r bg-background flex flex-col h-full">
      <div className="p-3 border-b">
        <Button onClick={onAddSlide} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          插入页面
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">{slides.map((slide, index) => renderSlidePreview(slide, index))}</div>
    </div>
  )
}

