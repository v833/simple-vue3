# TS学习

## 搭建TS环境

```
1.初始化 npm init -yes 出现package.json
2.安装ts npm i typescript -g 全局安装
3.生成tsconfig.json文件 tsc --init
```

```
解决变量全局命名冲突 添加export {} // 只在当前文件搜索 
```

## tsconfig.json

```
"outDir": "./dist", // 代码生成位置
"rootDir": "./src", 
"target": "es2016" // 编译之后的js版本
"lib": target选定的版本没有时，声明一个库。如es5使用Set
"lib": ["DOM", "ES2020"],
"noImplicitAny": 函数参数指定类型
"strictNullChecks": null 和 undefined 即是值，也是类型，null和undefined值只能赋给any，unknown和他们各自的类型
"exactOptionalPropertyTypes": 启用es7装饰器
"declaration": 指定TS文件编译后生成相应的.d.ts文件 export {} 导出的文件
"removeComments": 编译后删除注释
"baseUrl": "src"  // @
"paths": { "@/home/*": ["@/home/*"] // import homeThing from '@/home/' }
"include": ['./src/**/*.ts' // 匹配src下所有的ts文件] // 需要编译的ts文件一个'表示文件匹配'表示忽略文件的深度问题
"exclude": ['./src/**/home']
"esModuleInterop": // 有些依赖库底层为了兼容Commonjs规范、AMD规范这两者的规范中相互兼容，使用了export = 将二者规范统一。"esModuleInterop":true，表示允许依赖库中出现export = 这种兼容规范导出的格式，TS可以用import from导入
```

## any 和 unkonwn

```
any: 可以作为任何其他类型的父类，也可以作为任何其他类型的子类
let price:any = 'str'
let total:number = price
price = 'str'

let stuObj1:any = {name:'xx', age: 24}
stuObj1. // 获取不到属性，进行不了类型推导 但写stuObj1.name不出错
```

```
unknown: 可以作为任何其他类型的父类，但是不可以作为任何其他类型的子类
let price:unknown = 'str'
let total:number = price // 不能将类型“unknown”分配给类型“number”
stuObj2. // 获取不到属性，进行不了类型推导 写stuObj2.name出错 不存在属性
可以进行类型缩写 if (typeof price === 'number') {stuObj2. // 可以获取方法}
```

## 函数和函数类型

```
type infoFunType = (name: string, age: number) => number;
const info: infoFunType = (name, age) => {
  console.log("age: ", age);
  console.log("name: ", name);
  return age + 5;
};
info("Finoa", 23);
```

## 函数类型升级

```
type Student = {
  name: string
  age: number
  phone: number
}

function getMessage({ name, age, ...rest }: Student) { // 解构
  console.log(name)
  console.log(age)
}
const Lucy: Student = { name: 'Luscy', age: 24, phone: 123 }
getMessage(Lucy)
export {}
```

## BigInt

```
const max = Number.MAX_SAFE_INTEGER
console.log(max + 1)
console.log(max + 2)

const bigInt = BigInt(Number.MAX_SAFE_INTEGER)
console.log(bigInt + BigInt(1)) // 1n 需要target：es020
console.log(bigInt + BigInt(2)) // BigInt只能和BigInt相加

```

## 看似简单的取值为何总是出错？

```
let obj = { username: 'xx', age: 23 }
let username = 'username'
obj[username] // 元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "{ username: string; age: number; }"。
  在类型 "{ username: string; age: number; }" 上找不到具有类型为 "string" 的参数的索引签名。
  username可以变，不一定等于'username' 所以报错
使用 const 声明 常量可以解决
可用枚举解决
```

```
let obj: object = { username: 'xx', age: 23 }
const username = 'username'
obj[username] // 类型“{}”上不存在属性“username” 跟object去要属性而不是obj
let result = (obj as any)[username]
```

## 什么场景never能被直接推导出来而不用定义？

```
never: 表示永远不会发生的情况 可以配置只读属性
never 是所有类型的子类型 
type DateFlow = string | number
function dataFlowAnalysisWithNever(dataFlow: DateFlow) {
  dataFlow. // string 和 number 共有的方法
  if (typeof dataFlow === 'string') {
    console.log('string', dataFlow.) // string 独有的方法
  } else if (typeof dataFlow === 'number') {
    console.log('number', dataFlow.toFixed(3))
  } else {
    let data = dataFlow // never
  }
}
dataFlowAnalysisWithNever('免税店')
dataFlowAnalysisWithNever(3)
dataFlowAnalysisWithNever(true)
```

