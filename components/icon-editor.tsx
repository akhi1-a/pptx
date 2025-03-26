"use client"

import type React from "react"

import type { Element } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertCircle,
  Archive,
  ArrowRight,
  Award,
  Bell,
  Bookmark,
  Calendar,
  Check,
  Clock,
  Cloud,
  Code,
  Coffee,
  Compass,
  CreditCard,
  Database,
  Download,
  File,
  FileText,
  Flag,
  Folder,
  Gift,
  Globe,
  Heart,
  Home,
  Image,
  Info,
  Key,
  Layers,
  Link,
  Mail,
  Map,
  MessageCircle,
  Monitor,
  Moon,
  Music,
  Package,
  Paperclip,
  Phone,
  PieChart,
  Play,
  Plus,
  Printer,
  Search,
  Settings,
  Share,
  ShoppingCart,
  Star,
  Sun,
  Trash,
  Upload,
  User,
  Users,
  Video,
  Wifi,
  Zap,
} from "lucide-react"

interface IconEditorProps {
  onAddIcon: (iconName: string) => void
  selectedElement: Element | null
  onUpdateElement: (element: Element) => void
}

export default function IconEditor({ onAddIcon, selectedElement, onUpdateElement }: IconEditorProps) {
  const isIconSelected = selectedElement?.type === "icon"

  const updateIconStyle = (property: string, value: any) => {
    if (!isIconSelected) return

    onUpdateElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    })
  }

  const renderIconControls = () => {
    if (!isIconSelected) {
      return <div className="text-center text-muted-foreground p-2">请先选择图标元素</div>
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icon-color">图标颜色</Label>
          <div className="flex items-center mt-1">
            <Input
              id="icon-color"
              type="color"
              value={selectedElement.style.color || "#000000"}
              onChange={(e) => updateIconStyle("color", e.target.value)}
              className="w-10 h-8 p-0 border"
            />
            <Input
              type="text"
              value={selectedElement.style.color || "#000000"}
              onChange={(e) => updateIconStyle("color", e.target.value)}
              className="ml-2 w-24"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="icon-size">图标大小</Label>
          <Input
            id="icon-size"
            type="number"
            value={selectedElement.style.size || 24}
            onChange={(e) => updateIconStyle("size", Number(e.target.value))}
            min="12"
            max="96"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="icon-rotation">旋转角度</Label>
          <Input
            id="icon-rotation"
            type="number"
            value={selectedElement.style.rotation || 0}
            onChange={(e) => updateIconStyle("rotation", Number(e.target.value))}
            min="0"
            max="360"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="icon-opacity">不透明度</Label>
          <Input
            id="icon-opacity"
            type="number"
            value={(selectedElement.style.opacity || 1) * 100}
            onChange={(e) => updateIconStyle("opacity", Number(e.target.value) / 100)}
            min="0"
            max="100"
            className="mt-1"
          />
        </div>
      </div>
    )
  }

  // 图标映射
  const iconComponents: Record<string, React.ReactNode> = {
    Activity: <Activity />,
    AlertCircle: <AlertCircle />,
    Archive: <Archive />,
    ArrowRight: <ArrowRight />,
    Award: <Award />,
    Bell: <Bell />,
    Bookmark: <Bookmark />,
    Calendar: <Calendar />,
    Check: <Check />,
    Clock: <Clock />,
    Cloud: <Cloud />,
    Code: <Code />,
    Coffee: <Coffee />,
    Compass: <Compass />,
    CreditCard: <CreditCard />,
    Database: <Database />,
    Download: <Download />,
    File: <File />,
    FileText: <FileText />,
    Flag: <Flag />,
    Folder: <Folder />,
    Gift: <Gift />,
    Globe: <Globe />,
    Heart: <Heart />,
    Home: <Home />,
    Image: <Image />,
    Info: <Info />,
    Key: <Key />,
    Layers: <Layers />,
    Link: <Link />,
    Mail: <Mail />,
    Map: <Map />,
    MessageCircle: <MessageCircle />,
    Monitor: <Monitor />,
    Moon: <Moon />,
    Music: <Music />,
    Package: <Package />,
    Paperclip: <Paperclip />,
    Phone: <Phone />,
    PieChart: <PieChart />,
    Play: <Play />,
    Plus: <Plus />,
    Printer: <Printer />,
    Search: <Search />,
    Settings: <Settings />,
    Share: <Share />,
    ShoppingCart: <ShoppingCart />,
    Star: <Star />,
    Sun: <Sun />,
    Trash: <Trash />,
    Upload: <Upload />,
    User: <User />,
    Users: <Users />,
    Video: <Video />,
    Wifi: <Wifi />,
    Zap: <Zap />,
  }

  return (
    <div>
      <Tabs defaultValue="icons">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="icons">选择图标</TabsTrigger>
          <TabsTrigger value="style">样式设置</TabsTrigger>
        </TabsList>

        <TabsContent value="icons" className="mt-2">
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(iconComponents).map(([name, icon]) => (
              <Button
                key={name}
                variant="outline"
                className="flex flex-col items-center justify-center p-2 h-16"
                onClick={() => onAddIcon(name)}
              >
                <div className="mb-1">{icon}</div>
                <div className="text-xs truncate w-full text-center">{name}</div>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="style" className="mt-2">
          {renderIconControls()}
        </TabsContent>
      </Tabs>
    </div>
  )
}

