import html2canvas from "html2canvas"
import JSZip from "jszip"
import FileSaver from "file-saver"
import type { Slide, SlideSize } from "@/lib/types"

// 创建PPT的XML内容
function createPresentationXml(slideCount: number, width: number, height: number) {
  // 将像素转换为EMU (English Metric Units)，Office使用的单位
  // 1英寸 = 914400 EMU，1像素约等于9525 EMU (假设96 DPI)
  const widthEmu = Math.round(width * 9525)
  const heightEmu = Math.round(height * 9525)

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">
<p:sldMasterIdLst>
  <p:sldMasterId id="2147483648" r:id="rId1"/>
</p:sldMasterIdLst>
<p:sldIdLst>
  ${Array.from({ length: slideCount }, (_, i) => `<p:sldId id="${256 + i}" r:id="rId${3 + i}"/>`).join("\n    ")}
</p:sldIdLst>
<p:sldSz cx="${widthEmu}" cy="${heightEmu}" type="custom"/>
<p:notesSz cx="6858000" cy="9144000"/>
<p:defaultTextStyle>
  <a:defPPr>
    <a:defRPr lang="en-US"/>
  </a:defPPr>
  <a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
    <a:defRPr sz="1800" kern="1200">
      <a:solidFill>
        <a:schemeClr val="tx1"/>
      </a:solidFill>
      <a:latin typeface="+mn-lt"/>
      <a:ea typeface="+mn-ea"/>
      <a:cs typeface="+mn-cs"/>
    </a:defRPr>
  </a:lvl1pPr>
</p:defaultTextStyle>
</p:presentation>`
}

// 创建内容类型XML
function createContentTypesXml(slideCount: number) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="jpeg" ContentType="image/jpeg"/>
<Default Extension="png" ContentType="image/png"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
${Array.from({ length: slideCount }, (_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("\n  ")}
</Types>`
}

// 创建关系XML
function createRelationshipsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
}

// 创建演示文稿关系XML
function createPresentationRelsXml(slideCount: number) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
${Array.from({ length: slideCount }, (_, i) => `<Relationship Id="rId${3 + i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join("\n  ")}
</Relationships>`
}

// 创建幻灯片XML
function createSlideXml(imageRelId: string, width: number, height: number) {
  // 将像素转换为EMU
  const widthEmu = Math.round(width * 9525)
  const heightEmu = Math.round(height * 9525)

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<p:cSld>
  <p:spTree>
    <p:nvGrpSpPr>
      <p:cNvPr id="1" name=""/>
      <p:cNvGrpSpPr/>
      <p:nvPr/>
    </p:nvGrpSpPr>
    <p:grpSpPr>
      <a:xfrm>
        <a:off x="0" y="0"/>
        <a:ext cx="0" cy="0"/>
        <a:chOff x="0" y="0"/>
        <a:chExt cx="0" cy="0"/>
      </a:xfrm>
    </p:grpSpPr>
    <p:pic>
      <p:nvPicPr>
        <p:cNvPr id="2" name="Slide Image"/>
        <p:cNvPicPr>
          <a:picLocks noChangeAspect="1"/>
        </p:cNvPicPr>
        <p:nvPr/>
      </p:nvPicPr>
      <p:blipFill>
        <a:blip r:embed="${imageRelId}"/>
        <a:stretch>
          <a:fillRect/>
        </a:stretch>
      </p:blipFill>
      <p:spPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="${widthEmu}" cy="${heightEmu}"/>
        </a:xfrm>
        <a:prstGeom prst="rect">
          <a:avLst/>
        </a:prstGeom>
      </p:spPr>
    </p:pic>
  </p:spTree>
</p:cSld>
<p:clrMapOvr>
  <a:masterClrMapping/>
</p:clrMapOvr>
</p:sld>`
}

// 创建幻灯片关系XML
function createSlideRelsXml(imageRelId: string, imageIndex: number) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="${imageRelId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${imageIndex}.png"/>
</Relationships>`
}

// 创建幻灯片母版XML
function createSlideMasterXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<p:cSld>
  <p:bg>
    <p:bgRef idx="1001">
      <a:schemeClr val="bg1"/>
    </p:bgRef>
  </p:bg>
  <p:spTree>
    <p:nvGrpSpPr>
      <p:cNvPr id="1" name=""/>
      <p:cNvGrpSpPr/>
      <p:nvPr/>
    </p:nvGrpSpPr>
    <p:grpSpPr>
      <a:xfrm>
        <a:off x="0" y="0"/>
        <a:ext cx="0" cy="0"/>
        <a:chOff x="0" y="0"/>
        <a:chExt cx="0" cy="0"/>
      </a:xfrm>
    </p:grpSpPr>
  </p:spTree>
</p:cSld>
<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
<p:sldLayoutIdLst>
  <p:sldLayoutId id="2147483649" r:id="rId1"/>
</p:sldLayoutIdLst>
</p:sldMaster>`
}

// 创建幻灯片母版关系XML
function createSlideMasterRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`
}