## 枚举

### 为什么要用枚举？

```
解决常量带来的局限性

方法参数不能定义为具体类型，只能初级使用number，string基本类型替代，降低了代码的可读性和可维护性
```

### 定义

```
用来存放一组固定的常量的序列
```

### 分类

```
// 数字枚举(双层映射)
enum Week {
  Sunday = 0,
  Monday,
  Tuesday,
  Wensday,
  Thirsday,
  Friday,
  Saturday, // 依次递增
}

字符串枚举
// 常量枚举 它是使用 const 关键字修饰的枚举，常量枚举与普通枚举的区别是，整个枚举会在编译阶段被删除
const enum Color {
  RED,
  PINK,
  BLUE,
}
```

### 优点

```
1.有默认值和可以自增值，节省编码时间
2.语义更清晰，可读性强
因为枚举是一种值类型的数据结构，方法参数可以明确参数类型为枚举类型
```

### 取值

```
console.log(Week.Friday, Week["Friday"]) // 5
console.log(Week[1]) // Monday
```

## 元组

```
tuple 是元组类型 可以限制数组元素个数和类型，适合用来实现多值返回
const state = [1, 2, 3]
const setState = function() {}
let arr1 = [state, setState]
let arr2 = [setState, state] // js无法区分彼此
我们常常把不同类型的值通过键值对的形式写成 {state, setState} 元组可以解决这个问题

const info: [string, number, number] = ['wq', 5, 15]
const item1 = info[0]
const item2 = info[1]
```

## 类型断言

```
const arr: number[] = [1, 2, 3, 4, 5]
const result: number = arr.find((item) => item > 2) // result 的类型可能为undefined


const arr: number[] = [1, 2, 3, 4, 5]
const result: number = arr.find((item) => item > 2) as number 
```

## 类型推断

在TS中，具有初始化的变量，有默认值的函数参数，函数返回的类型都可以根据上下文推断出来。

```
{
let num = 1 // num:number
let str = 'str' // str:string
}
{
const num = 1 // num: 1
const str = 'str' // str: 'str'
}
```

### 字面量类型

在TS中，字面量不仅可以表示值，还可以表示类型，即所谓的字面量类型

目前，TS支持3种字面量类型：字符串字面量类型，数字字面量类型，布尔字面量类型

```
{
let str:　'string': 'string',
let num: '5': 5
}
```

### 类型缩小

```
type Method = 'GET' | 'POST'
const obj = {
  url: 'www.xx.com',
  method: 'GET'
}as const
function request(url: string, method: Method) {
  console.log(url, method)
}

request(obj.url, obj.method) 或 request(obj.url, obj.method as Methods)
```

```
常见的类型保护有
typeof
平等缩小 (=== !==)
never
instance of
in
```

## 函数的重载

```
函数名称相同，但是参数不同的几个函数
function add(a: number, b: number): number // 没函数体
function add(a: string, b: string): string
function add(a: any, b: any): any {
  return a + b // 实现函数不能直接调用
}
```

## 类

```
public: 修饰的是在任何地方可见，公有的属性或方法，默认编写的属性就是public的
private: 修饰的是仅在同一类可见，私有的属性或方法，一般用_开头
protected: 修饰的是仅在类自身及子类中可见，受保护的属性或方法
readonly: 只读 在构造器中赋值，之后不能修改 等同于const进行常量绑定，绑定的值可以修改
getter/setter: 截取对类成员的读写访问
static: 定义在类对象上，而不是类的实例上，基于静态属性的特性，我们往往会把类相关的常量，不依赖实例this上下文的属性和方法定义为静态属性，从而避免数据冗余，进而提升运行性能
abstract: 抽象类是一种不能被实例化仅能被子类继承的特殊类。我们可以使用抽象类定义派生类需要实现的属性和方法，同时也可以定义其他被继承的默认属性和方法。作用: 对基础逻辑的封装和抽象
```

```
class Person {
  public name: string
  constructor(name: string) {
    this.name = name
  }
}

class Student extends Person {
  age: number
  constructor(name: string, age: number) {
    super(name)
    this.age = age
  }
  eat() {
    console.log(this.name) // protected
  }
}

const p = new Student('wq', 15)
console.log(p.name)
```

