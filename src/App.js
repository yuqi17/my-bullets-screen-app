import React from 'react'
import style from './App.module.css'
import RAF from './utils'

class BulletItem extends React.Component{

  static defaultProps = {
    playState:'running'
  }

  state = {
    text:'',
  }

  render(){
    return (<div style={{'animation-play-state':this.props.playState, 'opacity':this.props.visible ? 1 : 0}} 
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
        visible:true
      },
      {
        playState:'running',
        text:'world',
        visible:true
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
      },1000)
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

    handleClick = ()=>{
      this.setState(prevState => {
        return {
          items:[...prevState.items, {
            text:'wahahaha',
            playState:'running',
            visible:true
          }]
        }
      })
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
            <button onClick={this.handleClick}>add</button>
            <button onClick={this.handleClear}>clear up</button>
          </p>
        </div>
      );
    }
}

export default BulletsScreen;