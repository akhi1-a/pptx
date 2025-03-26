"use client"

import { useState, useEffect, useRef } from "react"
import Sidebar from "@/components/sidebar"
import Toolbar from "@/components/toolbar"
import SlideEditor from "@/components/slide-editor"
import SlidePreview from "@/components/slide-preview"
import SettingsDialog from "@/components/settings-dialog"
import PropertyPanel from "@/components/property-panel/property-panel"
import EditorLayout from "@/components/layout/editor-layout"
import ImageUploadDialog from "@/components/image-upload-dialog"
import ExportDialog from "@/components/export-dialog"
import BackgroundSettingsDialog from "@/components/background-settings-dialog"
import { type Slide, type Element, defaultSlides, defaultSlideSize, type SlideSize, type Background } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Play, PanelRight } from "lucide-react"

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [slideSize, setSlideSize] = useState<SlideSize>(defaultSlideSize)
  const [showPropertyPanel, setShowPropertyPanel] = useState(false)
  const [presentationTitle, setPresentationTitle] = useState("flowmix多模态产品系列")
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const [editorScale, setEditorScale] = useState(1)

  const currentSlide = slides[currentSlideIndex]

  // 确保slideSize变化时立即更新
  useEffect(() => {
    document.documentElement.style.setProperty("--slide-width", `${slideSize.width}px`)
    document.documentElement.style.setProperty("--slide-height", `${slideSize.height}px`)
  }, [slideSize])

  // 监听属性面板变化，调整画布缩放
  useEffect(() => {
    const updateEditorScale = () => {
      if (!editorContainerRef.current) return

      const containerWidth = editorContainerRef.current.clientWidth
      const containerHeight = editorContainerRef.current.clientHeight
      const slideAspectRatio = slideSize.width / slideSize.height

      // 计算水平和垂直方向的缩放比例
      const scaleX = (containerWidth - 80) / slideSize.width
      const scaleY = (containerHeight - 80) / slideSize.height

      // 取较小的缩放比例，确保幻灯片完全可见
      const scale = Math.min(scaleX, scaleY, 1) // 最大缩放为1

      setEditorScale(scale)
    }

    updateEditorScale()

    // 监听窗口大小变化
    window.addEventListener("resize", updateEditorScale)

    // 监听属性面板变化
    const observer = new MutationObserver(updateEditorScale)
    if (editorContainerRef.current) {
      observer.observe(editorContainerRef.current.parentElement as Node, {
        attributes: true,
        childList: true,
        subtree: true,
      })
    }

    return () => {
      window.removeEventListener("resize", updateEditorScale)
      observer.disconnect()
    }
  }, [slideSize, showPropertyPanel, editorContainerRef])

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
      },
      elements: [
        {
          id: `text-${Date.now()}`,
          type: "text",
          content: "新幻灯片",
          position: { x: slideSize.width / 2 - 200, y: slideSize.height / 2 - 40 },
          size: { width: 400, height: 80 },
          style: {
            fontSize: 48,
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
          },
        },
      ],
    }
    setSlides([...slides, newSlide])
    setCurrentSlideIndex(slides.length)
  }

  const updateSlide = (updatedSlide: Slide) => {
    const newSlides = [...slides]
    newSlides[currentSlideIndex] = updatedSlide
    setSlides(newSlides)
  }

  const updateElement = (updatedElement: Element) => {
    if (!selectedElement) return

    const elementIndex = currentSlide.elements.findIndex((el) => el.id === selectedElement.id)

    if (elementIndex === -1) return

    const updatedElements = [...currentSlide.elements]
    updatedElements[elementIndex] = updatedElement

    updateSlide({
      ...currentSlide,
      elements: updatedElements,
    })

    setSelectedElement(updatedElement)
  }

  const handleElementSelect = (element: Element | null) => {
    setSelectedElement(element)
    if (element && !showPropertyPanel) {
      setShowPropertyPanel(true)
    }
  }

  const handleSizeChange = (width: number, height: number) => {
    setSlideSize({ width, height })
  }

  const handleAddShape = (shapeType: string) => {
    const newElement: Element = {
      id: `shape-${Date.now()}`,
      type: "shape",
      content: shapeType,
      position: { x: slideSize.width / 2 - 75, y: slideSize.height / 2 - 75 },
      size: { width: 150, height: 150 },
      style: {
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 2,
        opacity: 1,
      },
    }

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    }

    updateSlide(updatedSlide)
    setSelectedElement(newElement)
    setShowPropertyPanel(true)
  }

  const handleAddTable = (rows: number, cols: number) => {
    // 创建空表格数据
    const tableData = Array(rows)
      .fill(0)
      .map(() =>
        Array(cols)
          .fill("")
          .map(() => "单元格"),
      )

    const newElement: Element = {
      id: `table-${Date.now()}`,
      type: "table",
      content: JSON.stringify(tableData),
      position: { x: slideSize.width / 2 - 200, y: slideSize.height / 2 - 100 },
      size: { width: 400, height: 200 },
      style: {
        borderColor: "#000000",
        borderWidth: 1,
        headerBackground: "#f1f5f9",
        cellPadding: 4,
      },
    }

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    }

    updateSlide(updatedSlide)
    setSelectedElement(newElement)
    setShowPropertyPanel(true)
  }

  const handleAddChart = (chartType: string) => {
    // 创建默认图表数据
    const chartData = [
      { label: "项目1", value: 30 },
      { label: "项目2", value: 50 },
      { label: "项目3", value: 20 },
    ]

    const newElement: Element = {
      id: `chart-${Date.now()}`,
      type: "chart",
      content: JSON.stringify(chartData),
      position: { x: slideSize.width / 2 - 200, y: slideSize.height / 2 - 150 },
      size: { width: 400, height: 300 },
      style: {
        chartType: chartType,
        title: "图表标题",
        color: "#3b82f6",
        showLegend: true,
        showValues: true,
      },
    }

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    }

    updateSlide(updatedSlide)
    setSelectedElement(newElement)
    setShowPropertyPanel(true)
  }

  const handleAddIcon = (iconName: string) => {
    const newElement: Element = {
      id: `icon-${Date.now()}`,
      type: "icon",
      content: iconName,
      position: { x: slideSize.width / 2 - 25, y: slideSize.height / 2 - 25 },
      size: { width: 50, height: 50 },
      style: {
        color: "#000000",
        size: 24,
        rotation: 0,
        opacity: 1,
      },
    }

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    }

    updateSlide(updatedSlide)
    setSelectedElement(newElement)
    setShowPropertyPanel(true)
  }

  const handleAddImage = (imageUrl: string) => {
    const newElement: Element = {
      id: `image-${Date.now()}`,
      type: "image",
      content: imageUrl,
      position: { x: slideSize.width / 2 - 150, y: slideSize.height / 2 - 100 },
      size: { width: 300, height: 200 },
      style: {
        borderRadius: 0,
        opacity: 1,
        objectFit: "cover",
      },
    }

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    }

    updateSlide(updatedSlide)
    setSelectedElement(newElement)
    setShowPropertyPanel(true)
  }

  // 右键菜单功能
  const handleCopyElement = (element: Element) => {
    const newElement: Element = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      },
    }

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    }

    updateSlide(updatedSlide)
    setSelectedElement(newElement)
  }

  const handleDeleteElement = (element: Element) => {
    const updatedElements = currentSlide.elements.filter((el) => el.id !== element.id)

    updateSlide({
      ...currentSlide,
      elements: updatedElements,
    })

    setSelectedElement(null)
  }

  const handleMoveElementForward = (element: Element) => {
    const elementIndex = currentSlide.elements.findIndex((el) => el.id === element.id)
    if (elementIndex === currentSlide.elements.length - 1) return

    const updatedElements = [...currentSlide.elements]
    const temp = updatedElements[elementIndex]
    updatedElements[elementIndex] = updatedElements[elementIndex + 1]
    updatedElements[elementIndex + 1] = temp

    updateSlide({
      ...currentSlide,
      elements: updatedElements,
    })
  }

  const handleMoveElementBackward = (element: Element) => {
    const elementIndex = currentSlide.elements.findIndex((el) => el.id === element.id)
    if (elementIndex === 0) return

    const updatedElements = [...currentSlide.elements]
    const temp = updatedElements[elementIndex]
    updatedElements[elementIndex] = updatedElements[elementIndex - 1]
    updatedElements[elementIndex - 1] = temp

    updateSlide({
      ...currentSlide,
      elements: updatedElements,
    })
  }

  const handleLockToggle = (element: Element) => {
    const updatedElement = {
      ...element,
      style: {
        ...element.style,
        locked: !element.style.locked,
      },
    }

    updateElement(updatedElement)
  }

  const handleAddText = () => {
    const newElement: Element = {
      id: `text-${Date.now()}`,
      type: "text",
      content: "双击编辑文本",
      position: { x: slideSize.width / 2 - 100, y: slideSize.height / 2 - 20 },
      size: { width: 200, height: 40 },
      style: {
        fontSize: 24,
        fontWeight: "normal",
        color: "#000000",
        textAlign: "center",
      },
    }

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    }

    updateSlide(updatedSlide)
    setSelectedElement(newElement)
    setShowPropertyPanel(true)
  }

  const handleBackgroundChange = (background: Background) => {
    // 确保图片背景正确应用
    const updatedBackground = { ...background }

    // 如果是图片类型但值不是以url(开头，则添加url()
    if (background.type === "image" && !background.value.startsWith("url(")) {
      updatedBackground.value = `url(${background.value})`
    }

    updateSlide({
      ...currentSlide,
      background: updatedBackground,
    })
  }

  const handleMoveElementToFront = (element: Element) => {
    const elementIndex = currentSlide.elements.findIndex((el) => el.id === element.id)
    if (elementIndex === currentSlide.elements.length - 1) return

    const updatedElements = [...currentSlide.elements]
    const elementToMove = updatedElements.splice(elementIndex, 1)[0]
    updatedElements.push(elementToMove)

    updateSlide({
      ...currentSlide,
      elements: updatedElements,
    })
  }

  const handleMoveElementToBack = (element: Element) => {
    const elementIndex = currentSlide.elements.findIndex((el) => el.id === element.id)
    if (elementIndex === 0) return

    const updatedElements = [...currentSlide.elements]
    const elementToMove = updatedElements.splice(elementIndex, 1)[0]
    updatedElements.unshift(elementToMove)

    updateSlide({
      ...currentSlide,
      elements: updatedElements,
    })
  }

  return (
    <main className="flex flex-col h-screen bg-background">
      {isPreviewMode ? (
        <SlidePreview
          slides={slides}
          initialSlide={currentSlideIndex}
          onExit={() => setIsPreviewMode(false)}
          slideSize={slideSize}
        />
      ) : (
        <>
          <Toolbar
            selectedElement={selectedElement}
            onUpdateElement={updateElement}
            onAddShape={handleAddShape}
            onAddTable={handleAddTable}
            onAddChart={handleAddChart}
            onAddIcon={handleAddIcon}
            onAddText={handleAddText}
            title={presentationTitle}
            onTitleChange={setPresentationTitle}
          />

          <div className="flex-1 overflow-hidden">
            <EditorLayout
              sidebar={
                <Sidebar
                  slides={slides}
                  currentSlideIndex={currentSlideIndex}
                  onSlideSelect={setCurrentSlideIndex}
                  onAddSlide={addSlide}
                />
              }
              editor={
                <div
                  ref={editorContainerRef}
                  className="flex flex-col items-center justify-center min-h-full p-8 bg-muted/30"
                >
                  <div
                    style={{
                      transform: `scale(${editorScale})`,
                      transformOrigin: "center",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <SlideEditor
                      slide={currentSlide}
                      onUpdateSlide={updateSlide}
                      selectedElement={selectedElement}
                      onElementSelect={handleElementSelect}
                      slideSize={slideSize}
                      onCopyElement={handleCopyElement}
                      onDeleteElement={handleDeleteElement}
                      onMoveElementForward={handleMoveElementForward}
                      onMoveElementBackward={handleMoveElementBackward}
                      onLockToggle={handleLockToggle}
                    />
                  </div>
                </div>
              }
              propertyPanel={
                <PropertyPanel
                  selectedElement={selectedElement}
                  onUpdateElement={updateElement}
                  onClose={() => setShowPropertyPanel(false)}
                  currentSlide={currentSlide}
                  onMoveElementForward={handleMoveElementForward}
                  onMoveElementBackward={handleMoveElementBackward}
                  onMoveElementToFront={handleMoveElementToFront}
                  onMoveElementToBack={handleMoveElementToBack}
                />
              }
              showPropertyPanel={showPropertyPanel}
            />
          </div>

          <div className="flex justify-between items-center p-2 border-t">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                幻灯片 {currentSlideIndex + 1} / {slides.length}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPropertyPanel(!showPropertyPanel)}
                className={showPropertyPanel ? "bg-muted" : ""}
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <SettingsDialog width={slideSize.width} height={slideSize.height} onSizeChange={handleSizeChange} />

              <BackgroundSettingsDialog
                background={currentSlide.background}
                onBackgroundChange={handleBackgroundChange}
              />

              <ImageUploadDialog onImageSelect={handleAddImage} />

              <ExportDialog slides={slides} slideSize={slideSize} title={presentationTitle} />

              <Button size="sm" onClick={() => setIsPreviewMode(true)}>
                <Play className="h-4 w-4 mr-2" />
                演示
              </Button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

