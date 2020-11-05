import React from 'zebra-isv-base/libs/preact'
import { auth, navigation, device   } from 'zebra-isv-base'
import {trackerUser, trackerClk,trackerPageLoad, showPopup, pushWindow ,Toast,Loading,my} from './util/common'
import './index.less'
import PopRule from './component/popRule'
import LuckDraw from './component/luckDraw'
import GoodsList from './component/goodsList'
import {goTask,openBag,hasOpenBag,updateLuckyBagStatus,getTaskStatus,completeTaskStatus} from "./util/luckyBag" 
trackerPageLoad()
console.log(__version__,data.config, navigation.getUrlParams())
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'
class App extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      user: null,
      toast:null,
      loading:null,
      // clH: 
    }
  }
  
	 showToast=(msg,duration,type)=>{
		console.log('toast',msg)
		this.setState({toast:msg})
		setTimeout(()=>{
		  this.setState({toast:null})
		 }, duration ||2000)
		  
	  }
	  
	  showLoading= (msg) => {
		console.log("showLoading",msg)
		this.setState({loading:msg})
		}
		hideLoading= () => {
		console.log("hideLoading")
		this.setState({loading:null})
		}
  checkUser() {
    auth.isLogin().then(user => {

      if (user) {
        console.log('L19 login')
        this.setState({
          user,
        })    
        trackerUser(user)       
       
        console.log('L19 login end')
      }
    },(err)=>{
      console.log('checkUser',err)
      auth.login().then(({ errorCode, errorMessage }) => {
        console.log('auth.login',errorCode,errorMessage)
        //this.checkUser()
      })
    })
  }
  componentDidMount() {
      this.content.oncomputed = (content) => {
        this.realContent = content
      }
      showPopup.showToast = this.showToast
      showPopup.hideLoading = this.hideLoading
      showPopup.showLoading = this.showLoading
      //setShowToast( this.showToast)
      this.checkUser()
      this.setState({showBag:(data.config.showBag===true || data.config.showBag==='true' )})
  }

  goBackTop= (e) => {
    e.preventDefault()
    this.realContent.scrollTop = 0  
    trackerClk("GO_BACK_TOP")
  }

  render() {
    const { notice, bgcolor, sakura } = data.config
    const handleEntrance = (item) => {
      let param = {
        link: item.link,
        link_type: item.link_type
      }
      trackerClk("GO_NEXT")
      pushWindow(param)
    }
    let notice_list = []
    for (let key in notice) {
      if (key !== 'length') {
        notice_list.push(notice[key])
      }
    }
      return (
        <div class="outermostLayer" style={{backgroundColor: `${bgcolor || 'FF6F77'}`}} ref={content => {
          this.content = content
        }} >
          <div class="secondLayer">
          <div  id="myRef" ref={myRef => {
            this.myRef = myRef
          }}>        
          </div>
          <div class="paddingDiv">
          { this.state.showBag? <LuckDraw />:<div/> }
          </div>
          <div class="ruless"  onClick={ ()=> my.showRule()}>
            活动规则
          </div>
          <GoodsList />
          <div class="sakura" onClick={() => handleEntrance(sakura)}>
          </div>
          <div id="popupBox"></div>
          <div class="goBackTop" onClick={this.goBackTop.bind(this)}>
            <img src={`${assets}image/goBack.png`}></img>
          </div>
          {/* 弹幕 */}
          {/* {
            (false) &&
            <div class="barrageAd">
              <div class="barrageSwiper smoothMoving">
                {
                  notice_list.map((item, idx) => {
                    return (
                      <div key={idx} class="barrageTxt">
                        {item.msg}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          } */}
          </div>
        <Toast content={this.state.toast}/>
			  <Loading content={this.state.loading}/>        
        </div>
      )
    }


  }


  const box = document.getElementById('box')
  React.render(<App />, box)
