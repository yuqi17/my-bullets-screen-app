import React from 'react'
import style from './App.module.css'
import RAF from './utils'

class BulletItem extends React.Component{

  state = {
    text:''
  }

  render(){
    return (<div onAnimationEnd={this.props.onAnimationEnd(this.props.num)} className={style.item}>{this.props.text}</div>);
  }
}


class BulletsScreen extends React.Component {

    timerId = 0
    i = 0
    state = {
      items:['this is a test','phamacy','bullets','diarrhea'],
      views:[],
    }

    componentDidMount(){
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
          items:[...prevState.items, 'wahahaha']
        }
      })
    }

    handleStop = ()=>{

    }

    render(){
      const { views } = this.state;
      return (
        <div>
            <div className={style.list}>
            {views.map((text, i) => <BulletItem onAnimationEnd={()=>this.handleAnimationEnd} num={i} key={i} text={text}/>)}
          </div>
          <p>
            <button onClick={this.handleStop}>stop</button>
            <button onClick={this.handleClick}>add</button>
          </p>
        </div>
        
      );
    }
}

export default BulletsScreen;