"use client"

import { useState } from "react"
import type { Element } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, Plus, Minus } from "lucide-react"

interface ChartEditorProps {
  onAddChart: (type: string) => void
  selectedElement: Element | null
  onUpdateElement: (element: Element) => void
}

export default function ChartEditor({ onAddChart, selectedElement, onUpdateElement }: ChartEditorProps) {
  const [activeTab, setActiveTab] = useState("type")

  const isChartSelected = selectedElement?.type === "chart"

  const updateChartData = (index: number, field: string, value: string) => {
    if (!isChartSelected) return

    const chartData = [...JSON.parse(selectedElement.content)]
    chartData[index][field] = field === "value" ? Number(value) : value

    onUpdateElement({
      ...selectedElement,
      content: JSON.stringify(chartData),
    })
  }

  const addDataPoint = () => {
    if (!isChartSelected) return

    const chartData = [...JSON.parse(selectedElement.content)]
    chartData.push({ label: "新数据", value: 0 })

    onUpdateElement({
      ...selectedElement,
      content: JSON.stringify(chartData),
    })
  }

  const removeDataPoint = (index: number) => {
    if (!isChartSelected) return

    const chartData = [...JSON.parse(selectedElement.content)]
    chartData.splice(index, 1)

    onUpdateElement({
      ...selectedElement,
      content: JSON.stringify(chartData),
    })
  }

  const updateChartStyle = (property: string, value: any) => {
    if (!isChartSelected) return

    onUpdateElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    })
  }

  const renderChartControls = () => {
    if (!isChartSelected) {
      return <div className="text-center text-muted-foreground p-2">请先选择图表元素</div>
    }

    const chartData = JSON.parse(selectedElement.content)
    const chartType = selectedElement.style.chartType || "bar"

    return (
      <div>
        <div className="mb-4">
          <Label>图表类型</Label>
          <div className="flex space-x-2 mt-1">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => updateChartStyle("chartType", "bar")}
            >
              <BarChart className="h-4 w-4 mr-2" />
              柱状图
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => updateChartStyle("chartType", "line")}
            >
              <LineChart className="h-4 w-4 mr-2" />
              折线图
            </Button>
            <Button
              variant={chartType === "pie" ? "default" : "outline"}
              size="sm"
              onClick={() => updateChartStyle("chartType", "pie")}
            >
              <PieChart className="h-4 w-4 mr-2" />
              饼图
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center">
            <Label>数据</Label>
            <Button size="sm" variant="outline" onClick={addDataPoint}>
              <Plus className="h-4 w-4 mr-2" />
              添加数据
            </Button>
          </div>

          <div className="space-y-2 mt-2">
            {chartData.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item.label}
                  onChange={(e) => updateChartData(index, "label", e.target.value)}
                  placeholder="标签"
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={item.value}
                  onChange={(e) => updateChartData(index, "value", e.target.value)}
                  placeholder="数值"
                  className="w-24"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDataPoint(index)}
                  disabled={chartData.length <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              value={selectedElement.style.title || ""}
              onChange={(e) => updateChartStyle("title", e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="chart-color">主题颜色</Label>
            <Input
              id="chart-color"
              type="color"
              value={selectedElement.style.color || "#3b82f6"}
              onChange={(e) => updateChartStyle("color", e.target.value)}
              className="mt-1 h-9"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="type">图表类型</TabsTrigger>
          <TabsTrigger value="data">数据编辑</TabsTrigger>
        </TabsList>

        <TabsContent value="type" className="mt-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => onAddChart("bar")}
            >
              <BarChart className="h-8 w-8 mb-2" />
              柱状图
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => onAddChart("line")}
            >
              <LineChart className="h-8 w-8 mb-2" />
              折线图
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => onAddChart("pie")}
            >
              <PieChart className="h-8 w-8 mb-2" />
              饼图
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-2">
          {renderChartControls()}
        </TabsContent>
      </Tabs>
    </div>
  )
}

