import React from 'zebra-isv-base/libs/preact';
import {  device } from 'zebra-isv-base'
import { goTask, openBag, hasOpenBag, getBackClass, updateLuckyBagStatus, getTaskStatus, completeTaskStatus } from "../..//util/luckyBag"
import { trackerClk, pushWindow,store } from '../../util/common'
import './style.less'
let getChange
const nextRound = requestAnimationFrame;
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'
let moveX,  //手指滑动距离
	printEndX,  //手指停止滑动时X轴坐标
	cout = 1, //滑动计数器
	startX,
	startY,
	sumCount,
	width = parseInt(device.clientWidth);
export default class luckDraw extends React.Component {
	state = {
		showPop: false,
		openItem: '',
		taskStatus: {},
		secondTaskStatus: {},
		backClass: [],
		currentId: 1,
	}
	componentDidMount() {
		const movebox = document.getElementById("moveBox"); //滑动对象
		getBackClass().then((res) => {//过滤已经是会员的
			const array = res.sort(this.sortBy('openBagStatus'))
			this.setState({
				backClass: array,
			})
			if (res.length <= 1) {
				this.setState({
					currentId: 0
				})
				cout = 0
			}
			if (array.length < 2) {
				movebox.style.transform = "translate3d(" + parseInt(107 * width / 375) + "px,0,0)";
			} else if(array.length > 2) {
				movebox.style.transform = "translate3d(" + (parseInt(-37 * width / 375) - 10) + "px,0,0)";
			}
		})
		try{
		store.on("openBag", (taskId) => {
			if (!taskId) return
			console.log("store.update openBag")
			this.setState({
				showPop: false,
				backClass: this.state.backClass.map((t) => {
					if (t.id === taskId) {
						t.openBagStatus = true
					}
					return t
				}),
			})
		})
		store.on("completeTask", (p) => {
			if (!p) return
			let { taskId, taskType } = p
			console.log("store.update completeTask")
			let { taskStatus, secondTaskStatus } = this.state
			this.state.backClass && this.state.backClass.forEach((t) => {
				if (t.id === taskId) {
					if (taskStatus && t.task1Type === taskType) {						
						let d = {...taskStatus}
						d.done = true
						this.setState({ taskStatus:d })
					} else if (secondTaskStatus && t.task2Type === taskType) {						
						let d = {...secondTaskStatus}
						d.done = true
						this.setState({ secondTaskStatus:d })
					}
				}
			})
		})
	} catch(err){
		console.log("store",err)
	}
		//滑动对象事件绑定
		movebox.addEventListener("touchstart", this.boxTouchStart, false);
		movebox.addEventListener("touchmove", this.boxTouchMove, false);
		movebox.addEventListener("touchend", this.boxTouchEnd, false);
		// const firstWidth = (width - Li[cout].offsetWidth) / 2;
		// movebox.style.transform = "translateX(" + (-46) + "px)";
	}
	componentWillUnmount() {
	}
	render() {
		return (
			<div>
				<div class="record" onClick={() => this.jumpMyDraw()}>*中奖记录*</div>
				<div class="swiper-container">
					{
						this.state.backClass.length == 2 ? <div class="swiper-wrapper2" id="moveBox">
							{
								this.state.backClass.map((item, index) => {
									return <div class="li swiper-slide swiper-slide-active" key={index}>
										<div class="li1">
											<img class="logo" src={item.icon_img} />
											<div class="content">{item.couponPrize}</div>
											<div class="chai" onClick={() => this.handlOpen(item, index)}>
												{!item.openBagStatus ? '拆' : '已拆'}
											</div>
										</div>
									</div>
								})
							}
						</div> : <div class="swiper-wrapper" id="moveBox">
								{
									this.state.backClass.map((item, index) => {
										return <div class={index === this.state.currentId ? 'li swiper-slide swiper-slide-active' : 'li swiper-slide'} key={index}>
											<div class="li1">
												<img class="logo" src={item.icon_img} />
												<div class="content">{item.couponPrize}</div>
												<div class="chai" onClick={() => this.handlOpen(item, index)}>
													{!item.openBagStatus ? '拆' : '已拆'}
												</div>
											</div>
										</div>
									})
								}
							</div>
					}
				</div>
				{!this.state.showPop ? <div style={{ display: 'none' }}></div> : <div class="bg" >
					<div class="lucky-bag-bottom">
						<div class="header">
							<div class="title">完成以下任务，开红包</div>
							<img onClick={() => this.handleclose()} class="close" src={`${assets}image/close.png`} />
						</div>
						<div class="bottom-content line">
							<div class="bottom-detail">
								{this.state.openItem.task1Type === 'member' ? <img class="shop" src={`${assets}image/icon-ruhui.png`} /> : (this.state.openItem.task1Type === 'follow' ? <img class="shop" src={`${assets}image/icon-liulan.png`} /> : <img class="shop" src={`${assets}image/star.png`} />)}
								<div >
									{this.state.openItem.task1Type === 'member' ? '完成店铺入会' : (this.state.openItem.task1Type === 'follow' ? "关注店铺" : "浏览店铺")}
								</div>
								{
									!(this.state.taskStatus.done || this.state.taskStatus.isMember) ? <img class="button" onClick={() => this.handleTask({ taskId: this.state.openItem.id, taskType: this.state.openItem.task1Type, sellerId: this.state.openItem.sellerId, url: this.state.openItem.task1Url })} src={`${assets}image/button2.png`} /> :
										<img class="button" src={`${assets}image/icon-button.png`} />
								}
							</div>
						</div>
						<div class="bottom-content">
							<div class="bottom-detail">
								{this.state.openItem.task2Type === 'member' ? <img class="shop" src={`${assets}image/icon-ruhui.png`} /> : (this.state.openItem.task2Type === 'follow' ? <img class="shop" src={`${assets}image/icon-liulan.png`} /> : <img class="shop" src={`${assets}image/star.png`} />)}
								<div >
									{this.state.openItem.task2Type === 'member' ? '完成店铺入会' : (this.state.openItem.task2Type === 'follow' ? "关注店铺" : "浏览店铺")}
								</div>
								{
									!(this.state.secondTaskStatus.done || this.state.secondTaskStatus.isMember) ? <img class="button" onClick={() => this.handleTask({ taskId: this.state.openItem.id, taskType: this.state.openItem.task2Type, sellerId: this.state.openItem.sellerId, url: this.state.openItem.task2Url })} src={`${assets}image/button2.png`} /> :
										<img class="button" src={`${assets}image/icon-button.png`} />
								}
							</div>
						</div>
					</div>
				</div>}

			</div>
		);
	}
	jumpMyDraw() {
		trackerClk("RECORD")
		pushWindow(data.config.my_draw)
	}
	handleclose() {
		trackerClk("POPUP_CLOSE")
		this.setState({
			showPop: false,
		})
	}
	handleTask(item) {
		trackerClk(item.taskType == 'goshop' ? 'POPUP_GO_SHOP' : 'POPUP_GO_TASK', { sellerId: item.sellerId })
		goTask(item)
		/*this.setState({
			showPop: false
		})*/
	}
	//拆福袋
	handlOpen(item, index) {
		console.log(123131231312)
		if (index != this.state.currentId) return
		trackerClk('OPEN_BAG', { sellerId: item.sellerId })
		const data = {
			sellerId: item.sellerId,
			taskType: item.task1Type
		}
		const data2 = {
			sellerId: item.sellerId,
			taskType: item.task2Type
		}
		let taskStatus
		let secondTaskStatus
		getTaskStatus(data)
			.then((res) => {
				taskStatus = res
				if (item.task2Type && item.task2Type != 'none') {
					return getTaskStatus(data2)
				} else {
					return {}
				}
			}).then((res) => {
				secondTaskStatus = res
				this.setState({
					taskStatus,
					secondTaskStatus
				})
				//两个任务都已经完成（或已经是会员了） 直接拆福袋 不显示任务列表
				if ((taskStatus.done || taskStatus.isMember)
					&& (secondTaskStatus.done || secondTaskStatus.isMember)) {
					openBag(item);
					this.setState({
						showPop: false
					})
				} else { // 还有任务没完成
					if (item.task1Type && item.task2Type && item.task2Type != 'none' && item.task1Type != 'none') { //两个任务都存在
						this.setState({
							showPop: true,
							openItem: item
						}, () => {
							trackerClk('POPUP_SHOW_TASK', { sellerId: item.sellerId })
						})
					} else if (item.task1Type && item.task1Type != 'none') { //只有任务1
						if ((taskStatus.done || taskStatus.isMember)) {//已完成
							openBag(item);
						}
						else goTask({ taskId: item.id, taskType: item.task1Type, sellerId: item.sellerId, url: item.task1Url })
					} else if (item.task2Type && item.task2Type != 'none') { //只有任务2
						if ((secondTaskStatus.done || secondTaskStatus.isMember)) {//已完成
							openBag(item);
						}
						else goTask({ taskId: item.id, taskType: item.task2Type, sellerId: item.sellerId, url: item.task2Url })
					}
				}
			})
	}
	//触摸开始
	boxTouchStart = (e) => {
		const movebox = document.getElementById("moveBox"); //滑动对象
		const touch = e.touches[0]; //获取触摸对象
		startX = touch.pageX; //获取触摸坐标
		startY = touch.pageY; //获取触摸坐标
		printEndX = parseInt(movebox.style.transform.replace("translate3d(", "")); //获取每次触摸时滑动对象X轴的偏移值
	}
	boxTouchMove = (e) => {
		const movebox = document.getElementById("moveBox"); //滑动对象
		const touch = e.touches[0];
		moveX = touch.pageX - startX; //手指水平方向移动的距离
		if (cout == 0 && moveX > 0) {  //刚开始第一次向左滑动时
			return false;
		}
		sumCount = this.state.backClass.length;
		if (cout == sumCount - 1 && moveX < 0) {  //滑动到最后继续向右滑动时
			return false;
		}
		// movebox.style.transform = "translate3d(" + (printEndX) + "px,0,0)"; //手指滑动时滑动对象随之滑动
	}
	boxTouchEnd = (e) => {
		const movebox = document.getElementById("moveBox"); //滑动对象
		const endx = e.changedTouches[0].pageX;
		const endy = e.changedTouches[0].pageY;
		sumCount = this.state.backClass.length;
		let direction = this.getDirection(startX, startY, endx, endy);
		switch (direction) {
		  case 0:
			break;
		  case 1:
		     moveX = 0
			break;
		  case 2:
		     moveX = 0
			break;
		  case 3:
		  console.log("左边")
		    if (cout < sumCount - 1) {
				movebox.style.transitionDuration = "300ms";
				setTimeout(() => {
					movebox.style.transitionDuration = "0ms";
				}, 300);
				cout++;
				this.setState({
					currentId: cout
				})
				movebox.style.transform = "translate3d(" + (printEndX - (parseInt(144 * width / 375) + 10)) + "px,0,0)";
			}
			break;
		  case 4:
		  console.log("右边")
			if (cout == 0) {
				return false;
			} else {
				movebox.style.transitionDuration = "300ms";
				setTimeout(() => {
					movebox.style.transitionDuration = "0ms";
				}, 300);
				cout--;
				this.setState({
					currentId: cout
				})
				movebox.style.transform = "translate3d(" + (printEndX + parseInt(144 * width / 375) + 10) + "px,0,0)";
			}
			break;
		  default:
		}
		moveX = 0;
	}
	//将已拆完红包排在后面
	sortBy(property) {
		return function (a, b) {
			var value1 = a[property];
			var value2 = b[property];
			return value1 - value2;
		}
	}
	getDirection = (startx, starty, endx, endy)=>{
		const angx = endx - startx;
		const angy = endy - starty;
		let result = 0;
		//如果滑动距离太短
		if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
		  return result;
		}
		const angle = Math.atan2(angy, angx) * 180 / Math.PI;
		if (angle >= -135 && angle <= -45) {
		  result = 1;
		} else if (angle > 45 && angle < 135) {
		  result = 2;
		} else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
		  result = 3;
		} else if (angle >= -45 && angle <= 45) {
		  result = 4;
		}
		return result;
	}
}
