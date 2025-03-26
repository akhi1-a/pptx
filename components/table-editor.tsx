"use client"

import { useState } from "react"
import type { Element } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, Plus, Minus } from "lucide-react"

interface TableEditorProps {
  onAddTable: (rows: number, cols: number) => void
  selectedElement: Element | null
  onUpdateElement: (element: Element) => void
}

export default function TableEditor({ onAddTable, selectedElement, onUpdateElement }: TableEditorProps) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [activeTab, setActiveTab] = useState("create")

  const isTableSelected = selectedElement?.type === "table"

  const updateTableStyle = (property: string, value: any) => {
    if (!isTableSelected) return

    onUpdateElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    })
  }

  const updateTableData = (rowIndex: number, colIndex: number, value: string) => {
    if (!isTableSelected) return

    const tableData = [...JSON.parse(selectedElement.content)]
    tableData[rowIndex][colIndex] = value

    onUpdateElement({
      ...selectedElement,
      content: JSON.stringify(tableData),
    })
  }

  const renderTableControls = () => {
    if (!isTableSelected) {
      return <div className="text-center text-muted-foreground p-2">请先选择表格元素</div>
    }

    const tableData = JSON.parse(selectedElement.content)

    return (
      <div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="border-color">边框颜色</Label>
            <div className="flex items-center mt-1">
              <Input
                id="border-color"
                type="color"
                value={selectedElement.style.borderColor || "#000000"}
                onChange={(e) => updateTableStyle("borderColor", e.target.value)}
                className="w-10 h-8 p-0 border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="border-width">边框宽度</Label>
            <Input
              id="border-width"
              type="number"
              value={selectedElement.style.borderWidth || 1}
              onChange={(e) => updateTableStyle("borderWidth", Number(e.target.value))}
              min="0"
              max="10"
              className="mt-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {tableData.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: string, colIndex: number) => (
                    <td key={colIndex} className="border p-1">
                      <Input
                        value={cell}
                        onChange={(e) => updateTableData(rowIndex, colIndex, e.target.value)}
                        className="w-full h-8 text-sm"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="create">创建表格</TabsTrigger>
          <TabsTrigger value="edit">编辑表格</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="rows">行数</Label>
              <div className="flex items-center mt-1">
                <Button variant="outline" size="icon" onClick={() => setRows(Math.max(1, rows - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="rows"
                  type="number"
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  min="1"
                  max="20"
                  className="mx-2 w-16 text-center"
                />
                <Button variant="outline" size="icon" onClick={() => setRows(Math.min(20, rows + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="cols">列数</Label>
              <div className="flex items-center mt-1">
                <Button variant="outline" size="icon" onClick={() => setCols(Math.max(1, cols - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="cols"
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  min="1"
                  max="10"
                  className="mx-2 w-16 text-center"
                />
                <Button variant="outline" size="icon" onClick={() => setCols(Math.min(10, cols + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button onClick={() => onAddTable(rows, cols)}>
              <Table className="h-4 w-4 mr-2" />
              插入表格
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="mt-2">
          {renderTableControls()}
        </TabsContent>
      </Tabs>
    </div>
  )
}

