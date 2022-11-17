import { NodeTypes } from './ast'
import { CREATE_ELEMENT_VNODE, helperMapName, TO_DISPLAY_STRING } from './runtimeHelpers'

export function generate(ast) {
  const context = createCodegenContext()
  const { push } = context

  getFunctionPreamble(ast, context)

  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const signature = args.join(',')
  push(`${functionName}(${signature}){`)

  push('return ')
  genNode(ast.codegenNode, context)
  push('}')

  return {
    code: context.code
  }
}
function genNode(node: any, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    case NodeTypes.ELEMENT:
      genElement(node, context)
      break
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context)
      break
    default:
      break
  }
}

function genCompoundExpression(node, context) {
  const { push } = context
  const { children } = node
  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    if (typeof child === 'string') {
      push(child)
    } else {
      genNode(child, context)
    }
  }
}

function genElement(node, context) {
  const { push, helper } = context
  const { tag, children } = node
  const child = children[0]
  push(`${helper(CREATE_ELEMENT_VNODE)}('${tag}', null, `)
  genNode(child, context)
  // for (let i = 0; i < children.length; i++) {
  //   const child = children[i]
  //   genNode(child, context)
  // }
  push(')')
}

function genText(node, context) {
  const { push } = context
  push(`'${node.content}'`)
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(')')
}

function genExpression(node: any, context: any) {
  const { push } = context
  push(`${node.content}`)
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}`
    }
  }

  return context
}
function getFunctionPreamble(ast, context) {
  const { push } = context
  const VueBinging = 'Vue'
  const helpers = ast.helpers
  const aliasHelper = (s) => `${helperMapName[s]}: _${helperMapName[s]}`
  if (ast.helpers.length > 0) {
    push(`const { ${helpers.map(aliasHelper).join(', ')} } = ${VueBinging}`)
    push('\n')
  }
  push('return ')
}
