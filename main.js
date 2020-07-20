import {ToyReact, Component} from './ToyReact.js'

class Mycomponent2 extends Component {
  render() {
    return <p>test</p>
  }
}

class MyComponent extends Component {
  render() {
    return <ul>
      <span>hello</span>
      <span class="name">world</span>
      <span>!!!</span>
      <div>
        <Mycomponent2></Mycomponent2>
      </div>
    </ul>
  }
}

let a = <MyComponent id="a"></MyComponent>

ToyReact.render(
  a,
  document.body
)

// document.body.appendChild(a)