// 创建幻灯片布局XML
function createSlideLayoutXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" type="blank" preserve="1">
<p:cSld name="Blank">
  <p:spTree>
    <p:nvGrpSpPr>
      <p:cNvPr id="1" name=""/>
      <p:cNvGrpSpPr/>
      <p:nvPr/>
    </p:nvGrpSpPr>
    <p:grpSpPr/>
  </p:spTree>
</p:cSld>
<p:clrMapOvr>
  <a:masterClrMapping/>
</p:clrMapOvr>
</p:sldLayout>`
}

// 创建幻灯片布局关系XML
function createSlideLayoutRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`
}

// 创建主题XML
function createThemeXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
<a:themeElements>
  <a:clrScheme name="Office">
    <a:dk1>
      <a:sysClr val="windowText" lastClr="000000"/>
    </a:dk1>
    <a:lt1>
      <a:sysClr val="window" lastClr="FFFFFF"/>
    </a:lt1>
    <a:dk2>
      <a:srgbClr val="1F497D"/>
    </a:dk2>
    <a:lt2>
      <a:srgbClr val="EEECE1"/>
    </a:lt2>
    <a:accent1>
      <a:srgbClr val="4F81BD"/>
    </a:accent1>
    <a:accent2>
      <a:srgbClr val="C0504D"/>
    </a:accent2>
    <a:accent3>
      <a:srgbClr val="9BBB59"/>
    </a:accent3>
    <a:accent4>
      <a:srgbClr val="8064A2"/>
    </a:accent4>
    <a:accent5>
      <a:srgbClr val="4BACC6"/>
    </a:accent5>
    <a:accent6>
      <a:srgbClr val="F79646"/>
    </a:accent6>
    <a:hlink>
      <a:srgbClr val="0000FF"/>
    </a:hlink>
    <a:folHlink>
      <a:srgbClr val="800080"/>
    </a:folHlink>
  </a:clrScheme>
  <a:fontScheme name="Office">
    <a:majorFont>
      <a:latin typeface="Calibri"/>
      <a:ea typeface=""/>
      <a:cs typeface=""/>
    </a:majorFont>
    <a:minorFont>
      <a:latin typeface="Calibri"/>
      <a:ea typeface=""/>
      <a:cs typeface=""/>
    </a:minorFont>
  </a:fontScheme>
  <a:fmtScheme name="Office">
    <a:fillStyleLst>
      <a:solidFill>
        <a:schemeClr val="phClr"/>
      </a:solidFill>
      <a:gradFill rotWithShape="1">
        <a:gsLst>
          <a:gs pos="0">
            <a:schemeClr val="phClr">
              <a:tint val="50000"/>
              <a:satMod val="300000"/>
            </a:schemeClr>
          </a:gs>
          <a:gs pos="35000">
            <a:schemeClr val="phClr">
              <a:tint val="37000"/>
              <a:satMod val="300000"/>
            </a:schemeClr>
          </a:gs>
          <a:gs pos="100000">
            <a:schemeClr val="phClr">
              <a:tint val="15000"/>
              <a:satMod val="350000"/>
            </a:schemeClr>
          </a:gs>
        </a:gsLst>
        <a:lin ang="16200000" scaled="1"/>
      </a:gradFill>
    </a:fillStyleLst>
    <a:lnStyleLst>
      <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
        <a:solidFill>
          <a:schemeClr val="phClr">
            <a:shade val="95000"/>
            <a:satMod val="105000"/>
          </a:schemeClr>
        </a:solidFill>
        <a:prstDash val="solid"/>
      </a:ln>
    </a:lnStyleLst>
    <a:effectStyleLst>
      <a:effectStyle>
        <a:effectLst>
          <a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0">
            <a:srgbClr val="000000">
              <a:alpha val="38000"/>
            </a:srgbClr>
          </a:outerShdw>
        </a:effectLst>
      </a:effectStyle>
    </a:effectStyleLst>
    <a:bgFillStyleLst>
      <a:solidFill>
        <a:schemeClr val="phClr"/>
      </a:solidFill>
    </a:bgFillStyleLst>
  </a:fmtScheme>
