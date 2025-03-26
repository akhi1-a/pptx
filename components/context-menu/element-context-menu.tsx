"use client"

import type React from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { Element } from "@/lib/types"
import { Copy, Trash, MoveUp, MoveDown, Edit, Lock, Unlock } from "lucide-react"

interface ElementContextMenuProps {
  children: React.ReactNode
  element: Element
  onCopy: (element: Element) => void
  onDelete: (element: Element) => void
  onMoveForward: (element: Element) => void
  onMoveBackward: (element: Element) => void
  onEdit: (element: Element) => void
  onLockToggle: (element: Element) => void
}

export default function ElementContextMenu({
  children,
  element,
  onCopy,
  onDelete,
  onMoveForward,
  onMoveBackward,
  onEdit,
  onLockToggle,
}: ElementContextMenuProps) {
  const isLocked = element.style.locked || false

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => onEdit(element)}>
          <Edit className="mr-2 h-4 w-4" />
          编辑
          {element.type === "text" && <ContextMenuShortcut>双击</ContextMenuShortcut>}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onCopy(element)}>
          <Copy className="mr-2 h-4 w-4" />
          复制
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onMoveForward(element)}>
          <MoveUp className="mr-2 h-4 w-4" />
          上移一层
          <ContextMenuShortcut>⌘↑</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onMoveBackward(element)}>
          <MoveDown className="mr-2 h-4 w-4" />
          下移一层
          <ContextMenuShortcut>⌘↓</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onLockToggle(element)}>
          {isLocked ? (
            <>
              <Unlock className="mr-2 h-4 w-4" />
              解锁元素
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              锁定元素
            </>
          )}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onDelete(element)} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          删除
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

