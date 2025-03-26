"use client"

import { useState, type ReactNode } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

interface EditorLayoutProps {
  sidebar: ReactNode
  editor: ReactNode
  propertyPanel: ReactNode
  showPropertyPanel: boolean
}

export default function EditorLayout({ sidebar, editor, propertyPanel, showPropertyPanel }: EditorLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* 左侧幻灯片缩略图面板 */}
      <ResizablePanel
        defaultSize={15}
        minSize={10}
        maxSize={25}
        collapsible
        collapsedSize={0}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
        className={cn("bg-background border-r", isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
      >
        {sidebar}
      </ResizablePanel>
      <ResizableHandle withHandle />

      {/* 中间编辑区域 */}
      <ResizablePanel defaultSize={showPropertyPanel ? 60 : 85} minSize={40}>
        <div className="h-full overflow-auto">{editor}</div>
      </ResizablePanel>

      {/* 右侧属性面板 */}
      {showPropertyPanel && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={15} maxSize={40} className="bg-background border-l">
            {propertyPanel}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}