## 接口

```
interface IInfoType {
  name: string
  age?: number
  readonly address?: string
}

const info: IInfoType = {
  name: 'wq',
  age: 18,
}

```

### 索引类型

```
interface IIndexLanguage {
  [index: number]: string
}
interface ILanguageYear {
  [name: string]: number
}
const frontLanguage: IIndexLanguage = {
  0: 'HTML',
  1: 'CSS',
  2: 'JavaScript',
}
const languageYear: ILanguageYear = {
  C: 1972,
  Java: 1995,
  Javascript: 1996,
  TypeScript: 2014,
}
```

### 函数类型

```
// type CalcFn = (a: number, b: number) => number
interface CalcFn {
  (a: number, b: number): number
}
function calc(num1: number, num2: number, calcFn: CalcFn) {}
const add: CalcFn = (a, b) => a + b
calc(5, 6, add) // 一般用类型别名定义函数
```

### 接口的实现

```
// 编写公共API更加灵活，面向接口编程
interface ISwim {
  swimming: () => void
}
type IEat = {
  eating: () => void
}

// 类实现接口
class Animal {}

class Fish extends Animal implements ISwim, IEat {
  swimming() {
    console.log('fish swimming')
  }
  eating() {
    console.log('fish eating')
  }
}
```

### interface 和 type 区别

```
如果定义非对象 最好用type
interface 可以重复的对某个接口定义属性和方法(进行合并)
type 定义的是别名，不能重复
interface ISwim {
  name: string
}
type IEat = {
  eating: () => void
}

interface ISwim {
  age: number
}
```

### 字面量赋值

```
interface IPerson {
  name: string
  age: number
}

const info = {
  name: 'xx',
  age: 18,
  address: 'shenzhen',
} 

const p: IPerson = info // 代码不报错 赋值过程中有一个freshness擦除操作，将多余的属性剔除后是否满足类型检测 传参更加灵活

interface IPerson {
  name: string
  age: number
}

function printInfo(person: IPerson) {
  console.log(person)
}
const info = {
  name: 'xx',
  age: 18,
  adress: 'shenzhen',
}
printInfo(info) person.adress // 报错
```

## 泛型

```
软件工程的主要目的是构建不仅仅明确和一致的API，还要让你的代码具有很强的可重用性
比如我们可以通过函数来封装一些API，通过传入不同的函数参数，让函数帮助我们来完成不同的操作
```

```
// 类型参数化

function sum<T>(num1: T): T {
  return num1
}
// 调用方式一： 明确的传入类型
sum<number>(20)
sum<{ name: string }>({ name: 'xx' })
// 调用方式二： 类型推导
sum('50')
```

```
// 泛型接口
function foo<T, E>(arg1:T, arg2:E) {}
foo<number, string>(10, '20')

T：type的缩写
K、V: key、value
E：Element
O：object

interface IPerson<T1, T2> {
  name: T1
  age: T2
}

const p: IPerson<string, number> = {
  name: 'xx',
  age: 18,
}
interface IPerson<T1 = string, T2 = number> {
  name: T1
  age: T2
}

const p: IPerson = {
  name: 'xx',
  age: 18,
}

```

### 泛型类

```
class Person<T1, T2> {
  name: T1
  age: T2
  constructor(name: T1, age: T2) {
    this.name = name
    this.age = age
  }
}

```

### 泛型类型约束

```
interface ILength {
  length: number
}

function getLength<T extends ILength>(arg: T) {
  return arg.length
}

```

## 模块化

### 命名空间

```
namespace time {
  export function format(time: string) {
    return time
  }
}

namespace price {
  export function format(price: number) {
    return price
  }
}

// import {time, price} from './'
```

### 类型的查找

```
TypeScript中的类型，几乎都是我们自己编写的，但是我们也有用到过一些其他类型
const div = document.querySelect('div') as HTMLDivElement
.d.ts
用来做类型的声明declare。它仅仅用来做类型检测，告知TS我们有哪些类型
来自于
1.内置类型声明
lib/dom.d.ts
2.外部定义类型声明
npm i @types/lodash --save-dev
3.自己定义类型声明
declare module '*.jpg'
declare let name: string
```

## 技巧

### 一个联合类型技巧性使用场景

```
type IncreaseBoolean = Boolean | 1 | 0
function mounted(isStartup: IncreaseBoolean) {
  if(isStartup) {} 
}
```

