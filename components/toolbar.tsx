"use client"

import { useState } from "react"
import type { Element } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Square,
  Table,
  BarChart,
  FileSymlink,
  Save,
  Plus,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import TitleEditor from "./title-editor"

interface ToolbarProps {
  selectedElement: Element | null
  onUpdateElement: (element: Element) => void
  onAddShape: (type: string) => void
  onAddTable: (rows: number, cols: number) => void
  onAddChart: (type: string) => void
  onAddIcon: (iconName: string) => void
  onAddText: () => void
  title: string
  onTitleChange: (title: string) => void
}

export default function Toolbar({
  selectedElement,
  onUpdateElement,
  onAddShape,
  onAddTable,
  onAddChart,
  onAddIcon,
  onAddText,
  title,
  onTitleChange,
}: ToolbarProps) {
  const [activeTab, setActiveTab] = useState("text")

  const updateTextStyle = (property: string, value: any) => {
    if (!selectedElement || selectedElement.type !== "text") return

    onUpdateElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    })
  }

  const renderTextControls = () => {
    if (!selectedElement || selectedElement.type !== "text") {
      return null
    }

    return (
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-24">
              {selectedElement.style.fontSize || 16}px
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[12, 14, 16, 20, 24, 32, 40, 48, 56, 64, 72].map((size) => (
              <DropdownMenuItem key={size} onClick={() => updateTextStyle("fontSize", size)}>
                {size}px
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          className={cn(selectedElement.style.fontWeight === "bold" && "bg-muted")}
          onClick={() => updateTextStyle("fontWeight", selectedElement.style.fontWeight === "bold" ? "normal" : "bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <div className="flex border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className={cn(selectedElement.style.textAlign === "left" && "bg-muted")}
            onClick={() => updateTextStyle("textAlign", "left")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(selectedElement.style.textAlign === "center" && "bg-muted")}
            onClick={() => updateTextStyle("textAlign", "center")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(selectedElement.style.textAlign === "right" && "bg-muted")}
            onClick={() => updateTextStyle("textAlign", "right")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <input
          type="color"
          value={selectedElement.style.color || "#000000"}
          onChange={(e) => updateTextStyle("color", e.target.value)}
          className="w-10 h-8 p-0 border"
        />
      </div>
    )
  }

  return (
    <div className="border-b bg-background p-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <TitleEditor title={title} onTitleChange={onTitleChange} />
          <Button variant="ghost" size="sm">
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button size="sm" variant="outline"><a href="https://flowmix.turntip.cn/flow" target={'_blank'}>flowmix/flow多模态工作流</a></Button>
          <Button size="sm" variant="outline"><a href="https://dooring.vip" target={'_blank'}>H5-Dooring可视化搭建</a></Button>
          <Button size="sm"><a href="https://flowmix.turntip.cn" target={'_blank'}>flowmix/docx多模态文档</a></Button>
          <Button size="sm"><a href="https://mindlink.turntip.cn" target={'_blank'}>灵语AI文档</a></Button>
          <Button size="sm"><a href="https://github.com/MrXujiang/pptx" target={'_blank'}>Github</a></Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* 基本元素添加按钮 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              添加元素
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onAddText}>
              <Type className="h-4 w-4 mr-2" />
              文本
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddShape("rectangle")}>
              <Square className="h-4 w-4 mr-2" />
              形状
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddTable(3, 3)}>
              <Table className="h-4 w-4 mr-2" />
              表格
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddChart("bar")}>
              <BarChart className="h-4 w-4 mr-2" />
              图表
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddIcon("Star")}>
              <FileSymlink className="h-4 w-4 mr-2" />
              图标
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 文本编辑控件 */}
        {renderTextControls()}
      </div>
    </div>
  )
}

