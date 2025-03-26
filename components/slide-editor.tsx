"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Slide, Element, SlideSize } from "@/lib/types"
import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"
import ElementContextMenu from "@/components/context-menu/element-context-menu"
import { renderAdvancedShape } from "@/components/shapes/advanced-shapes"

interface SlideEditorProps {
  slide: Slide
  onUpdateSlide: (slide: Slide) => void
  selectedElement: Element | null
  onElementSelect: (element: Element | null) => void
  slideSize: SlideSize
  onCopyElement: (element: Element) => void
  onDeleteElement: (element: Element) => void
  onMoveElementForward: (element: Element) => void
  onMoveElementBackward: (element: Element) => void
  onLockToggle: (element: Element) => void
}

export default function SlideEditor({
  slide,
  onUpdateSlide,
  selectedElement,
  onElementSelect,
  slideSize,
  onCopyElement,
  onDeleteElement,
  onMoveElementForward,
  onMoveElementBackward,
  onLockToggle,
}: SlideEditorProps) {
  const [draggingElement, setDraggingElement] = useState<Element | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizing, setResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)

  const handleElementClick = (element: Element, e: React.MouseEvent) => {
    e.stopPropagation()
    if (element.style.locked) return
    onElementSelect(element)
  }

  // 添加右键菜单处理函数
  const handleElementContextMenu = (e: React.MouseEvent) => {
    // 阻止默认浏览器右键菜单
    e.preventDefault()
  }

  const handleEditorClick = () => {
    onElementSelect(null)
  }

  const handleElementMouseDown = (element: Element, e: React.MouseEvent) => {
    e.stopPropagation()

    if (element.style.locked) return
    if ((e.target as HTMLElement).classList.contains("resize-handle")) {
      return
    }

    setDraggingElement(element)

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleResizeMouseDown = (e: React.MouseEvent, element: Element, direction: string) => {
    e.stopPropagation()
    if (element.style.locked) return
    onElementSelect(element)
    setResizing(true)
    setResizeDirection(direction)
    setDraggingElement(element)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!editorRef.current || (!draggingElement && !resizing)) return

    const editorRect = editorRef.current.getBoundingClientRect()

    if (resizing && selectedElement) {
      const newSize = { ...selectedElement.size }
      const newPosition = { ...selectedElement.position }

      if (resizeDirection.includes("e")) {
        newSize.width = Math.max(50, e.clientX - editorRect.left - selectedElement.position.x)
      }

      if (resizeDirection.includes("s")) {
        newSize.height = Math.max(20, e.clientY - editorRect.top - selectedElement.position.y)
      }

      if (resizeDirection.includes("w")) {
        const newWidth = selectedElement.position.x + selectedElement.size.width - (e.clientX - editorRect.left)
        if (newWidth >= 50) {
          newPosition.x = e.clientX - editorRect.left
          newSize.width = newWidth
        }
      }

      if (resizeDirection.includes("n")) {
        const newHeight = selectedElement.position.y + selectedElement.size.height - (e.clientY - editorRect.top)
        if (newHeight >= 20) {
          newPosition.y = e.clientY - editorRect.top
          newSize.height = newHeight
        }
      }

      const updatedElement = {
        ...selectedElement,
        size: newSize,
        position: newPosition,
      }

      const updatedElements = slide.elements.map((el) => (el.id === selectedElement.id ? updatedElement : el))

      onUpdateSlide({
        ...slide,
        elements: updatedElements,
      })

      onElementSelect(updatedElement)
    } else if (draggingElement) {
      const newX = e.clientX - editorRect.left - dragOffset.x
      const newY = e.clientY - editorRect.top - dragOffset.y

      const updatedElement = {
        ...draggingElement,
        position: {
          x: Math.max(0, Math.min(newX, slideSize.width - draggingElement.size.width)),
          y: Math.max(0, Math.min(newY, slideSize.height - draggingElement.size.height)),
        },
      }

      const updatedElements = slide.elements.map((el) => (el.id === draggingElement.id ? updatedElement : el))

      onUpdateSlide({
        ...slide,
        elements: updatedElements,
      })

      if (selectedElement && selectedElement.id === draggingElement.id) {
        onElementSelect(updatedElement)
      }
    }
  }

  const handleMouseUp = () => {
    setDraggingElement(null)
    setResizing(false)
  }

  const handleTextDoubleClick = (element: Element, e: React.MouseEvent) => {
    if (element.type !== "text" || element.style.locked) return

    const input = document.createElement("textarea")
    input.value = element.content
    input.style.position = "absolute"
    input.style.left = `${element.position.x}px`
    input.style.top = `${element.position.y}px`
    input.style.width = `${element.size.width}px`
    input.style.height = `${element.size.height}px`
    input.style.fontSize = `${element.style.fontSize || 16}px`
    input.style.fontWeight = element.style.fontWeight || "normal"
    input.style.fontStyle = element.style.fontStyle || "normal"
    input.style.textDecoration = element.style.textDecoration || "none"
    input.style.color = element.style.color || "#000"
    input.style.textAlign = element.style.textAlign || "left"
    input.style.lineHeight = element.style.lineHeight ? `${element.style.lineHeight}` : "1.5"
    input.style.border = "none"
    input.style.padding = "0"
    input.style.margin = "0"
    input.style.overflow = "hidden"
    input.style.background = "transparent"
    input.style.resize = "none"
    input.style.outline = "2px solid #3b82f6"
    input.style.whiteSpace = "pre-wrap" // 保留换行和空格

    // 设置编辑元素的ID，用于在渲染时隐藏原始元素
    const editingId = element.id
    setEditingElementId(editingId)

    const handleBlur = () => {
      const updatedElement = {
        ...element,
        content: input.value,
      }

      const updatedElements = slide.elements.map((el) => (el.id === element.id ? updatedElement : el))

      onUpdateSlide({
        ...slide,
        elements: updatedElements,
      })

      if (selectedElement && selectedElement.id === element.id) {
        onElementSelect(updatedElement)
      }

      input.remove()
      setEditingElementId(null)
    }

    input.addEventListener("blur", handleBlur)

    editorRef.current?.appendChild(input)
    input.focus()
  }

  // 修改键盘事件处理函数，检查焦点是否在textarea或input内
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElement) return

      // 检查焦点是否在属性面板内的输入元素中
      const activeElement = document.activeElement
      const isInputElement =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.isContentEditable

      if (isInputElement) {
        return // 如果焦点在输入元素中，不处理快捷键
      }

      // 检查是否在编辑文本
      if (editingElementId) return

      // 删除元素 (Delete 或 Backspace)
      if ((e.key === "Delete" || e.key === "Backspace") && !editingElementId) {
        e.preventDefault()
        onDeleteElement(selectedElement)
      }

      // 复制元素 (Ctrl+C 或 Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && !editingElementId) {
        e.preventDefault()
        onCopyElement(selectedElement)
      }

      // 上移一层 (Ctrl+↑ 或 Cmd+↑)
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowUp" && !editingElementId) {
        e.preventDefault()
        onMoveElementForward(selectedElement)
      }

      // 下移一层 (Ctrl+↓ 或 Cmd+↓)
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowDown" && !editingElementId) {
        e.preventDefault()
        onMoveElementBackward(selectedElement)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedElement, editingElementId, onDeleteElement, onCopyElement, onMoveElementForward, onMoveElementBackward])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [draggingElement, resizing, selectedElement, dragOffset, resizeDirection])

  // 修改整个元素的渲染容器，确保正确的定位
  const renderElement = (element: Element) => {
    const isSelected = selectedElement && selectedElement.id === element.id
    const isLocked = element.style.locked || false

    // 修改文本元素的渲染方式，确保ElementContextMenu只包含一个子元素
    // 修改文本元素的渲染，添加调整大小的句柄
    // 修改文本元素的渲染方式，确保ElementContextMenu只包含一个子元素
    // 修改元素渲染，确保动画效果正确应用

    // 修改文本元素的渲染，确保动画效果正确应用
    if (element.type === "text") {
      // 将文本内容中的换行符转换为<br>标签
      const formattedContent = element.content.replace(/\n/g, "<br>")

      // 构建动画样式
      let animationStyle = {}
      if (element.style.animation && element.style.animationType) {
        const duration = element.style.animationDuration || 0.5
        const delay = element.style.animationDelay || 0
        const loop = element.style.animationLoop ? "infinite" : "1"

        switch (element.style.animationType) {
          case "fade":
            animationStyle = {
              animation: `fadeIn ${duration}s ease ${delay}s ${loop}`,
              opacity: 0,
              animationFillMode: "forwards",
            }
            break
          case "slide":
            animationStyle = {
              animation: `slideIn ${duration}s ease ${delay}s ${loop}`,
              transform: "translateY(20px)",
              animationFillMode: "forwards",
            }
            break
          case "scale":
            animationStyle = {
              animation: `scaleIn ${duration}s ease ${delay}s ${loop}`,
              transform: "scale(0.8)",
              animationFillMode: "forwards",
            }
            break
          case "rotate":
            animationStyle = {
              animation: `rotateIn ${duration}s ease ${delay}s ${loop}`,
              transform: "rotate(-10deg)",
              animationFillMode: "forwards",
            }
            break
          case "bounce":
            animationStyle = {
              animation: `bounce ${duration}s ease ${delay}s ${loop}`,
              animationFillMode: "forwards",
            }
            break
        }
      }

      return (
        <ElementContextMenu
          key={element.id}
          element={element}
          onCopy={onCopyElement}
          onDelete={onDeleteElement}
          onMoveForward={onMoveElementForward}
          onMoveBackward={onMoveElementBackward}
          onEdit={() => handleTextDoubleClick(element, {} as React.MouseEvent)}
          onLockToggle={onLockToggle}
        >
          <div
            className="absolute"
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
              position: "relative", // 确保子元素相对于此元素定位
              ...animationStyle,
            }}
          >
            <div
              className={cn(
                "w-full h-full",
                !isLocked && "cursor-move",
                isSelected && "outline outline-2 outline-primary",
                editingElementId === element.id && "opacity-0", // 当元素正在被编辑时隐藏
                isLocked && "select-none pointer-events-none opacity-70",
              )}
              style={{
                fontSize: element.style.fontSize || 16,
                fontWeight: element.style.fontWeight,
                fontStyle: element.style.fontStyle,
                textDecoration: element.style.textDecoration,
                color: element.style.color,
                textAlign: element.style.textAlign as any,
                lineHeight: element.style.lineHeight,
                userSelect: "none",
                whiteSpace: "pre-wrap", // 保留换行和空格
              }}
              onClick={(e) => handleElementClick(element, e)}
              onMouseDown={(e) => handleElementMouseDown(element, e)}
              onDoubleClick={(e) => handleTextDoubleClick(element, e)}
              onContextMenu={handleElementContextMenu}
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
            {isSelected && !isLocked && renderResizeHandles(element)}
          </div>
        </ElementContextMenu>
      )
    }

    // 修改其他元素的渲染，确保调整大小的句柄在正确的位置
    // 修改图片元素的渲染
    if (element.type === "image") {
      return (
        <ElementContextMenu
          key={element.id}
          element={element}
          onCopy={onCopyElement}
          onDelete={onDeleteElement}
          onMoveForward={onMoveElementForward}
          onMoveBackward={onMoveElementBackward}
          onEdit={() => {}}
          onLockToggle={onLockToggle}
        >
          <div className="relative" style={{ position: "absolute", left: element.position.x, top: element.position.y }}>
            <div
              className={cn(
                "w-full h-full",
                !isLocked && "cursor-move",
                isSelected && "outline outline-2 outline-primary",
                isLocked && "select-none pointer-events-none opacity-70",
              )}
              style={{
                width: element.size.width,
                height: element.size.height,
                borderRadius: `${element.style.borderRadius || 0}px`,
                opacity: element.style.opacity,
                overflow: "hidden",
                transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
                transition: element.style.animation ? "all 0.3s ease-in-out" : "none",
              }}
              onClick={(e) => handleElementClick(element, e)}
              onMouseDown={(e) => handleElementMouseDown(element, e)}
              onContextMenu={handleElementContextMenu}
            >
              <img
                src={element.content || "/placeholder.svg"}
                alt="Slide element"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: (element.style.objectFit as any) || "cover",
                  filter: element.style.filter || "none",
                }}
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
            {isSelected && !isLocked && renderResizeHandles(element)}
          </div>
        </ElementContextMenu>
      )
    }

    // 修改形状元素的渲染
    if (element.type === "shape") {
      return (
        <ElementContextMenu
          key={element.id}
          element={element}
          onCopy={onCopyElement}
          onDelete={onDeleteElement}
          onMoveForward={onMoveElementForward}
          onMoveBackward={onMoveElementBackward}
          onEdit={() => {}}
          onLockToggle={onLockToggle}
        >
          <div className="relative" style={{ position: "absolute", left: element.position.x, top: element.position.y }}>
            <div
              className={cn(
                "w-full h-full",
                !isLocked && "cursor-move",
                isSelected && "outline outline-2 outline-primary",
                isLocked && "select-none pointer-events-none opacity-70",
              )}
              style={{
                width: element.size.width,
                height: element.size.height,
                opacity: element.style.opacity,
                transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
                transition: element.style.animation ? "all 0.3s ease-in-out" : "none",
              }}
              onClick={(e) => handleElementClick(element, e)}
              onMouseDown={(e) => handleElementMouseDown(element, e)}
              onContextMenu={handleElementContextMenu}
            >
              {renderShape(element)}
            </div>
            {isSelected && !isLocked && renderResizeHandles(element)}
          </div>
        </ElementContextMenu>
      )
    }

    // 修改表格元素的渲染
    if (element.type === "table") {
      return (
        <ElementContextMenu
          key={element.id}
          element={element}
          onCopy={onCopyElement}
          onDelete={onDeleteElement}
          onMoveForward={onMoveElementForward}
          onMoveBackward={onMoveElementBackward}
          onEdit={() => {}}
          onLockToggle={onLockToggle}
        >
          <div className="relative" style={{ position: "absolute", left: element.position.x, top: element.position.y }}>
            <div
              className={cn(
                "w-full h-full",
                !isLocked && "cursor-move",
                isSelected && "outline outline-2 outline-primary",
                isLocked && "select-none pointer-events-none opacity-70",
              )}
              style={{
                width: element.size.width,
                height: element.size.height,
                transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
                transition: element.style.animation ? "all 0.3s ease-in-out" : "none",
              }}
              onClick={(e) => handleElementClick(element, e)}
              onMouseDown={(e) => handleElementMouseDown(element, e)}
              onContextMenu={handleElementContextMenu}
            >
              {renderTable(element)}
            </div>
            {isSelected && !isLocked && renderResizeHandles(element)}
          </div>
        </ElementContextMenu>
      )
    }

    // 修改图表元素的渲染
    if (element.type === "chart") {
      return (
        <ElementContextMenu
          key={element.id}
          element={element}
          onCopy={onCopyElement}
          onDelete={onDeleteElement}
          onMoveForward={onMoveElementForward}
          onMoveBackward={onMoveElementBackward}
          onEdit={() => {}}
          onLockToggle={onLockToggle}
        >
          <div className="relative" style={{ position: "absolute", left: element.position.x, top: element.position.y }}>
            <div
              className={cn(
                "w-full h-full",
                !isLocked && "cursor-move",
                isSelected && "outline outline-2 outline-primary",
                isLocked && "select-none pointer-events-none opacity-70",
              )}
              style={{
                width: element.size.width,
                height: element.size.height,
                transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
                transition: element.style.animation ? "all 0.3s ease-in-out" : "none",
              }}
              onClick={(e) => handleElementClick(element, e)}
              onMouseDown={(e) => handleElementMouseDown(element, e)}
              onContextMenu={handleElementContextMenu}
            >
              {renderChart(element)}
            </div>
            {isSelected && !isLocked && renderResizeHandles(element)}
          </div>
        </ElementContextMenu>
      )
    }

    // 修改图标元素的渲染
    if (element.type === "icon") {
      return (
        <ElementContextMenu
          key={element.id}
          element={element}
          onCopy={onCopyElement}
          onDelete={onDeleteElement}
          onMoveForward={onMoveElementForward}
          onMoveBackward={onMoveElementBackward}
          onEdit={() => {}}
          onLockToggle={onLockToggle}
        >
          <div className="relative" style={{ position: "absolute", left: element.position.x, top: element.position.y }}>
            <div
              className={cn(
                "w-full h-full",
                !isLocked && "cursor-move",
                isSelected && "outline outline-2 outline-primary",
                isLocked && "select-none pointer-events-none opacity-70",
              )}
              style={{
                width: element.size.width,
                height: element.size.height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: element.style.opacity,
                transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
                transition: element.style.animation ? "all 0.3s ease-in-out" : "none",
              }}
              onClick={(e) => handleElementClick(element, e)}
              onMouseDown={(e) => handleElementMouseDown(element, e)}
              onContextMenu={handleElementContextMenu}
            >
              {renderIcon(element)}
            </div>
            {isSelected && !isLocked && renderResizeHandles(element)}
          </div>
        </ElementContextMenu>
      )
    }

    return null
  }

  // 添加渲染形状的函数
  const renderShape = (element: Element) => {
    const shapeType = element.content
    const fill = element.style.fill || "#ffffff"
    const stroke = element.style.stroke || "#000000"
    const strokeWidth = element.style.strokeWidth || 2

    // 高级形状渲染
    const advancedShapes = ["star", "hexagon", "pentagon", "cloud"]
    if (advancedShapes.includes(shapeType)) {
      return renderAdvancedShape(element)
    }

    if (shapeType === "rectangle") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: fill,
            border: `${strokeWidth}px solid ${stroke}`,
          }}
        />
      )
    }

    if (shapeType === "circle") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: fill,
            border: `${strokeWidth}px solid ${stroke}`,
            borderRadius: "50%",
          }}
        />
      )
    }

    if (shapeType === "triangle") {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="50,0 0,100 100,100" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </svg>
      )
    }

    if (shapeType === "line") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${strokeWidth}px`,
              backgroundColor: stroke,
            }}
          />
        </div>
      )
    }

    if (shapeType === "arrow") {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id={`arrowhead-${element.id}`} markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={stroke} />
            </marker>
          </defs>
          <line
            x1="0"
            y1="50"
            x2="90"
            y2="50"
            stroke={stroke}
            strokeWidth={strokeWidth}
            markerEnd={`url(#arrowhead-${element.id})`}
          />
        </svg>
      )
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: fill,
          border: `${strokeWidth}px solid ${stroke}`,
        }}
      />
    )
  }

  // 添加渲染表格的函数
  const renderTable = (element: Element) => {
    try {
      const tableData = JSON.parse(element.content)
      const borderColor = element.style.borderColor || "#000000"
      const borderWidth = element.style.borderWidth || 1
      const headerBackground = element.style.headerBackground || "#f1f5f9"
      const cellPadding = element.style.cellPadding || 4

      return (
        <table
          style={{
            width: "100%",
            height: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <tbody>
            {tableData.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, colIndex: number) => (
                  <td
                    key={colIndex}
                    style={{
                      border: `${borderWidth}px solid ${borderColor}`,
                      padding: `${cellPadding}px`,
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      backgroundColor: rowIndex === 0 ? headerBackground : "transparent",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    } catch (error) {
      return <div>表格数据错误</div>
    }
  }

  // 添加渲染图表的函数
  const renderChart = (element: Element) => {
    try {
      const chartData = JSON.parse(element.content)
      const chartType = element.style.chartType || "bar"
      const chartColor = element.style.color || "#3b82f6"
      const title = element.style.title || ""
      const showLegend = element.style.showLegend || false
      const showValues = element.style.showValues || false
      const barWidth = element.style.barWidth || 70
      const lineWidth = element.style.lineWidth || 2
      const gridLines = element.style.gridLines || "none"
      const animation = element.style.animation || false
      const colorScheme = element.style.colorScheme || "single"

      // 找出最大值，确保至少为1以避免除以零
      const maxValue = Math.max(...chartData.map((item: any) => Number(item.value) || 0), 1)

      // 生成网格线
      const renderGridLines = () => {
        if (gridLines === "none") return null

        const horizontalLines =
          gridLines === "horizontal" || gridLines === "both" ? (
            <>
              <line x1="20" y1="25%" x2="100%" y2="25%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="20" y1="50%" x2="100%" y2="50%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="20" y1="75%" x2="100%" y2="75%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
            </>
          ) : null

        const verticalLines =
          gridLines === "vertical" || gridLines === "both" ? (
            <>
              {chartData.map((_, index) => {
                const x = 20 + ((index + 0.5) * (100 - 20)) / chartData.length
                return (
                  <line
                    key={index}
                    x1={`${x}%`}
                    y1="0"
                    x2={`${x}%`}
                    y2="100%"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                )
              })}
            </>
          ) : null

        return (
          <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            {horizontalLines}
            {verticalLines}
          </svg>
        )
      }

      // 获取颜色
      const getColor = (index: number) => {
        if (colorScheme === "single") return chartColor

        if (colorScheme === "gradient") {
          // 生成渐变色
          const hue = Number.parseInt(chartColor.slice(1), 16)
          const lightenedColor = `#${Math.min(hue + index * 20, 0xffffff)
            .toString(16)
            .padStart(6, "0")}`
          return lightenedColor
        }

        if (colorScheme === "categorical") {
          // 预定义的分类颜色
          const colors = [
            "#3b82f6",
            "#ef4444",
            "#10b981",
            "#f59e0b",
            "#8b5cf6",
            "#ec4899",
            "#06b6d4",
            "#84cc16",
            "#f97316",
            "#6366f1",
          ]
          return colors[index % colors.length]
        }

        return chartColor
      }

      // 柱状图
      if (chartType === "bar") {
        return (
          <div
            style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box", position: "relative" }}
          >
            {title && <div style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>{title}</div>}

            {renderGridLines()}

            <div
              style={{
                display: "flex",
                height: "calc(100% - 40px)",
                alignItems: "flex-end",
                justifyContent: "space-around",
                position: "relative",
              }}
            >
              {/* 添加Y轴刻度线 */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  paddingBottom: "20px",
                  fontSize: "8px",
                  color: "#666",
                }}
              >
                <div>{maxValue}</div>
                <div>{Math.round(maxValue * 0.75)}</div>
                <div>{Math.round(maxValue * 0.5)}</div>
                <div>{Math.round(maxValue * 0.25)}</div>
                <div>0</div>
              </div>

              {/* 绘制柱状图 */}
              <div
                style={{
                  display: "flex",
                  width: "calc(100% - 20px)",
                  height: "100%",
                  alignItems: "flex-end",
                  marginLeft: "20px",
                }}
              >
                {chartData.map((item: any, index: number) => {
                  // 确保值为正数，并计算高度百分比
                  const value = Math.max(0, Number(item.value) || 0)
                  const heightPercent = (value / maxValue) * 100
                  const color = getColor(index)

                  return (
                    <div
                      key={index}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-end",
                        paddingBottom: "20px", // 为X轴标签留出空间
                      }}
                    >
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: `${heightPercent}%`,
                          backgroundColor: color,
                          position: "relative",
                          minHeight: value > 0 ? "2px" : "0", // 确保有值时至少有一点高度
                          transition: animation ? "height 0.3s ease-in-out" : "none",
                        }}
                      >
                        {showValues && value > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "-20px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.value}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          textAlign: "center",
                          marginTop: "5px",
                          position: "absolute",
                          bottom: 0,
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {showLegend && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  fontSize: "12px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {chartData.map((item: any, index: number) => (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: getColor(index),
                        marginRight: "5px",
                      }}
                    ></div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }

      // 折线图
      if (chartType === "line") {
        const points = chartData
          .map((item: any, index: number) => {
            const x = 20 + (index * (100 - 20)) / (chartData.length - 1)
            const y = 100 - (Math.max(0, Number(item.value) || 0) / maxValue) * 100
            return `${x},${y}`
          })
          .join(" ")

        return (
          <div
            style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box", position: "relative" }}
          >
            {title && <div style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>{title}</div>}

            {renderGridLines()}

            <div style={{ position: "relative", width: "100%", height: "calc(100% - 40px)" }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={points}
                  fill="none"
                  stroke={chartColor}
                  strokeWidth={lineWidth}
                  strokeLinejoin="round"
                  style={{ transition: animation ? "all 0.3s ease-in-out" : "none" }}
                />

                {chartData.map((item: any, index: number) => {
                  const x = 20 + (index * (100 - 20)) / (chartData.length - 1)
                  const y = 100 - (Math.max(0, Number(item.value) || 0) / maxValue) * 100
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="2" fill={chartColor} />
                      {showValues && (
                        <text x={x} y={y - 5} fontSize="8" textAnchor="middle" fill="#666">
                          {item.value}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* X轴标签 */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "20px",
                  right: "0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {chartData.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "10px",
                      textAlign: "center",
                      maxWidth: `${100 / chartData.length}%`,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Y轴刻度 */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  fontSize: "8px",
                  color: "#666",
                }}
              >
                <div>{maxValue}</div>
                <div>{Math.round(maxValue * 0.75)}</div>
                <div>{Math.round(maxValue * 0.5)}</div>
                <div>{Math.round(maxValue * 0.25)}</div>
                <div>0</div>
              </div>
            </div>

            {showLegend && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "2px",
                      backgroundColor: chartColor,
                      marginRight: "5px",
                    }}
                  ></div>
                  <span>数据</span>
                </div>
              </div>
            )}
          </div>
        )
      }

      // 面积图
      if (chartType === "area") {
        const points = chartData
          .map((item: any, index: number) => {
            const x = 20 + (index * (100 - 20)) / (chartData.length - 1)
            const y = 100 - (Math.max(0, Number(item.value) || 0) / maxValue) * 100
            return `${x},${y}`
          })
          .join(" ")

        // 添加底部点以闭合路径
        const areaPoints = `${points} ${20 + ((chartData.length - 1) * (100 - 20)) / (chartData.length - 1)},100 20,100`

        return (
          <div
            style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box", position: "relative" }}
          >
            {title && <div style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>{title}</div>}

            {renderGridLines()}

            <div style={{ position: "relative", width: "100%", height: "calc(100% - 40px)" }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={chartColor} stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                <polygon
                  points={areaPoints}
                  fill="url(#areaGradient)"
                  style={{ transition: animation ? "all 0.3s ease-in-out" : "none" }}
                />

                <polyline
                  points={points}
                  fill="none"
                  stroke={chartColor}
                  strokeWidth={lineWidth}
                  strokeLinejoin="round"
                  style={{ transition: animation ? "all 0.3s ease-in-out" : "none" }}
                />

                {chartData.map((item: any, index: number) => {
                  const x = 20 + (index * (100 - 20)) / (chartData.length - 1)
                  const y = 100 - (Math.max(0, Number(item.value) || 0) / maxValue) * 100
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="2" fill={chartColor} />
                      {showValues && (
                        <text x={x} y={y - 5} fontSize="8" textAnchor="middle" fill="#666">
                          {item.value}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* X轴标签 */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "20px",
                  right: "0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {chartData.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "10px",
                      textAlign: "center",
                      maxWidth: `${100 / chartData.length}%`,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Y轴刻度 */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  fontSize: "8px",
                  color: "#666",
                }}
              >
                <div>{maxValue}</div>
                <div>{Math.round(maxValue * 0.75)}</div>
                <div>{Math.round(maxValue * 0.5)}</div>
                <div>{Math.round(maxValue * 0.25)}</div>
                <div>0</div>
              </div>
            </div>

            {showLegend && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: `linear-gradient(to bottom, ${chartColor}cc, ${chartColor}33)`,
                      marginRight: "5px",
                    }}
                  ></div>
                  <span>数据</span>
                </div>
              </div>
            )}
          </div>
        )
      }

      // 饼图
      if (chartType === "pie") {
        const total = chartData.reduce((sum: number, item: any) => sum + (Number(item.value) || 0), 0) || 1
        let startAngle = 0

        return (
          <div style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box" }}>
            {title && <div style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>{title}</div>}

            <div style={{ position: "relative", width: "100%", height: "calc(100% - 40px)" }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                {chartData.map((item: any, index: number) => {
                  const value = Math.max(0, Number(item.value) || 0)
                  const percentage = value / total
                  const endAngle = startAngle + percentage * 360

                  // 计算SVG路径
                  const startRad = (startAngle * Math.PI) / 180
                  const endRad = (endAngle * Math.PI) / 180
                  const x1 = 50 + 40 * Math.cos(startRad)
                  const y1 = 50 + 40 * Math.sin(startRad)
                  const x2 = 50 + 40 * Math.cos(endRad)
                  const y2 = 50 + 40 * Math.sin(endRad)

                  const largeArcFlag = percentage > 0.5 ? 1 : 0
                  const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                  const color = getColor(index)

                  // 计算标签位置
                  const midAngle = startAngle + (endAngle - startAngle) / 2
                  const midRad = (midAngle * Math.PI) / 180
                  const labelX = 50 + 25 * Math.cos(midRad)
                  const labelY = 50 + 25 * Math.sin(midRad)

                  const result = (
                    <g key={index}>
                      <path
                        d={pathData}
                        fill={color}
                        stroke="#fff"
                        strokeWidth="0.5"
                        style={{ transition: animation ? "all 0.3s ease-in-out" : "none" }}
                      />
                      {showValues && percentage > 0.05 && (
                        <text
                          x={labelX}
                          y={labelY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#fff"
                          fontSize="8"
                          fontWeight="bold"
                        >
                          {Math.round(percentage * 100)}%
                        </text>
                      )}
                    </g>
                  )

                  startAngle = endAngle
                  return result
                })}
              </svg>
            </div>

            {showLegend && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: "10px",
                  fontSize: "12px",
                  gap: "8px",
                }}
              >
                {chartData.map((item: any, index: number) => (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: getColor(index),
                        marginRight: "5px",
                      }}
                    ></div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }

      // 散点图
      if (chartType === "scatter") {
        return (
          <div
            style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box", position: "relative" }}
          >
            {title && <div style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>{title}</div>}

            {renderGridLines()}

            <div style={{ position: "relative", width: "100%", height: "calc(100% - 40px)" }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {chartData.map((item: any, index: number) => {
                  const value = Math.max(0, Number(item.value) || 0)
                  const x = 20 + (index * (100 - 20)) / (chartData.length - 1)
                  const y = 100 - (value / maxValue) * 100
                  const size = Math.max(2, Math.min(8, (value / maxValue) * 8))

                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r={size} fill={getColor(index)} opacity="0.7" />
                      {showValues && (
                        <text x={x} y={y - size - 2} fontSize="8" textAnchor="middle" fill="#666">
                          {item.value}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* X轴标签 */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "20px",
                  right: "0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {chartData.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "10px",
                      textAlign: "center",
                      maxWidth: `${100 / chartData.length}%`,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Y轴刻度 */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  fontSize: "8px",
                  color: "#666",
                }}
              >
                <div>{maxValue}</div>
                <div>{Math.round(maxValue * 0.75)}</div>
                <div>{Math.round(maxValue * 0.5)}</div>
                <div>{Math.round(maxValue * 0.25)}</div>
                <div>0</div>
              </div>
            </div>

            {showLegend && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  fontSize: "12px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {chartData.map((item: any, index: number) => (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: getColor(index),
                        marginRight: "5px",
                      }}
                    ></div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }

      // 雷达图
      if (chartType === "radar") {
        const sides = chartData.length
        const angleStep = (Math.PI * 2) / sides

        // 计算多边形的点
        const getPolygonPoints = (percentage: number) => {
          let points = ""
          for (let i = 0; i < sides; i++) {
            const angle = i * angleStep - Math.PI / 2 // 从顶部开始
            const x = 50 + 40 * percentage * Math.cos(angle)
            const y = 50 + 40 * percentage * Math.sin(angle)
            points += `${x},${y} `
          }
          return points.trim()
        }

        // 计算数据点
        const dataPoints = chartData.map((item: any, i: number) => {
          const value = Math.max(0, Number(item.value) || 0)
          const percentage = value / maxValue
          const angle = i * angleStep - Math.PI / 2 // 从顶部开始
          const x = 50 + 40 * percentage * Math.cos(angle)
          const y = 50 + 40 * percentage * Math.sin(angle)
          return { x, y, value, label: item.label }
        })

        // 连接数据点形成雷达图
        const dataPolygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ")

        return (
          <div style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box" }}>
            {title && <div style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>{title}</div>}

            <div style={{ position: "relative", width: "100%", height: "calc(100% - 40px)" }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                {/* 背景网格 */}
                {[0.25, 0.5, 0.75, 1].map((percentage, i) => (
                  <polygon
                    key={i}
                    points={getPolygonPoints(percentage)}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                    strokeDasharray={i < 3 ? "2" : "0"}
                  />
                ))}

                {/* 轴线 */}
                {chartData.map((_: any, i: number) => {
                  const angle = i * angleStep - Math.PI / 2
                  const x = 50 + 40 * Math.cos(angle)
                  const y = 50 + 40 * Math.sin(angle)
                  return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
                })}

                {/* 数据多边形 */}
                <polygon points={dataPolygonPoints} fill={`${chartColor}33`} stroke={chartColor} strokeWidth="2" />

                {/* 数据点 */}
                {dataPoints.map((point, i) => (
                  <g key={i}>
                    <circle cx={point.x} cy={point.y} r="3" fill={chartColor} />
                    {showValues && (
                      <text x={point.x} y={point.y - 5} fontSize="8" textAnchor="middle" fill="#666">
                        {point.value}
                      </text>
                    )}
                  </g>
                ))}

                {/* 标签 */}
                {chartData.map((item: any, i: number) => {
                  const angle = i * angleStep - Math.PI / 2
                  const labelDistance = 45 // 标签距离中心的距离
                  const x = 50 + labelDistance * Math.cos(angle)
                  const y = 50 + labelDistance * Math.sin(angle)

                  // 根据象限调整文本锚点
                  let textAnchor = "middle"
                  if (angle > -Math.PI / 4 && angle < Math.PI / 4) textAnchor = "start"
                  else if (angle > (Math.PI * 3) / 4 || angle < (-Math.PI * 3) / 4) textAnchor = "end"

                  return (
                    <text
                      key={i}
                      x={x}
                      y={y}
                      fontSize="8"
                      textAnchor={textAnchor}
                      dominantBaseline="middle"
                      fill="#666"
                    >
                      {item.label}
                    </text>
                  )
                })}
              </svg>
            </div>

            {showLegend && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  fontSize: "12px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {chartData.map((item: any, index: number) => (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: getColor(index),
                        marginRight: "5px",
                      }}
                    ></div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }

      return <div>不支持的图表类型</div>
    } catch (error) {
      return <div>图表数据错误</div>
    }
  }

  // 添加渲染图标的函数
  const renderIcon = (element: Element) => {
    const iconName = element.content
    const color = element.style.color || "#000000"
    const size = element.style.size || 24
    const rotation = element.style.rotation || 0

    // @ts-ignore - 动态访问Lucide图标
    const IconComponent = LucideIcons[iconName]

    if (!IconComponent) {
      return <div>图标不存在</div>
    }

    return (
      <div style={{ transform: `rotate(${rotation}deg)` }}>
        <IconComponent color={color} size={size} />
      </div>
    )
  }

  // 添加渲染调整大小手柄的函数
  const renderResizeHandles = (element: Element) => {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="resize-handle absolute w-2 h-2 bg-primary border border-white rounded-full cursor-nw-resize -top-1 -left-1 z-10 pointer-events-auto"
          onMouseDown={(e) => handleResizeMouseDown(e, element, "nw")}
        />
        <div
          className="resize-handle absolute w-2 h-2 bg-primary border border-white rounded-full cursor-n-resize -top-1 left-1/2 -translate-x-1/2 z-10 pointer-events-auto"
          onMouseDown={(e) => handleResizeMouseDown(e, element, "n")}
        />
        <div
          className="resize-handle absolute w-2 h-2 bg-primary border border-white rounded-full cursor-ne-resize -top-1 -right-1 z-10 pointer-events-auto"
          onMouseDown={(e) => handleResizeMouseDown(e, element, "ne")}
        />
        <div
          className="resize-handle absolute w-2 h-2 bg-primary border border-white rounded-full cursor-e-resize top-1/2 -right-1 -translate-y-1/2 z-10 pointer-events-auto"
          onMouseDown={(e) => handleResizeMouseDown(e, element, "e")}
        />
        <div
          className="resize-handle absolute w-2 h-2 bg-primary border border-white rounded-full cursor-se-resize -bottom-1 -right-1 z-10 pointer-events-auto"
          onMouseDown={(e) => handleResizeMouseDown(e, element, "se")}
        />
        <div
          className="resize-handle absolute w-2 h-2 bg-primary border border-white rounded-full cursor-s-resize -bottom-1 left-1/2 -translate-x-1/2 z-10 pointer-events-auto"
          onMouseDown={(e) => handleResizeMouseDown(e, element, "s")}
        />
        <div
          className="resize-handle absolute w-2 h-2 bg-primary border border-white rounded-full cursor-sw-resize -bottom-1 -left-1 z-10 pointer-events-auto"
          onMouseDown={(e) => handleResizeMouseDown(e, element, "sw")}
        />
        <div
          className="resize-handle absolute w-2 h-2 bg-primary border border-white rounded-full cursor-w-resize top-1/2 -left-1 -translate-y-1/2 z-10 pointer-events-auto"
          onMouseDown={(e) => handleResizeMouseDown(e, element, "w")}
        />
      </div>
    )
  }

  return (
    <div
      ref={editorRef}
      className="relative bg-white shadow-lg"
      style={{
        width: slideSize.width,
        height: slideSize.height,
        background: slide.background.value,
      }}
      onClick={handleEditorClick}
    >
      {slide.elements.map(renderElement)}
    </div>
  )
}

