import React from  'zebra-isv-base/libs/preact';
import './style.less'
import { mtop,navigation,crossImage ,localStorage } from 'zebra-isv-base'
import {trackerClk,trackerExp,pushWindow} from '../../util/common'
const urlParams = navigation.getUrlParams()
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export function Toast (props){
	return (<div class={props.content?"am-toast text":"hide"}>
	<div class="am-toast-text">
	{props.content}
	</div>
</div>)
}

export  function Loading (props){
	return (<div class={props.content?"am-toast":"hide"} >
	<div class="am-toast-text">
		<div class="am-loading-indicator white">
			<div class="am-loading-item"></div>
			<div class="am-loading-item"></div>
			<div class="am-loading-item"></div>
		</div>
		{props.content}
	</div>
</div>)
}


export default class Bind extends React.Component {
	state = {
		loading:null,
		showPop:true,
	  sellerId:null,
		joinDisplay:false,
		mobile:'',
		ready:false,
		inputEnable:false,
		toast:null,
	}


	

	showToast(msg,duration,cb){
		console.log('toast',msg)
		this.setState({toast:msg})
		setTimeout(()=>{
			this.setState({toast:null})
			cb && cb()
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

	componentDidMount() {
	    this.showLoading("加载中")
    this.pressedTime=0
    this.input.oncomputed = (input) => {
			this.realInput = input		
    }
    this.codeInput.oncomputed = (input) => {
      this.realCodeInput = input
		}
		
    let {sellerId} = this.props.data// || '1603022934'//'1603022933'
		this.setState({sellerId}) 
		trackerExp("POPUP_SHOW_BIND",{sellerId})
   if(sellerId) {
      mtop('mtop.taobao.seattle.memberinfo.get', {sellerId}, { needSignIn: true }).then((result) => {
        console.log(result)  
        
        let data1 = result && result.data && result.data.result &&  result.data.result
        if(data1){
        let isMember =data1.isMember=='true'
        let buyerNick =data1.buyerNick
        let cardCover =data1.cardCover
				let mobile =data1.mobile	
			
				trackerExp("MEMBER_INFO",{sellerId,mobile,isMember,buyerNick})
        if(isMember){
          this.setState({
						ready:true,		
            joinDisplay: !isMember,
            buyerNick:buyerNick,
            cardCover:cardCover,
            mobile:mobile,
          });
					this.showToast("已经是会员了",2000,()=>{
						this.setState({
							showPop:false					 
						},()=>{
							let reject = this.props.reject
							reject && reject({success:false})
						});
					}) 	
        }else {      
        this.setState({
					ready:true,			
	        buyerNick:buyerNick,
          cardCover:cardCover,
          mobile:mobile,
          joinDisplay: !isMember
				});   
				//this.realInput && (this.realInput.value = mobile)    				 
			}

		  }else {
        this.showToast("系统开小差了，请稍候重试") 
      }
			this.hideLoading()
      }, (err)=> {
        console.log('sync inventory error', err)  
        let {res,message} = err || {}
        let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
        this.showToast(msg)
          this.hideLoading()
    })
  }else {   
    
      this.hideLoading()
     
  }

	}

 
	componentWillUnmount() {
	
	}
	onBack(e){
		trackerClk("POPUP_CLOSE",{name:'入会页面'})
		this.setState({showPop:false},()=>{
			let reject = this.props.reject
			reject && reject({success:false})
		})
	}
	
	render (props) {
		if(this.state.showPop){
		//let d = props.data || {}
		let bagData = props.bagData || {}
		let bgImage =  bagData.bgImage || `${assets}image/beijing.png`//   //props.logo
		let max_tilte = bagData.couponPrize
		let logo = bagData.icon_img
		let name = bagData.name || ''
		let joinCod = (bgImage.notice&&(`获得条件：${bgImage.notice}`) )||  (name && `获得条件：完成${name}店铺首次入会`)  || ''
		//let bj = beijing
		//console.log("render",{joinCod,bagData,bgImage,max_tilte,logo,name})
		return (	
			<div class="bind-mask">
		  <div class ="bind-content">    
			<div class="act-bg">
			<img  class="bgimg" src={bgImage} /> 
			<img  class="logo" src={logo} /> 
			<div class="title1" >{max_tilte}</div>
			<div  class="title2">{name}</div>
			</div>
			<div class="act-box"   style={{display: this.state.ready ? '': 'none'}}>
			  <div class="msg">{joinCod}</div>
			<div class="mobile-box"  style={{display: this.state.joinDisplay? '': 'none'}}>
			  <div class="title-text">手机</div>
			  <div class="title-text2" style={{display: this.state.inputEnable? 'none': ''}}>{this.state.mobile}</div>
			  <input   style={{display: this.state.inputEnable? '': 'none'}}
			  ref={input => {this.input = input}} 
			  placeholder="请输入手机号" type='text'  
			  class="input" 
			  value={this.state.mobile} 
			  onChange={this.onChange.bind(this)} />          
			  <div class="right"  style={{display: this.state.inputEnable? 'none': ''}} onClick={this.onMobileEditPressed.bind(this)}>
				<img  src="//gw.alicdn.com/tfs/TB17koUcgoQMeJjy1XaXXcSsFXa-32-34.png_110x10000.jpg" style="display: flex; width: 17.4507px; height: 17.4507px;"/>
			  </div> 			 
			</div>
			<div>  
			</div>
	
			<div  class="mobile-smscode-box1">
			 <div class="mobile-smscode-box" style={{display: this.state.inputEnable && this.state.joinDisplay? '': 'none'}}>
			  <div class="title-text" >验证码</div>
			  <input  ref={input => {this.codeInput = input}}  placeholder="请输入验证码" maxlength="6"  class="input"/>
				<div class="right2" style={{display: this.state.inputEnable? '': 'none'}} onClick={this.onSendSmsPressed.bind(this)}>
			  <span  class="getcode"  >获取验证码</span>
			  </div>
				</div>			
			</div>
	
			<div  class="join-button-box"  style={{display: this.state.joinDisplay? '': 'none'}}>
			<div  class="join-button" >
			  <img src={`${assets}image/bt_bind.png`}  onClick={this.onJoinPressed.bind(this)}/>
			</div>
			<div class="msg">确定即表示接受此品牌<a href={'#'} onClick={this.onLinkRulePressed.bind(this)}>《会员规则》</a>，同意入会时提供的手机号接受此品牌发送的商业性信息 </div>

			
			</div>
		  </div>
	
			<div class="buzhou"> 	<img src={`${assets}image/buzhou.png`} />   </div>
			<Toast content={this.state.toast}/>
			<Loading content={this.state.loading}/>
		  </div>
			</div>
		)
			}else {
				(
					<div style={{display:'none'}}></div>
				)
			}
	  }
	  onMobileEditPressed(e){
		e.preventDefault()
	//	this.realInput.value= this.state.mobile
		this.setState({
		  inputEnable: !this.state.inputEnable,
		})
	  }
	  onChange(e){
		console.log('L36',this.realInput.value)
		this.setState({
		  imputMobile: this.realInput.value,
		})
		}
		
		onLinkRulePressed(e){
			e.preventDefault()			
			let ruleUrl = data.config.ruleUrl || ''
			pushWindow({link:ruleUrl},false)
		}
	
		onLinkPressed(e){
			e.preventDefault()
			let privacyUrl = data.config.privacyUrl || ''
			pushWindow({link:privacyUrl},false)
		}
	  onSendSmsPressed (e) {
		e.preventDefault()		
		console.log("onSendSmsPressed",this.realInput.value) 
		let {sellerId} = this.state
		trackerClk("MEMBER_SEND_SMS",{sellerId})
		mtop('mtop.taobao.seattle.member.smscode.get', {sellerId,mobile: this.realInput.value}, { needSignIn: true }).then((result) => {
		  console.log(result) 
		  this.showToast("短信获取成功")
		}, (err)=> {
		  console.log('sync inventory error', err)  
		  let {res,message} = err || {}
		  let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
		  this.showToast(msg)
	
	  })
		}
		
		afterJoined(){
	
			this.pressedTime=0
  		this.showToast("入会成功")
			this.setState({showPop:false},()=>{
					let resolve = this.props.resolve
					resolve && resolve({success:true})
	   	})						
		
		}
	
	  onJoinPressed (e) {
		e.preventDefault()	
		let n =  +Date.now()
		if(n-this.pressedTime<3000) {
			console.log("onJoinPressed点击太快")
			return
		}	
		this.pressedTime = n
	
		if(urlParams.noBind && data.config.debug==='ON'){ 
		this.afterJoined()
		return
		}
	
		let mobile = this.realInput.value || null
		let code = this.realCodeInput.value || null
		if( this.state.inputEnable){
		  if(mobile==null|| mobile==='' || code==null || code==='')
		 { console.log("onJoinPressed null") 
		 this.showToast("请输入手机号") 
		  return
		}
		}else {
		  mobile = null
		  code = null
		}
		console.log("onJoinPressed",mobile,code) 
		 this.showLoading("请稍等")
		let {sellerId} = this.state    
		trackerClk("POPUP_GO_BIND",{sellerId})
		mtop('mtop.taobao.seattle.member.bind', {
		  sellerId,mobile:mobile,code:code,	
		}, { needSignIn: true , v: '2.0',}).then((result) => {
		  console.log(result)  
			this.hideLoading()
		  if(result.data.errorCode==='0'){
			this.setState({     
			  joinDisplay:false
			});
			this.showToast("入会成功")
			trackerClk("MEMBER_BIND_SUCCESS",{sellerId,mobile})

			this.afterJoined()
		  }else {
			this.showToast("入会失败") 
			trackerClk("MEMBER_BIND_FAIL",{sellerId,mobile})
			let bindError = +(localStorage.getItem('bindError'+sellerId)  || 0)
			localStorage.setItem('bindError'+sellerId,bindError+1)
			}
			this.pressedTime=0
		}, (err)=> {
			this.pressedTime=0
			this.hideLoading()
		  let {res,message} = err || {}
		  let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
		  this.showToast(msg)
			trackerClk("MEMBER_BIND_ERROR",{sellerId,mobile,msg})
			let bindError = +(localStorage.getItem('bindError'+sellerId)  || 0)
			localStorage.setItem('bindError'+sellerId,bindError+1)
		  console.log('member.bind error', err)    
	  })
	
	  }
}
