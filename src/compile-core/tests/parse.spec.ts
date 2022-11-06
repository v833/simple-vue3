import { NodeTypes } from '../src/ast'
import { baseParse } from '../src/parse'

describe('parse', () => {
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const ast: any = baseParse('{{ message }}')

      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        }
      })
    })
  })

  describe('element', () => {
    test('simple element div', () => {
      const ast: any = baseParse('<div></div>')

      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: []
      })
    })
  })

  describe('text', () => {
    test('simple text', () => {
      const content = 'some text'
      const ast: any = baseParse(content)

      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content
      })
    })
  })
})

test('hello world', () => {
  const ast: any = baseParse('<p>hi, {{ message }}</p>')

  // root
  expect(ast.children[0]).toStrictEqual({
    type: NodeTypes.ELEMENT,
    tag: 'p',
    children: [
      {
        type: NodeTypes.TEXT,
        content: 'hi, '
      },
      {
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        }
      }
    ]
  })
})
test('nested element', () => {
  const ast: any = baseParse('<div><p>hello</p>{{ message }}</div>')

  // root
  expect(ast.children[0]).toStrictEqual({
    type: NodeTypes.ELEMENT,
    tag: 'div',
    children: [
      {
        type: NodeTypes.ELEMENT,
        tag: 'p',
        children: [
          {
            type: NodeTypes.TEXT,
            content: 'hello'
          }
        ]
      },
      {
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        }
      }
    ]
  })
})
test('should throw error when lack end tag', () => {
  expect(() => {
    baseParse('<div><span></div>')
  }).toThrow('缺少结束标签: span')
})
