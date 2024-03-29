import React from 'react'
import style from './App.module.css'
import { RAF, color16 } from './utils'
import io from 'socket.io-client';


class BulletItem extends React.Component {

  static defaultProps = {
    playState: 'running'
  }

  render() {
    return (
      <div style={{
        'animationPlayState': this.props.playState,
        'opacity': this.props.visible ? 1 : 0,
        'top': `${this.props.top}px`,
        'borderColor': this.props.borderColor
      }}
        onAnimationEnd={this.props.onAnimationEnd(this.props.num)}
        className={style.item}>
        {this.props.text}
      </div>
    );
  }
}

const uri = 'http://localhost:3001' //'http://192.168.1.101:3001';

class BulletsScreen extends React.Component {

  timerId = 0;

  maxHeight = 200 * 2 - 30;

  i = 0;

  state = {
    items: [{
      playState: 'running',
      text: 'hello',
      visible: true,
      top: Math.random() * this.maxHeight,
      borderColor: color16()
    },
    {
      playState: 'running',
      text: 'world',
      visible: true,
      top: Math.random() * this.maxHeight,
      borderColor: color16()
    }
    ],
    views: [],
    op: 'run'
  };

  componentDidMount() {
    this.tick()
    this.socket = io(uri)
    this.socket.on('getData', items => {
      this.setState(prevState => {
        return {
          items
        }
      })
    })
    // 第一次广播
    this.socket.emit('message-from-client', this.state.items)
  }

  tick() {
    this.timerId = RAF.setInterval(() => {
      const { items } = this.state;
      if (this.i < items.length) {
        this.setState(prevState => {
          return {
            views: [...prevState.views, prevState.items[this.i]]
          }
        });
      }
      this.i++;
    }, 800)// 时间决定了弹幕的水平间隔
  }

  handleAnimationEnd = num => {
    if (this.i > this.state.items.length) {
      this.i = 0;
      return;
    }
    this.setState(prevState => {
      return {
        views: prevState.views.filter((_, i) => i !== num)
      }
    });
  }

  handleKeyDown = e => {
    if (e.keyCode === 13) {//enter 键
      this.handleAdd()
    }
  }

  handleAdd = () => {
    const message = this.input.value

    if (!message) return;

    this.input.value = ''
    this.setState({
      items: [...this.state.items, {
        text: message,
        playState: 'running',
        visible: true,
        top: Math.random() * this.maxHeight,
        borderColor: color16()
      }]
    }, (prevState) => {
      // 同步整个字幕
      this.socket.emit('message-from-client', this.state.items)
    })
  }

  handleStop = () => {
    RAF.clearInterval(this.timerId)
    this.setState({
      views: this.state.views.map(item => { return { ...item, playState: 'paused', visible: true } })
    });
  }

  handleRun = () => {
    this.tick()
    this.setState({
      views: this.state.views.map(item => { return { ...item, playState: 'running', visible: true } })
    });
  }

  handleClear = () => {
    RAF.clearInterval(this.timerId)
    this.setState({
      views: this.state.views.map(item => { return { ...item, playState: 'paused', visible: false } })
    });
  }

  handleMessage() {
    alert()
  }

  handleClick = () => {
    if (this.state.op === 'run') {
      this.handleStop();
      this.setState({
        op: 'pause'
      })
    } else {
      this.handleRun();
      this.setState({
        op: 'run'
      })
    }
  }


  render() {
    const { views, op } = this.state;
    return (
      <div>
        <div className={style.list}>
          {views.map((data, i) => <BulletItem
            {...data}
            onAnimationEnd={() => this.handleAnimationEnd}
            num={i}
            key={i}
          />)
          }
        </div>
        <p className={style.controls}>
          {/* <button onClick={this.handleStop}>pause</button>
          <button onClick={this.handleRun}>run</button> */}
          <button onClick={this.handleClick}>{op === 'run' ? 'run' : 'pause'}</button>
          <button onClick={this.handleClear}>hide</button>
          <input onKeyDown={this.handleKeyDown} ref={input => this.input = input} />
          <button onClick={this.handleAdd}>add</button>
        </p>
      </div>
    );
  }
}

export default BulletsScreen;