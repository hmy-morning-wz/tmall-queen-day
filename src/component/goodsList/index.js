import React from 'zebra-isv-base/libs/preact';
import { navigation, mtop, simpleDraw } from 'zebra-isv-base'
import './style.less'
import { pushWindow ,trackerClk} from '../../util/common'
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'

export default class goodsList extends React.Component {
	state = {}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	render() {
		const { showArea3, showArea2, showArea1, areaName1, areaName2, areaName3, flashSaleList, mustBuyList, brandList, brandGoodsList, footMarker } = data.config
		// 解析数组
		const createArray = (arr) => {
			let result = []
			for(let i=0; i<arr.length; i++){
				result.push(arr[i])
			}
			return result
		}

		const handleMiaosha = (config) => {
			let array = []
			let now = new Date().getTime()
			config.forEach(item => {
				let s = ''
				let e = ''
				s = Date.parse(item.startTime)
				e = Date.parse(item.endTime)
				let start = new Date(s).getTime()
				let end = new Date(e).getTime()
				let state = 1
				let percent = 1
				if (now < start) {
					state = 1
					percent = 1
				} else if (now > end) {
					state = 3
					percent = 0
				} else {
					state = 2
					percent = (end - now) / (end - start)
				}
				const obj = {
					image: item.icon_img,
					state: state,
					percent: percent,
					goodsName: item.goodsName,
					adTxt: item.adTxt,
					price: item.price,
					goodsLink: item.goodsLink,
					link_type: item.link_type,
				}
				array.push(obj)
			})
			return array
		}

		const handleBrand = (config) => {
			let brandList = config.brand_list || []
			let brandGoodsList = config.brand_goods_list || []
			let result = []
			brandList.forEach(item => {
				let obj = {
					brandLink: item.brandLink,
					brandPic: item.icon_img,
					brandName: item.brandName,
					link_type: item.link_type,
					goodsList: []
				}
				let arr = []
				brandGoodsList.forEach(good => {
					if (good.brandName === item.brandName) {
						arr.push(good)
					}
				})
				obj.goodsList = arr
				result.push(obj)
			})
			return result
		}

		let flashSale_list = createArray(flashSaleList)
		let must_buy_list = createArray(mustBuyList)
		let brand_goods_list = createArray(brandGoodsList)
		let brand_list = createArray(brandList)
		let flashSaleArr = handleMiaosha(flashSale_list)
		let brandAreaList = handleBrand({ brand_goods_list, brand_list })

		console.log(must_buy_list, brandAreaList, flashSaleArr,'jyuyuyyyyyyyyyyyyyyyyyy')


		const handleJump = (item,link,seed) => {
			// console.log(item,link)
		
			let {sellerId,goodsName,brandName}= item
			trackerClk(seed,{sellerId,name:goodsName||brandName,url:link})
			let param = {
				link: link,
				link_type: item.link_type,
				name: goodsName||brandName,
				id:sellerId
			}
			pushWindow(param)
		}

		return (
			<div class="containDiv">
				{
					(showArea1 === "true" || showArea1 === true) &&
					<div class="miaosha">
						<div class="zhuanquTit">
							{ areaName1 }
						</div>
						<div class="miaoshaList">
							{
								flashSaleArr.map((item, idx) => {
									return (
										<div key={idx} class="eachFlash" onClick={() => handleJump(item,item.goodsLink,'FLASH_SALE')}>
											<div class="padding14">
												<div class="goodsPic">
													<img src={item.image}/>
												</div>
												<div class="stateTxt">
													{
														item.state == 1 &&
														<div>秒杀未开始</div>
													}
													{
														item.state == 2 &&
														<div>距秒杀结束</div>
													}
													{
														item.state == 3 &&
														<div>秒杀结束</div>
													}
												</div>
												<div class="progressBar" style={{ backgroundImage: item.percent <= 0.15 ? `linear-gradient(to right, #FF6D83 ${item.percent * 100}%, #FFB5C0 ${item.percent * 100}%)` : ''}}>
													{
														item.percent > 0.15 &&
														<div class="forppx" style={{width:`${149 * (item.percent) / 7.5}vw`}}>
														</div>
													}
												</div>
											</div>
											<div class="grayLine"></div>
											<div class="padding14">
												<div class="goodsName">
													{item.goodsName}
												</div>
												<div class="adTxtt">
													{item.adTxt}
												</div>
												<div class="bottom">
													<div>￥{item.price}</div>
													<div class="goBtn">
														<div>抢</div>
														<img src={`${assets}image/jiantou.png`} />
													</div>
												</div>
											</div>
										</div>
									)
								})
							}
						</div>
					</div>
				}
				{
					(showArea2 === "true" || showArea2 === true) &&					
					<div class="bimai">
						<div class="zhuanquTit">
							{areaName2}
						</div>
						<div class="bimaiList">
							{
								must_buy_list.map((item, idx) => {
									return (
										<div key={idx} class="eachItem" onClick={() => handleJump(item,item.link,'MUST_BUY')}>
											<div class="itemImage">
												<img src={item.image} />
											</div>
											<div class="itemName">
												{item.goodsName}
											</div>
											<div class="botPrice">
												<div class="salePrice">
													￥{item.salePrice}
												</div>
												<div class="originPrice">
													￥{item.originPrice}
												</div>
											</div>
										</div>
									)
								})
							}
						</div>
					</div>
				}
				{
					(showArea3 === "true" || showArea3 === true) &&		
					<div class="pinpai">
						<div class="zhuanquTit">
							{areaName3}
						</div>
						<div class="pinpaiList">
							{
								brandAreaList.map((item, idx) => {
									return (
										<div class="eachPinpai" key={idx}>
											<div class="brandPic" onClick={() => handleJump(item,item.brandLink,'BAND_NAME')}>
												<img src={item.brandPic}/>
											</div>
											{
												item.goodsList.map((goods, idx2) => {
													return (
														<div class="brandGoods" onClick={() => handleJump(goods,goods.goodsLink,'BAND_GOODS')}>
															<div class="goodsName">{goods.goodsName}</div>
															<div class="adTxtt">{goods.adTxt}</div>
															<div class="goodImage">
																<img src={goods.icon_img}/>
															</div>
														</div>
													)
												})
											}
										</div>
									)
								})
							}
						</div>
					</div>
				}
				{/* {
					(show_good_list === "true" || show_good_list === true) &&
					<div class="goodsPart">
						<div class="bgTitle">{goods_list_title}</div>
						<div class="goodsList">
							{
								goods_result.map((item, idx) => {
									return (
										// <div key={idx} onClick={() => handleJump(item)} class="eachMerchandise" style={`background: url(${item.image}) no-repeat;background-size: 100% 100%;`}>
										// </div>
										<div class="goodsGroup" key={idx}>
											{
												item.map((group, idx2) => {
													return (
														<div class="oneEighth" key={idx2} onClick={() => handleJump(group)} style={`background: url(${group.image}) no-repeat;background-size: 100% 100%;`}>
														</div>
													)
												})
											}
										</div>
									)
								})
							}
						</div>
					</div>
				} */}
				{/* {
					bottom_banner.image &&
					<div class="bottomBanner" onClick={() => handleJump(bottom_banner)} style={`background: url(${bottom_banner.image}) no-repeat;background-size: 100% 100%;`}>
					</div>
				} */}
				<div class="footMarker">{footMarker}</div>
			</div>);
	}
}