</a:themeElements>
</a:theme>`
}

// 将幻灯片渲染为图片
async function renderSlideToImage(slide: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(slide, {
    scale: 2, // 提高导出质量
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  })

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob as Blob)
    }, "image/png")
  })
}

// 导出PPT
export async function exportToPPT(slides: Slide[], slideSize: SlideSize, title = "Presentation") {
  try {
    // 创建一个临时容器来渲染幻灯片
    const container = document.createElement("div")
    container.style.position = "absolute"
    container.style.left = "-9999px"
    container.style.top = "-9999px"
    document.body.appendChild(container)

    const zip = new JSZip()

    // 创建PPT文件夹结构
    zip.folder("_rels")
    const pptFolder = zip.folder("ppt")
    pptFolder?.folder("_rels")
    pptFolder?.folder("media")
    pptFolder?.folder("slides")
    pptFolder?.folder("slides/_rels")
    pptFolder?.folder("slideMasters")
    pptFolder?.folder("slideMasters/_rels")
    pptFolder?.folder("slideLayouts")
    pptFolder?.folder("slideLayouts/_rels")
    pptFolder?.folder("theme")

    // 添加内容类型XML
    zip.file("[Content_Types].xml", createContentTypesXml(slides.length))

    // 添加关系XML
    zip.file("_rels/.rels", createRelationshipsXml())

    // 添加演示文稿XML
    pptFolder?.file("presentation.xml", createPresentationXml(slides.length, slideSize.width, slideSize.height))

    // 添加演示文稿关系XML
    pptFolder?.file("_rels/presentation.xml.rels", createPresentationRelsXml(slides.length))

    // 添加幻灯片母版XML
    pptFolder?.file("slideMasters/slideMaster1.xml", createSlideMasterXml())
    pptFolder?.file("slideMasters/_rels/slideMaster1.xml.rels", createSlideMasterRelsXml())

    // 添加幻灯片布局XML
    pptFolder?.file("slideLayouts/slideLayout1.xml", createSlideLayoutXml())
    pptFolder?.file("slideLayouts/_rels/slideLayout1.xml.rels", createSlideLayoutRelsXml())

    // 添加主题XML
    pptFolder?.file("theme/theme1.xml", createThemeXml())

    // 渲染每个幻灯片并添加到ZIP
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]

      // 创建幻灯片元素
      const slideElement = document.createElement("div")
      slideElement.style.width = `${slideSize.width}px`
      slideElement.style.height = `${slideSize.height}px`
      slideElement.style.position = "relative"
      slideElement.style.background = slide.background.value

      // 添加幻灯片元素
      container.appendChild(slideElement)

      // 渲染幻灯片元素
      slide.elements.forEach((element) => {
        const elementDiv = document.createElement("div")
        elementDiv.style.position = "absolute"
        elementDiv.style.left = `${element.position.x}px`
        elementDiv.style.top = `${element.position.y}px`
        elementDiv.style.width = `${element.size.width}px`
        elementDiv.style.height = `${element.size.height}px`

        if (element.type === "text") {
          elementDiv.style.fontSize = `${element.style.fontSize || 16}px`
          elementDiv.style.fontWeight = element.style.fontWeight || "normal"
          elementDiv.style.fontStyle = element.style.fontStyle || "normal"
          elementDiv.style.textDecoration = element.style.textDecoration || "none"
          elementDiv.style.color = element.style.color || "#000"
          elementDiv.style.textAlign = element.style.textAlign || "left"
          elementDiv.style.lineHeight = element.style.lineHeight ? `${element.style.lineHeight}` : "1.5"
          elementDiv.innerText = element.content
        } else if (element.type === "image") {
          const img = document.createElement("img")
          img.src = element.content
          img.style.width = "100%"
          img.style.height = "100%"
          img.style.objectFit = (element.style.objectFit as any) || "cover"
          img.style.borderRadius = `${element.style.borderRadius || 0}px`
          img.style.opacity = `${element.style.opacity || 1}`
          elementDiv.appendChild(img)
        } else if (element.type === "shape") {
          // 简单渲染形状
          elementDiv.style.backgroundColor = element.style.fill || "#ffffff"
          elementDiv.style.border = `${element.style.strokeWidth || 1}px solid ${element.style.stroke || "#000000"}`
          if (element.content === "circle") {
            elementDiv.style.borderRadius = "50%"
          }
        } else if (element.type === "table" || element.type === "chart" || element.type === "icon") {
          // 这些元素需要更复杂的渲染，这里简化处理
          elementDiv.style.border = "1px solid #ccc"
          elementDiv.style.backgroundColor = "#f9f9f9"
          elementDiv.innerText = `${element.type.toUpperCase()} 元素`
          elementDiv.style.display = "flex"
          elementDiv.style.alignItems = "center"
          elementDiv.style.justifyContent = "center"
        }

        slideElement.appendChild(elementDiv)
      })

      // 将幻灯片渲染为图片
      const imageBlob = await renderSlideToImage(slideElement)

      // 添加图片到ZIP
      pptFolder?.file(`media/image${i + 1}.png`, imageBlob)

      // 添加幻灯片XML
      const imageRelId = `rId1`
      pptFolder?.file(`slides/slide${i + 1}.xml`, createSlideXml(imageRelId, slideSize.width, slideSize.height))

      // 添加幻灯片关系XML
      pptFolder?.file(`slides/_rels/slide${i + 1}.xml.rels`, createSlideRelsXml(imageRelId, i + 1))

      // 清理
      container.removeChild(slideElement)
    }

    // 生成ZIP文件并下载
    const content = await zip.generateAsync({ type: "blob" })
    FileSaver.saveAs(content, `${title}.pptx`)

    // 清理临时容器
    document.body.removeChild(container)

    return true
  } catch (error) {
    console.error("导出PPT时出错:", error)
    return false
  }
}

