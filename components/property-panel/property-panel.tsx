"use client"

import { useState } from "react"
import type { Element, Slide } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import TextPropertyPanel from "./text-property-panel"
import ShapePropertyPanel from "./shape-property-panel"
import TablePropertyPanel from "./table-property-panel"
import ChartPropertyPanel from "./chart-property-panel"
import ImagePropertyPanel from "./image-property-panel"
import IconPropertyPanel from "./icon-property-panel"
import LayerPropertyPanel from "./layer-property-panel"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import TransformPropertyPanel from "./transform-property-panel"

interface PropertyPanelProps {
  selectedElement: Element | null
  onUpdateElement: (element: Element) => void
  onClose: () => void
  currentSlide?: Slide
  onMoveElementForward?: (element: Element) => void
  onMoveElementBackward?: (element: Element) => void
  onMoveElementToFront?: (element: Element) => void
  onMoveElementToBack?: (element: Element) => void
}

export default function PropertyPanel({
  selectedElement,
  onUpdateElement,
  onClose,
  currentSlide,
  onMoveElementForward,
  onMoveElementBackward,
  onMoveElementToFront,
  onMoveElementToBack,
}: PropertyPanelProps) {
  const [activeTab, setActiveTab] = useState("style")

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium">属性面板</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">请选择一个元素以编辑其属性</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium">
          {selectedElement.type === "text" && "文本属性"}
          {selectedElement.type === "shape" && "形状属性"}
          {selectedElement.type === "table" && "表格属性"}
          {selectedElement.type === "chart" && "图表属性"}
          {selectedElement.type === "image" && "图片属性"}
          {selectedElement.type === "icon" && "图标属性"}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 mx-4 mt-2">
          <TabsTrigger value="style">样式</TabsTrigger>
          <TabsTrigger value="data">数据</TabsTrigger>
          <TabsTrigger value="transform">变换</TabsTrigger>
          <TabsTrigger value="layer">层级</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 h-[calc(100vh-150px)]">
          <div className="p-4">
            <TabsContent value="style" className="mt-0">
              {selectedElement.type === "text" && (
                <TextPropertyPanel element={selectedElement} onUpdateElement={onUpdateElement} />
              )}
              {selectedElement.type === "shape" && (
                <ShapePropertyPanel element={selectedElement} onUpdateElement={onUpdateElement} />
              )}
              {selectedElement.type === "table" && (
                <TablePropertyPanel element={selectedElement} onUpdateElement={onUpdateElement} />
              )}
              {selectedElement.type === "chart" && (
                <ChartPropertyPanel element={selectedElement} onUpdateElement={onUpdateElement} />
              )}
              {selectedElement.type === "image" && (
                <ImagePropertyPanel element={selectedElement} onUpdateElement={onUpdateElement} />
              )}
              {selectedElement.type === "icon" && (
                <IconPropertyPanel element={selectedElement} onUpdateElement={onUpdateElement} />
              )}
            </TabsContent>

            <TabsContent value="data" className="mt-0">
              {selectedElement.type === "text" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">文本内容</h4>
                  <textarea
                    value={selectedElement.content}
                    onChange={(e) =>
                      onUpdateElement({
                        ...selectedElement,
                        content: e.target.value,
                      })
                    }
                    className="w-full min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                    style={{
                      fontSize: selectedElement.style.fontSize ? `${selectedElement.style.fontSize}px` : "16px",
                      fontWeight: selectedElement.style.fontWeight,
                      color: "#000000", // 确保文本始终是黑色
                      textAlign: selectedElement.style.textAlign as any,
                      whiteSpace: "pre-wrap", // 保留换行和空格
                    }}
                  />
                </div>
              )}

              {selectedElement.type === "table" && (
                <TableDataEditor element={selectedElement} onUpdateElement={onUpdateElement} />
              )}

              {selectedElement.type === "chart" && (
                <ChartDataEditor element={selectedElement} onUpdateElement={onUpdateElement} />
              )}
            </TabsContent>

            <TabsContent value="transform" className="mt-0">
              <TransformPropertyPanel element={selectedElement} onUpdateElement={onUpdateElement} />
            </TabsContent>

            <TabsContent value="layer" className="mt-0">
              {currentSlide && (
                <LayerPropertyPanel
                  element={selectedElement}
                  currentSlide={currentSlide}
                  onMoveElementForward={onMoveElementForward}
                  onMoveElementBackward={onMoveElementBackward}
                  onMoveElementToFront={onMoveElementToFront}
                  onMoveElementToBack={onMoveElementToBack}
                />
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

function TableDataEditor({
  element,
  onUpdateElement,
}: { element: Element; onUpdateElement: (element: Element) => void }) {
  try {
    const tableData = JSON.parse(element.content)

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
      const newData = [...tableData]
      newData[rowIndex][colIndex] = value

      onUpdateElement({
        ...element,
        content: JSON.stringify(newData),
      })
    }

    const addRow = () => {
      const newData = [...tableData]
      const newRow = Array(newData[0].length).fill("")
      newData.push(newRow)

      onUpdateElement({
        ...element,
        content: JSON.stringify(newData),
      })
    }

    const removeRow = (rowIndex: number) => {
      if (tableData.length <= 1) return

      const newData = [...tableData]
      newData.splice(rowIndex, 1)

      onUpdateElement({
        ...element,
        content: JSON.stringify(newData),
      })
    }

    const addColumn = () => {
      const newData = tableData.map((row: string[]) => [...row, ""])

      onUpdateElement({
        ...element,
        content: JSON.stringify(newData),
      })
    }

    const removeColumn = (colIndex: number) => {
      if (tableData[0].length <= 1) return

      const newData = tableData.map((row: string[]) => {
        const newRow = [...row]
        newRow.splice(colIndex, 1)
        return newRow
      })

      onUpdateElement({
        ...element,
        content: JSON.stringify(newData),
      })
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium">表格数据</h4>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={addRow}>
              添加行
            </Button>
            <Button variant="outline" size="sm" onClick={addColumn}>
              添加列
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {tableData.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: string, colIndex: number) => (
                    <td key={colIndex} className="border p-1">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        className="w-full border-none p-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                  ))}
                  <td className="p-1 w-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(rowIndex)}
                      disabled={tableData.length <= 1}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                {tableData[0].map((_, colIndex: number) => (
                  <td key={colIndex} className="p-1 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColumn(colIndex)}
                      disabled={tableData[0].length <= 1}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  } catch (error) {
    return <div>表格数据错误</div>
  }
}

function ChartDataEditor({
  element,
  onUpdateElement,
}: { element: Element; onUpdateElement: (element: Element) => void }) {
  try {
    const chartData = JSON.parse(element.content)

    const updateItem = (index: number, field: string, value: any) => {
      const newData = [...chartData]
      newData[index] = { ...newData[index], [field]: field === "value" ? Number(value) : value }

      onUpdateElement({
        ...element,
        content: JSON.stringify(newData),
      })
    }

    const addItem = () => {
      const newData = [...chartData, { label: "新数据", value: 0 }]

      onUpdateElement({
        ...element,
        content: JSON.stringify(newData),
      })
    }

    const removeItem = (index: number) => {
      if (chartData.length <= 1) return

      const newData = [...chartData]
      newData.splice(index, 1)

      onUpdateElement({
        ...element,
        content: JSON.stringify(newData),
      })
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium">图表数据</h4>
          <Button variant="outline" size="sm" onClick={addItem}>
            添加数据
          </Button>
        </div>

        <div className="space-y-2">
          {chartData.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(index, "label", e.target.value)}
                placeholder="标签"
                className="flex-1 p-2 border rounded-md"
              />
              <input
                type="number"
                value={item.value}
                onChange={(e) => updateItem(index, "value", e.target.value)}
                placeholder="数值"
                className="w-24 p-2 border rounded-md"
              />
              <Button variant="ghost" size="icon" onClick={() => removeItem(index)} disabled={chartData.length <= 1}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    return <div>图表数据错误</div>
  }
}

