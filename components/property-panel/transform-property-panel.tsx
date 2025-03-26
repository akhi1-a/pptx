"use client"

import { useState } from "react"
import type { Element } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCw, Zap } from "lucide-react"

interface TransformPropertyPanelProps {
  element: Element
  onUpdateElement: (element: Element) => void
}

export default function TransformPropertyPanel({ element, onUpdateElement }: TransformPropertyPanelProps) {
  const [animationType, setAnimationType] = useState(element.style.animationType || "none")

  const updateStyle = (property: string, value: any) => {
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    })
  }

  const handleAnimationChange = (value: string) => {
    setAnimationType(value)

    // 更新元素的动画类型
    updateStyle("animationType", value)

    // 如果选择了动画，则启用动画
    if (value !== "none") {
      updateStyle("animation", true)
    } else {
      updateStyle("animation", false)
    }
  }

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center">
            <RotateCw className="h-4 w-4 mr-2" />
            旋转
          </Label>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rotation">旋转角度</Label>
            <span className="text-sm text-muted-foreground">{element.style.rotation || 0}°</span>
          </div>
          <div className="flex items-center space-x-2">
            <Slider
              id="rotation"
              min={0}
              max={360}
              step={1}
              value={[element.style.rotation || 0]}
              onValueChange={(value) => updateStyle("rotation", value[0])}
              className="flex-1"
            />
            <Input
              type="number"
              value={element.style.rotation || 0}
              onChange={(e) => updateStyle("rotation", Number(e.target.value))}
              className="w-16"
              min={0}
              max={360}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            动画
          </Label>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animationType">动画类型</Label>
            <Select value={animationType} onValueChange={handleAnimationChange}>
              <SelectTrigger id="animationType">
                <SelectValue placeholder="选择动画类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无动画</SelectItem>
                <SelectItem value="fade">淡入</SelectItem>
                <SelectItem value="slide">滑入</SelectItem>
                <SelectItem value="scale">缩放</SelectItem>
                <SelectItem value="rotate">旋转</SelectItem>
                <SelectItem value="bounce">弹跳</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {animationType !== "none" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="animationDuration">动画持续时间 (秒)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="animationDuration"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[element.style.animationDuration || 0.5]}
                    onValueChange={(value) => updateStyle("animationDuration", value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={element.style.animationDuration || 0.5}
                    onChange={(e) => updateStyle("animationDuration", Number(e.target.value))}
                    className="w-16"
                    min={0.1}
                    max={5}
                    step={0.1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="animationDelay">动画延迟 (秒)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="animationDelay"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[element.style.animationDelay || 0]}
                    onValueChange={(value) => updateStyle("animationDelay", value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={element.style.animationDelay || 0}
                    onChange={(e) => updateStyle("animationDelay", Number(e.target.value))}
                    className="w-16"
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="animationLoop">循环播放</Label>
                <Switch
                  id="animationLoop"
                  checked={element.style.animationLoop || false}
                  onCheckedChange={(checked) => updateStyle("animationLoop", checked)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

