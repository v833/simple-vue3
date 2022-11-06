import { NodeTypes } from './ast'

const enum TagType {
  Start,
  End
}

const openDelimiter = '{{'
const closeDelimiter = '}}'

export function baseParse(content: string) {
  const context = createParseContext(content)

  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any = []

  let node
  const s = context.source
  if (s.startsWith(openDelimiter)) {
    node = parseInterpolation(context)
  } else if (s[0] == '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  } else {
    node = parseText(context)
  }

  nodes.push(node)

  return nodes
}

function parseInterpolation(context) {
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)

  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()

  advanceBy(context, rawContentLength + closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content
    }
  }
}

function parseElement(context) {
  // 1. 解析tag
  const element = parseTag(context, TagType.Start)
  parseTag(context, TagType.End)
  return element
}

function parseText(context) {
  const content = parseTextData(context, context.source.length)

  return {
    type: NodeTypes.TEXT,
    content
  }
}

function parseTextData(context, length) {
  const content = context.source.slice(0, length)

  advanceBy(context, content.length)

  return content
}

function parseTag(context, type: TagType) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]

  // 2. 删除处理完成的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.End) return
  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

function createRoot(children: any[]) {
  return {
    children
  }
}

function createParseContext(content: string) {
  return {
    source: content
  }
}

function advanceBy(context, length: number) {
  context.source = context.source.slice(length)
}
