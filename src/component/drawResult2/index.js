import React from  'zebra-isv-base/libs/preact';
import './style.less'
import {trackerClk,BUS_RED_PACKET,LIFE_PAY_RED_PACKET,CASH_RED_PACKET,GOODS_COUPON,pushWindow,my} from '../../util/common'

const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export default class DrawResult extends React.Component {
	state = {showPop:true}


	onBannerPressed(e){
		console.log('onButtonPressed')
		e.preventDefault()
		let {sellerId} = this.props.data.bag
		trackerClk("POPUP_GO_BANNER", {sellerId})
		this.setState({showPop:false},()=>{
			let bag =  this.props.data.bag	
			pushWindow({link:bag.bannnerUrl})
		})
	}
	onGoShopPressed(e) {
		console.log('onButtonPressed')
		e.preventDefault()
		let {sellerId} = this.props.data.bag
		trackerClk("POPUP_GO_SHOP", {sellerId} )
		this.setState({showPop:false},()=>{
			let bag =  this.props.data.bag	
			pushWindow({link:bag.shopUrl})
		})
		
	}
	onButton2Pressed(e) {
		console.log('onButtonPressed')
		e.preventDefault()
		let {sellerId} = this.props.data.bag
		trackerClk("POPUP_MORE_DRAW", {sellerId} )
		this.setState({showPop:false})	
	}
	onClosePressed(e) {
		console.log('onClosePressed')
		e.preventDefault()	
		trackerClk("POPUP_CLOSE",{name:"抽奖结果弹框关闭"})
		this.setState({showPop:false},()=>{
			my.hideResult()
		})		
	}
	onNonePressed(e){
		console.log('onNonePressed')
		e.stopPropagation()	
	}


	// gets called when this route is navigated to
	componentDidMount() {		
		let res = this.props.data
		let win  = res.success && (res.result1.win || res.result2.win) 
		let {sellerId} = this.props.data.bag
		if(win) {
			trackerClk("POPUP_SHOW_DRAW_RESULT",{sellerId})
		}else {
			trackerClk("POPUP_SHOW_NO_DRAW",{sellerId} )
		}
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
	
	}

	render(props) {
		if(this.state.showPop)
		{
		 let res = props.data
		 /**
		  *  let coupon={
            "displayAmountUnit":"元",
            "displayAmount":"10",
            "benefitTitle":"宝洁优惠券",
            "primaryContent":"满199减10元",
            "shopLogo":"//img.alicdn.com//65/da/TB1lWMVJXXXXXXSXpXXSutbFXXX.jpg",
            "shopName":"宝洁官方旗舰店"}   
		  * 
		  */
		 let  {draw_result}  = data.config
		 /*
		  "draw_result": {
			"image": null,
			"buttomText1": "进店逛逛",
			"kefu": "支付宝客服电话：95188",
			"buttomText2": "更多福袋"
		  },
		  */	
		 let bag =  props.data.bag || {}
		 let win  = res.success && (res.result1.win || res.result2.win) 
		 let primaryContent=''
		 let shopLogo1 =  bag.icon_img
		 let shopName1 =  bag.name
		 let message=''
		if(win) {				 
		let  coupon
		if( res.result1.win){
			coupon =  res.result1.data.coupon
			let {type} = res.result1.data
			let {shopName,shopLogo,displayAmount,displayAmountUnit} =coupon ||  {}
			shopLogo1 = shopLogo1 ||shopLogo
			shopName1 = shopName1 ||shopName
		    if(type===LIFE_PAY_RED_PACKET) { //BUS_RED_PACKET,LIFE_PAY_RED_PACKET,CASH_RED_PACKET,GOODS_COUPON
				message = `${displayAmount}${displayAmountUnit}生活缴费红包`
		 	} 
		 	else if(type===CASH_RED_PACKET) {
				message = `${displayAmount}${displayAmountUnit}现金红包`
			} else if(type===BUS_RED_PACKET) {
				message = `${displayAmount}${displayAmountUnit}乘车红包`
		 	}else if(type===GOODS_COUPON) {
				message = `${displayAmount}${displayAmountUnit}优惠券`
				primaryContent = coupon.primaryContent
			}
		}
		if( res.result2.win){
			coupon =  res.result2.data.coupon
			let {type} = res.result2.data
			let {shopName,shopLogo,displayAmount,displayAmountUnit} =coupon ||  {}
			shopLogo1 = shopLogo1 || shopLogo
			shopName1 = shopName1 || shopName
		  	if(type===LIFE_PAY_RED_PACKET) {
			message = (message?(message+'\n+'):'') +`${displayAmount}${displayAmountUnit}生活缴费红包`
	 		} 
	 		else if(type===CASH_RED_PACKET) {
			message =(message?(message+'\n+'):'') + `${displayAmount}${displayAmountUnit}现金红包`
	 		} else if(type===BUS_RED_PACKET) {
			message =(message?(message+'\n+'):'') + `${displayAmount}${displayAmountUnit}乘车红包`
	 		}else if(type===GOODS_COUPON) {
			message =(message?(message+'\n+'):'') + `${displayAmount}${displayAmountUnit}优惠券`
			primaryContent = coupon.primaryContent
	 		}
		}

	}

		 //
		 let bgImage  = draw_result.image 
		 if( (!bgImage) || bgImage.indexOf('//')==-1) bgImage = `${assets}image/coupon_bg2.png`
		
		 
		 let banner  = bag.image //|| `${assets}image/banner.png`		 
		 let logo= shopLogo1 &&(shopLogo1.indexOf('//')==-1?  'https://gw.alicdn.com'+shopLogo1 : shopLogo1) 
		return (			
		<div class="drawresult2-mask" onClick={this.onClosePressed.bind(this)}> 	
		<div class="drawresult2-content"  onClick={this.onNonePressed.bind(this)}>  
		<img class="pop-bg" src={bgImage}> </img>
		<div class="shopName">{shopName1}</div>
		{ logo && <img  class="logo" src={logo}> </img>	}	  
		{ (!logo) && <img  class="logo"> </img>	}	
		{ (win && message) && (<div class="msg-box"> <div class="text1">恭喜获得</div>  <div class="text2">{message}</div>  </div>) }
		{ (!win) && (<div class="msg-box"> <div class="text1">抱歉，已经发完</div>  </div>) }
        <div class="text3">{primaryContent}</div>			
		<div class="text4">(同支付宝账号、手机号、身份证、设备皆视为同一账号)</div>
		{ win && <div  class="button2" onClick={this.onGoShopPressed.bind(this)} >
          <div class="button-text" >{draw_result.buttonText1}></div>
		</div>	
		}
		{ (!win) && <div  class="button2" onClick={this.onButton2Pressed.bind(this)} >
          <div class="button-text" >{draw_result.buttonText2}></div>
		</div>	
		}
		{ (win&&banner)&& (<img  class="banner" src={banner}   onClick={this.onBannerPressed.bind(this)} > </img> )}
		{ win && (<div class="text-kf">{draw_result.kefu}</div>  )}
		<div class="drawresult2-close" style={{background: `url(${assets}image/close.png) no-repeat`,'background-size':'contain'}} onClick={this.onClosePressed.bind(this)} ></div>
		
		</div>
		
		</div>);
		}
		else{ return (
			<div style={{display:'none'}}></div>
		)
		}
	}
}
