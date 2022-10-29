import { isReadonly, readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    // not set
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapper = readonly(original)
    expect(wrapper).not.toBe(original)
    expect(wrapper.foo).toBe(1)
    expect(isReadonly(wrapper)).toBe(true)
  })

  it('warn hten call set', () => {
    // console.warn()
    // mock
    console.warn = jest.fn()
    const user = readonly({ age: 10 })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})