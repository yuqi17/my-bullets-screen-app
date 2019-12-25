import React from 'react'
import style from './App.module.css'
import RAF from './utils'

function color16(){//十六进制颜色随机
  var r = Math.floor(Math.random()*256);
  var g = Math.floor(Math.random()*256);
  var b = Math.floor(Math.random()*256);
  var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
  return color;
}

class BulletItem extends React.Component{

  static defaultProps = {
    playState:'running'
  }

  state = {
    text:'',
  }

  render(){

    return (<div style={{
        'animationPlayState':this.props.playState, 
        'opacity':this.props.visible ? 1 : 0,
        'top': `${this.props.top}px`,
        'borderColor':this.props.borderColor
        }} 
        onAnimationEnd={this.props.onAnimationEnd(this.props.num)} 
        className={style.item}>{this.props.text}</div>);
  }
}


class BulletsScreen extends React.Component {

    timerId = 0
    i = 0
    state = {
      items:[{
        playState:'running',
        text:'hello',
        visible:true,
        top:Math.random() * 100,
        borderColor:color16()
      },
      {
        playState:'running',
        text:'world',
        visible:true,
        top:Math.random() * 100,
        borderColor:color16()
      }
    ],
      views:[],
    }

    componentDidMount(){
      this.tick()
    }

    tick(){
      this.timerId = RAF.setInterval(()=>{
        const { items } = this.state;
        if(this.i < items.length){
          this.setState(prevState => {
            return {
              views:[...prevState.views, prevState.items[this.i]]
            }
          });
        }
        this.i++;
      },800)// 时间决定了弹幕的间隔
    }

    handleAnimationEnd = num=>{
      if(this.i > this.state.items.length){
        this.i = 0;
        return;
      }
      this.setState(prevState => {
        return {
          views:prevState.views.filter((_,i) => i !== num)
        }
      });
    }

    handleAdd = ()=>{
      const message = this.input.value
      this.input.value = ''
      this.setState(prevState => {
        return {
          items:[...prevState.items, {
            text:message,
            playState:'running',
            visible:true,
            top:Math.random() * 100,
            borderColor:color16()
          }]
        }
      })

      // 
    }

    handleStop = ()=>{
      RAF.clearInterval(this.timerId)
      this.setState({
        views:this.state.views.map(item => {return {...item, playState:'paused',visible:true}})
      });
    }

    handleRun = ()=>{
      this.tick()
      this.setState({
        views:this.state.views.map(item => {return {...item, playState:'running', visible:true}})
      });
    }

    handleClear = ()=>{
      RAF.clearInterval(this.timerId)
      this.setState({
        views:this.state.views.map(item => {return {...item, playState:'paused', visible:false }})
      });
    }


    render(){
      const { views } = this.state;
      return (
        <div>
            <div className={style.list}>
            {views.map((data, i) => <BulletItem 
              {...data}
              onAnimationEnd={()=>this.handleAnimationEnd} 
              num={i} 
              key={i} 
             />)
            }
          </div>
          <p>
            <button onClick={this.handleStop}>pause</button>
            <button onClick={this.handleRun}>run</button>
            <button onClick={this.handleClear}>clear up</button>
          </p>
          <p>
            <textarea ref={input => this.input = input}/>
            <button onClick={this.handleAdd}>add</button>
          </p>
        </div>
      );
    }
}

export default BulletsScreen;