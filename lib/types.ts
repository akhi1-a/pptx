export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface TextStyle {
  fontSize?: number
  fontWeight?: string
  color?: string
  textAlign?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  borderColor?: string
  borderWidth?: number
  chartType?: string
  title?: string
  size?: number
  rotation?: number
  // 动画相关属性
  animation?: boolean
  animationType?: string
  animationDuration?: number
  animationDelay?: number
  animationLoop?: boolean
  locked?: boolean
}

export interface Element {
  id: string
  type: "text" | "image" | "shape" | "table" | "chart"
  content: string
  position: Position
  size: Size
  style: TextStyle
}

export interface Background {
  type: "color" | "gradient" | "image"
  value: string
}

export interface Slide {
  id: string
  background: Background
  elements: Element[]
}

export interface SlideSize {
  width: number
  height: number
}

export const defaultSlideSize: SlideSize = {
  width: 960,
  height: 540,
}

export const defaultSlides: Slide[] = [
  {
    id: "slide-1",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
    },
    elements: [
      {
        id: "title-1",
        type: "text",
        content: "flowmix多模态产品系列",
        position: { x: 200, y: 200 },
        size: { width: 520, height: 80 },
        style: {
          fontSize: 48,
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "subtitle-1",
        type: "text",
        content: "flowmix/docx 多模态文档引擎",
        position: { x: 280, y: 300 },
        size: { width: 400, height: 40 },
        style: {
          fontSize: 24,
          fontWeight: "normal",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "subtitle-2",
        type: "text",
        content: "灵语智能文档",
        position: { x: 280, y: 320 },
        size: { width: 400, height: 40 },
        style: {
          fontSize: 24,
          fontWeight: "normal",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  {
    id: "slide-2",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
    },
    elements: [
      {
        id: "title-2",
        type: "text",
        content: "目录",
        position: { x: 50, y: 50 },
        size: { width: 200, height: 60 },
        style: {
          fontSize: 36,
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "left",
        },
      },
      {
        id: "content-2",
        type: "text",
        content: "• 产品特点介绍\n• 市场分析\n• 竞争优势\n• 销售策略\n• 未来展望",
        position: { x: 50, y: 130 },
        size: { width: 400, height: 300 },
        style: {
          fontSize: 24,
          fontWeight: "normal",
          color: "#ffffff",
          textAlign: "left",
        },
      },
    ],
  },
  {
    id: "slide-3",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
    },
    elements: [
      {
        id: "title-3",
        type: "text",
        content: "产品特点介绍",
        position: { x: 50, y: 50 },
        size: { width: 400, height: 60 },
        style: {
          fontSize: 36,
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "left",
        },
      },
      {
        id: "content-3",
        type: "text",
        content: "• 创新科技\n• 用户友好界面\n• 高效性能\n• 安全可靠\n• 可扩展性强",
        position: { x: 50, y: 130 },
        size: { width: 400, height: 300 },
        style: {
          fontSize: 24,
          fontWeight: "normal",
          color: "#ffffff",
          textAlign: "left",
        },
      },
      {
        id: "image-3",
        type: "image",
        content: "/placeholder.svg?height=300&width=400",
        position: { x: 500, y: 130 },
        size: { width: 400, height: 300 },
        style: {},
      },
    ],
  },
]

