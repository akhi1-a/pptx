"use client"

import { useState, useEffect, useRef } from "react"
import type { Slide, SlideSize } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface SlidePreviewProps {
  slides: Slide[]
  initialSlide: number
  onExit: () => void
  slideSize: SlideSize
}

export default function SlidePreview({ slides, initialSlide, onExit, slideSize }: SlidePreviewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlide)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onExit()
      } else if (event.key === "ArrowRight") {
        setCurrentSlideIndex((prevIndex) => Math.min(prevIndex + 1, slides.length - 1))
      } else if (event.key === "ArrowLeft") {
        setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0))
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onExit, slides.length])

  const currentSlide = slides[currentSlideIndex]
  const isFirstSlide = currentSlideIndex === 0
  const isLastSlide = currentSlideIndex === slides.length - 1

  const goToPreviousSlide = () => {
    if (!isFirstSlide) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const goToNextSlide = () => {
    if (!isLastSlide) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div
        ref={previewRef}
        className="relative bg-white shadow-lg"
        style={{
          width: slideSize.width,
          height: slideSize.height,
          background: currentSlide.background.value,
        }}
      >
        {currentSlide.elements.map((element) => {
          // 修改预览模式下的元素渲染，添加旋转和动画支持
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
              <div
                key={element.id}
                style={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                  fontSize: element.style.fontSize || 16,
                  fontWeight: element.style.fontWeight,
                  fontStyle: element.style.fontStyle,
                  textDecoration: element.style.textDecoration,
                  color: element.style.color,
                  textAlign: element.style.textAlign as any,
                  lineHeight: element.style.lineHeight,
                  whiteSpace: "pre-wrap", // 保留换行和空格
                  transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
                  ...animationStyle,
                }}
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            )
          }
          if (element.type === "image") {
            return (
              <div
                key={element.id}
                style={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                  overflow: "hidden",
                  borderRadius: `${element.style.borderRadius || 0}px`,
                }}
              >
                <img
                  src={element.content || "/placeholder.svg"}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: (element.style.objectFit as any) || "cover",
                    filter: element.style.filter || "none",
                    opacity: element.style.opacity,
                  }}
                />
              </div>
            )
          }
          if (element.type === "shape") {
            return (
              <div
                key={element.id}
                style={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                  opacity: element.style.opacity,
                }}
              >
                {renderShape(element)}
              </div>
            )
          }
          if (element.type === "table") {
            return (
              <div
                key={element.id}
                style={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                }}
              >
                {renderTable(element)}
              </div>
            )
          }
          if (element.type === "chart") {
            return (
              <div
                key={element.id}
                style={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                }}
              >
                {renderChart(element)}
              </div>
            )
          }
          if (element.type === "icon") {
            return (
              <div
                key={element.id}
                style={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: element.style.opacity,
                }}
              >
                {renderIcon(element)}
              </div>
            )
          }
          return null
        })}
      </div>

      <Button
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        variant="ghost"
        size="icon"
        onClick={onExit}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
        {currentSlideIndex + 1} / {slides.length}
      </div>

      <Button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 flex items-center justify-center"
        variant="ghost"
        size="icon"
        onClick={goToPreviousSlide}
        disabled={isFirstSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 flex items-center justify-center"
        variant="ghost"
        size="icon"
        onClick={goToNextSlide}
        disabled={isLastSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  )
}

// 添加渲染形状的函数
const renderShape = (element: any) => {
  const shapeType = element.content
  const fill = element.style.fill || "#ffffff"
  const stroke = element.style.stroke || "#000000"
  const strokeWidth = element.style.strokeWidth || 2

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

  // 其他形状...
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
const renderTable = (element: any) => {
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

// 添加图标的函数
const renderIcon = (element: any) => {
  // 简化版本，实际应该使用Lucide图标
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: element.style.color || "#000000",
        transform: `rotate(${element.style.rotation || 0}deg)`,
      }}
    >
      {element.content}
    </div>
  )
}

// 添加渲染图表的函数
const renderChart = (element: any) => {
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

    // 找出最大值，确保至少为1以避免除以零
    const maxValue = Math.max(...chartData.map((item: any) => Number(item.value) || 0), 1)

    // 获取颜色
    const getColor = (index: number) => {
      const colorScheme = element.style.colorScheme || "single"

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
            {chartData.map((_: any, index: number) => {
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

    // 柱状图
    if (chartType === "bar") {
      return (
        <div style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box", position: "relative" }}>
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
        <div style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box", position: "relative" }}>
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
        <div style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box", position: "relative" }}>
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

              <polygon points={areaPoints} fill="url(#areaGradient)" />

              <polyline
                points={points}
                fill="none"
                stroke={chartColor}
                strokeWidth={lineWidth}
                strokeLinejoin="round"
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
                    <path d={pathData} fill={color} stroke="#fff" strokeWidth="0.5" />
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
        <div style={{ width: "100%", height: "100%", padding: "10px", boxSizing: "border-box", position: "relative" }}>
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
                  <text key={i} x={x} y={y} fontSize="8" textAnchor={textAnchor} dominantBaseline="middle" fill="#666">
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

