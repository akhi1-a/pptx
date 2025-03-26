"use client"

import type { Element } from "@/lib/types"

interface ShapeProps {
  element: Element
}

export function StarShape({ element }: ShapeProps) {
  const fill = element.style.fill || "#ffffff"
  const stroke = element.style.stroke || "#000000"
  const strokeWidth = element.style.strokeWidth || 2

  // 创建五角星的点
  const createStarPoints = () => {
    const outerRadius = 50
    const innerRadius = 25
    const points = []

    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI * i) / 5
      const x = 50 + radius * Math.sin(angle)
      const y = 50 - radius * Math.cos(angle)
      points.push(`${x},${y}`)
    }

    return points.join(" ")
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points={createStarPoints()} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}

export function HexagonShape({ element }: ShapeProps) {
  const fill = element.style.fill || "#ffffff"
  const stroke = element.style.stroke || "#000000"
  const strokeWidth = element.style.strokeWidth || 2

  // 创建六边形的点
  const createHexagonPoints = () => {
    const radius = 50
    const points = []

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      const x = 50 + radius * Math.cos(angle)
      const y = 50 + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }

    return points.join(" ")
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points={createHexagonPoints()} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}

export function PentagonShape({ element }: ShapeProps) {
  const fill = element.style.fill || "#ffffff"
  const stroke = element.style.stroke || "#000000"
  const strokeWidth = element.style.strokeWidth || 2

  // 创建五边形的点
  const createPentagonPoints = () => {
    const radius = 50
    const points = []

    for (let i = 0; i < 5; i++) {
      const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2
      const x = 50 + radius * Math.cos(angle)
      const y = 50 + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }

    return points.join(" ")
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points={createPentagonPoints()} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}

export function CloudShape({ element }: ShapeProps) {
  const fill = element.style.fill || "#ffffff"
  const stroke = element.style.stroke || "#000000"
  const strokeWidth = element.style.strokeWidth || 2

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        d="M25,60 
           a20,20 0 0,1 0,-40 
           h20 
           a20,20 0 0,1 15,-15 
           a25,25 0 0,1 0,50 
           h-35 
           z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

export function renderAdvancedShape(element: Element) {
  const shapeType = element.content

  if (shapeType === "star") {
    return <StarShape element={element} />
  }

  if (shapeType === "hexagon") {
    return <HexagonShape element={element} />
  }

  if (shapeType === "pentagon") {
    return <PentagonShape element={element} />
  }

  if (shapeType === "cloud") {
    return <CloudShape element={element} />
  }

  return null
}

