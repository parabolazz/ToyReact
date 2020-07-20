class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, val) {
    this.root.setAttribute(name, val)
  }
  appendChild(vChild) {
    vChild.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}


export class Component {
  constructor(){
    this.children = [];
  }
  mountTo(parent) {
    // 调用实际组件的render函数
    let vdom = this.render();
    debugger
    vdom.mountTo(parent)
  }
  setAttribute(name, val) {
    this[name] = val;
  }
  appendChild(vchild) {
    this.children.push(vchild)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

export let ToyReact = {
  //babel/plugin-transform-react-jsx 插件会递归地调用这个函数
  createElement(type, attributes, ...children) {
    let ele;
    // 如果是一个真实dom
    if(typeof type === 'string') {
      ele = new ElementWrapper(type)
    // 如果是一个组件, type 是一个组件的 class，此时就需要 new 出实例
    } else {
      ele = new type
    }
    // 把自身的属性都添加到节点上
    for(let name in attributes) {
      ele.setAttribute(name, attributes[name])
    }
    // 插入子节点数组
    let insertChildren = (children) => {
      for(let child of children) {
        // 如果还是个数组，则继续递归
        if(typeof child === 'object' && child instanceof Array) {
          insertChildren(child)
        } else {
          if(!(child instanceof Component)
            && !(child instanceof ElementWrapper)
            && !(child instanceof TextWrapper)) {
              // 不是这三种节点的，全部转为字符串
              child = String(child)
            }
          if(typeof child === 'string') {
            child = new TextWrapper(child)
          }
          ele.appendChild(child)
        }
      }
    }
    insertChildren(children)
    return ele;
  },
  // 用于渲染根组件
  render(vdom, element) {
    vdom.mountTo(element)
  }
};

// 整个过程就是 babel/plugin-transform-react-jsx 把我们的 jsx 一个一个调用我们写的 createElement，然后再分别遍历他们的子节点，对子节点进行渲染。
// 如果是一个组件，则调用 render 函数生成对应的 ElementWrapper 实例，再用 ElementWrapper 的 mountTo ，把真实 dom append 到 parent上
// 如果是一个普通 dom，则 new ElementWrapper 实例，生成真实 dom，然后 append 到 this.root 上去。