import React from  'zebra-isv-base/libs/preact';
import {isMember,isFollow,trackerClk,trackerExp,PromiseMap,my,store} from "./common"  
import { like,simpleDraw,navigation ,localStorage} from 'zebra-isv-base'
import Bind from "../component/bind"
import Follow from "../component/follow"
import DrawResult2 from "../component/drawResult2"
const mock = false


export function getBagData({sellerId}){
  let {backClass} =  data.config 
  for(let i=0;i<backClass.length;i++){
    let t = backClass[i]
    if( t.sellerId===sellerId) return t
  }
  return {}
}


my.bind=function(data){
  let bagData = getBagData(data)
  return new Promise((resolve, reject)=>{
    const box = document.getElementById('box')
    React.render( <Bind data={data} bagData={bagData}  resolve={resolve} reject={reject} />, box)
  })
 
}
my.hideBind=function(){
  console.log("hideBind")
  const box = document.getElementById('box') 
  const mask = document.getElementsByClassName('bind-mask')
  mask &&mask[0] && box.removeChild(mask[0])
}
my.follow=function(data){
  let bagData = getBagData(data)
  return new Promise((resolve, reject)=>{
    const box = document.getElementById('box')
    React.render( <Follow data={data} bagData={bagData} resolve={resolve}  reject={reject} />, box)
  })
 
}
my.hideFollow=function(){
  console.log("hideFollow")
  const box = document.getElementById('box') 
  const mask = document.getElementsByClassName('follow-mask')
  mask &&mask[0] && box.removeChild(mask[0])
}

my.showResult = function(data){
  const box = document.getElementById('box')
  React.render( <DrawResult2 data={data}  />, box)
}
my.hideResult=function(){
  const box = document.getElementById('box') 
  const mask = document.getElementsByClassName('drawresult2-mask')
  mask &&mask[0] && box.removeChild(mask[0])
  openBagList()
}

function checkDrawResult(res,resolve){
  // 抽奖成功
  //"benefitType": "dPromotion",
  //"benefitType":"physicalPrize"
  /*
  {"drawResult":{"msgCode":"LATOUR2-STRATEGY-09","msgMsg":"投放计划状态不可发放|自测验证未通过","win":"false"},"lotteryCount":{"addcount":"1","count":"3","leftCount":"98","maxAddCount":"100","maxCount":"100"}}
  */
  /*
  {"drawResult":{
      "data":{"benefitCode":"4c988a4139014a99a474ba777ebcd4e4","benefitId":"127484786","benefitPoolId":"23792001","benefitTitle":"iphone11","benefitType":"physicalPrize","benefitTypeName":"虚拟奖品","extraData":{},"issueTime":"2019-10-10 16:30:30","lowestPriceStrategy":"INCLUDE","material":{},"outerInstanceId":"2004442407312","recordId":"2004442407312","subBenefitSendResultList":[],"trackingData":{},"userId":"791977274","userNick":"louis林新华","userType":"uic"},
      "win":"true"
  },
  "lotteryCount":{"addcount":"1","count":"4","leftCount":"97","maxAddCount":"100","maxCount":"100"}}
  
  */
 let {win,msgMsg} = res && res.drawResult || {}
 if(win===true || win==="true"){
 let drawResultData =(res && res.drawResult && res.drawResult.data) || {} 
 let {benefitType,userId,userNick,benefitTitle,displayAmount,displayAmountUnit,extraData} =  drawResultData
 let {primaryContent,shopLogo,shopName,sellerId} = extraData||{}
 /*
  "IPHONE",
  "RED_PACKET",
  "COUPON",
  "NONE"
 */
/*fpRedEnvelope ("现金红包"）
interactCoupon ("店铺优惠券"）
interactItemCoupon ("商品优惠券"）
dPromotion("定向优惠", ）
mouCommonFpRedEnvelope("商家现金红包"） */
let type = 'NONE'
if(benefitType==='physicalPrize'){
 type = 'PHONE'
}else if(benefitType==='fpRedEnvelope'){//"现金红包"
 type = 'CASH_RED_PACKET'
}else if(benefitType==='interactCoupon'){//"商品优惠券"
 type = 'GOODS_COUPON'
}else if(benefitType==='alipayCoupon'){ //支付宝红包       
 if(benefitTitle.indexOf('出行红包')!=-1)
   type = 'BUS_RED_PACKET'
 else if(benefitTitle.indexOf('现金红包')!=-1)
   type = 'CASH_RED_PACKET'         
 else  if(benefitTitle.indexOf('缴费红包')!=-1) {
   type = 'LIFE_PAY_RED_PACKET'
 }else  if(benefitTitle.indexOf('优惠券')!=-1) {
     type = 'GOODS_COUPON'
 }else {
     type = 'CASH_RED_PACKET'
 }
}
console.log("drawResult win",benefitTitle,benefitType)
 resolve({
   win:true,
   msg:"SUCCESS", 
   data:{
     coupon:{sellerId,displayAmount,displayAmountUnit,benefitTitle,primaryContent,shopLogo,shopName},
     userId,userNick,benefitType,benefitTitle,type,money:displayAmount
    }
  }) //if 抽奖成功
 }else {
     console.log("drawResult none",msgMsg)           
     //showPopup.showToast(msgMsg)  
     resolve({win:false,msg:msgMsg,data:{type:"NONE",money:"0"}})
 }
}

function fetchStatus(contentId){  
 return new Promise((resolve, reject) => {  
   let checkLike = localStorage.getItem("like-"+contentId)     
    if(checkLike)  {
      console.log("checkLike localStorage ",contentId,checkLike)
      resolve({isLiked:true})
    }else {
      like.fetchStatus(contentId).then(({ count, isLiked }) => {
        console.log('fetchStatus',contentId,count,isLiked) 
        resolve({count, isLiked})
      })  
    }
})
}

//#### 是否福袋已开启（状态）
export  function hasOpenBag(data){
  // console.log('hasOpenBag',data) 
  let contentId = "BAG-"+data.sellerId
  return fetchStatus(contentId).then(({ isLiked }) => {
    console.log('hasOpenBag',contentId,isLiked) 
    return {done:isLiked}
  })  

}
//#### 更新福袋开启（状态）
export function updateLuckyBagStatus(data){
  let contentId = "BAG-"+data.sellerId
  return like.addLike(contentId).then(({  isLiked }) => {
    console.log('addLike',contentId,isLiked) 
    localStorage.setItem("like-"+contentId,1) 
    return {done:isLiked}
  })
}
//#### 是否任务已完成（状态）
export function getTaskStatus(data){
  // console.log('getTaskStatus',data) 
  let contentId = "TASK-"+data.taskType+'-'+data.sellerId
  if(data.taskType==='member') {
    let member
    return isMember(data)
    .then(({isMember})=>{
      member = isMember
      return fetchStatus(contentId)
    }).then(({  isLiked }) => {
      console.log('getTaskStatus',contentId,isLiked,member) 
      return { done:isLiked,isMember:member}
    })  
  }else if(data.taskType==='follow') {
    let member
    return isFollow(data)
    .then(({isFollow})=>{
      member= isFollow
      return fetchStatus(contentId)    
    }).then(({  isLiked }) => {
      console.log('getTaskStatus',contentId,isLiked,member) 
      return { done:isLiked,isMember:member}
    })  
  }else {
  return fetchStatus(contentId).then(({  isLiked }) => {
    console.log('getTaskStatus',contentId,isLiked) 
    return { done:isLiked,isMember:false}
  })  
}
}
//#### 更新完成任务（状态）
export function completeTaskStatus(data){
  let contentId = "TASK-"+data.taskType+'-'+data.sellerId
  // 增加奖励
  let actId= data.actId
  if(actId) {
    simpleDraw.updateLotteryCount({
    actId: actId,
  }).then((res)=>{
    //{addcount: "4", count: "39", maxCount: "100", maxAddCount: "100", leftCount: "65"}    
    console.log("simpleDraw updateLotteryCount",res)
  },(err)=>{
      console.log("updateLotteryCount",err)       
  })
  }

  return like.addLike(contentId).then(({isLiked}) => {
    console.log('addLike',contentId,isLiked) 
    localStorage.setItem("like-"+contentId,1) 
    return {done:isLiked}
  })
}
function draw({actId}){
  console.log("simpleDraw.draw",actId)
return new Promise((resolve, reject)=>{

  simpleDraw.updateLotteryCount({
    actId: actId,
  }).then((res)=>{
    //{addcount: "4", count: "39", maxCount: "100", maxAddCount: "100", leftCount: "65"}    
    console.log("simpleDraw updateLotteryCount",res)
    simpleDraw.draw({
      actId: actId,
    }).then((res)=>{
      console.log("simpleDraw.draw",res)
      checkDrawResult(res,resolve)
    },(err)=>{
      console.log("simpleDraw.draw err",err)
      //resolve({win:false})
      if(__isProduction__){
        let {res,message} = err || {}
        let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
        resolve({win:false,msg,data:{ type:"NONE",money:"0"}})
        return
        //reject(err)            
    }else
      {
        let luck = +Date.now()%5
        let type ='NONE'
        if(luck===0){
            type = 'CASH_RED_PACKET'
        }
        else if(luck===1){
            type = 'NONE'
        } else if(luck===2){
            type = 'LIFE_PAY_RED_PACKET'
        } else if(luck===3){
            type = 'BUS_RED_PACKET'
        }else {
            type = 'GOODS_COUPON'
        }    
        let coupon={
        "displayAmountUnit":"元",
        "displayAmount":"10",
        "benefitTitle":"宝洁优惠券",
        "primaryContent":"满199减10元",
        "shopLogo":"//img.alicdn.com//65/da/TB1lWMVJXXXXXXSXpXXSutbFXXX.jpg",
        "shopName":"宝洁官方旗舰店"}         
        console.log("mock type",type,coupon)
        resolve({win:type!="NONE",msg:"SUCCESS",data:{coupon,userId:'test',userNick:'testNick',type,money:"1"}})
    } 
    })  


  },(err)=>{
      console.log("updateLotteryCount",err)       
      resolve({win:false,msg:"fail",data:{ type:"NONE",money:"0"}})
  })

 
})
}
export function  openBag(data) {
  return new Promise((resolve, reject)=>{
    ///////////////////////////
let sellerId=data.sellerId;
let task=[]
if(data.task1Type && data.task1Type!='none') {
  task.push({sellerId,taskType:data.task1Type,drawId:data.draw1Id})
}
if(data.task2Type && data.task2Type!='none') {
  task.push({sellerId,taskType:data.task2Type,drawId:data.draw2Id})
}
if(task.length === 0 ) {
  return reject(new Error("没有任务"))
}
let drawResult={
  bag:data,
  result1:{},
  result2:{}
}
try{
getTaskStatus(task[0]) //1，判断任务1完成
.then((res)=>{
  if(!(res.done||res.isMember))  {
    //resolve({success:false,message:"任务1未完成"})
    throw new Error("任务1未完成")
  }
  res && (task[0].done = res.done,task[0].isMember = res.isMember)
  if(task.length>=2 && task[1]) {
    return getTaskStatus(task[1]) //1，判断任务2完成
  }else {
    return null //没有任务2
  }
}).then((res)=>{
  if(res && !(res.done||res.isMember)) {
    //resolve({success:false,message:"任务2未完成"})
    throw new Error("任务2未完成")
  } 
  res && (task[1].done = res.done,task[1].isMember = res.isMember)
  return hasOpenBag(data)//2，判断是否开启 
}).then((res)=>{
  if(res.done) {
    //resolve({success:false,message:"福袋已开启"})
    //my.showToast({content:"亲，你已经已开启过了"})
    throw new Error("福袋已开启")
  }
  if(task[0].done){
    my.showLoading({content:'加载中'})
  return draw({ //3，抽奖1
    actId: task[0].drawId,
  })
  } else {
  console.log("任务1未完成，不抽奖1",task[0])
  return {win:false}
 }
}).then((res)=>{
  drawResult.result1=res || {}
  if(task.length>=2 && task[1]  && task[1].done){
   // my.showLoading({content:'加载中'})
  return draw({ //3，抽奖2
    actId:  task[1].drawId,
  })
  }else {
    console.log("任务2未完成，不抽奖2",task[1])
    return {win:false}
  }
}).then((res=>{
  drawResult.result2=res|| {}
  drawResult.success = true //福袋开启成功
  updateLuckyBagStatus(data)
  trackerClk("UPDATE_BAG",data)
  my.showResult(drawResult)
  try{
  store.update("openBag",data.id)
}catch(err){
       
}
  my.hideLoading()
  return resolve(drawResult)
})).catch((err)=>{
  console.log('openBag break',err)
  my.hideLoading()
  reject(err)//异常
})
}catch(err){
  console.log('openBag error',err)
  my.hideLoading()
  reject(err)//异常
}
///////////////////////////
})
}

export function goTask(data){//{taskId:'xxx',taskType:'member',sellerId:xxxxx,url:xxx}
   console.log("goTask",data)
   let {taskId,taskType,sellerId,url} = data || {}
   if( (!sellerId) || !(taskId)) {
    console.log("goTask param need sellerId and taskId")
    my.showToast({         
          content: '系统开小差了，请稍后再试'
        })
    return
   }
  if(taskType==='goshop') {   
    if(url){
      
  //`&taskType=${taskType}&sellerId=${sellerId}&taskId=${taskId}`
  completeTaskStatus(data).then(({done})=>{
    trackerClk("UPDATE_SHOP_TASK",data)
    if(!done){
      my.showToast({         
      content: '系统开小差了，请稍后再试'
    })
   }  else {
     try{
    store.update('completeTask',data)
     }catch(err){

     }
    my.navigateTo({
      url: url
    });  
    }   
   })
    
    }else {
        console.log("goshop need url",url)
         my.showToast({         
          content: '系统开小差了，请稍后再试'
        })
    }
  } else if(taskType==='follow') //TMALL_FOLLOW_URL
  {
  // let url = common.makeUrl(TMALL_FOLLOW_URL[app.env],{followId:sellerId,userId:app.alipayId,taskType:taskType})
  // let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url) + `&taskType=${taskType}&sellerId=${sellerId}&taskId=${taskId}`
   my.follow(data)
   .then((res)=>{  
    completeTaskStatus(data).then(()=>{  
      trackerClk("UPDATE_FOLLOW_TASK",data)      
      openBag(getBagData(data))
      try{
      store.update('completeTask',data)
    }catch(err){
       
    }
     })
     my.hideFollow()
   }).catch((err)=>{
    console.log("follow catch",err)
    my.hideFollow()
   })
  
  }else  if(taskType==='member')
   {
  // let url = common.makeUrl(TMALL_MEMBER_URL[app.env],{taskId,sellerId,userId:app.alipayId,taskType:taskType})
  // let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url) + `&taskType=${taskType}&sellerId=${sellerId}&taskId=${taskId}`
    my.bind(data)
    .then((res)=>{  
      completeTaskStatus(data).then(()=>{   
        trackerClk("UPDATE_MEMBER_TASK",data)       
        openBag(getBagData(data))
        try{
        store.update('completeTask',data)
      }catch(err){
       
      }
       }) 
       my.hideBind()
    }).catch((err)=>{
      console.log("bind catch",err)
      my.hideBind()
     })
  }else {
    console.log("不支持的任务类型 （taskType 不是 goshop,follow,member）",taskType)
     my.showToast({         
          content: '系统开小差了，请稍后再试'
        })
  }
}
const openList = []
export function openBagList(){
    if(openList.length){
      let bag = openList.pop()
      bag && openBag(bag)
    }
}

export function getBackClass(){
  my.showLoading({content:"加载中..."}) 
  let {backClass} =  data.config 
  let all = []
  for(let i=0;i<backClass.length;i++){
    let p1=  new Promise((resolve, reject)=>{
    let t = backClass[i]
    let p=[]
    p.push(hasOpenBag(t) )  
    let {sellerId} = t
    if(t.task1Type) {
      p.push( getTaskStatus({sellerId,taskType:t.task1Type}))
    }
    if(t.task2Type) {
      p.push(getTaskStatus({sellerId,taskType:t.task2Type}))
    }
    PromiseMap(p).then((res)=>{
      console.log("PromiseMap",res)
      resolve({...t,
        openBagStatus:res[0].success ?res[0].data.done:false,
        task1:res[1].success ? res[1].data:{},
        task2:res[2].success ? res[2].data:{},
      })
    })
    })
    all.push(p1)
   
  }
  return PromiseMap(all).then((res)=>{    
    let ret = res.filter((t)=>{
       return t.success && (!(t.data.task1.isMember && !t.data.task1.done) && !(t.data.task2.isMember&&!t.data.task2.done))
    }).map((t)=>{
      trackerExp("BAG-"+t.data.sellerId)
      if(!t.data.openBagStatus){
        if( (t.data.task2.done &&t.data.task1.done ) ||(t.data.task1.done &&  t.data.task2Type=='none' ) || (t.data.task2.done &&  t.data.task1Type=='none')){     
          openList.push(t.data)
        }
      }
      return t.data
    }) 
    console.log("PromiseMap result ",res,ret)  
    my.hideLoading()
    if(openList.length) {
      console.log("openList",openList)  
      openBagList()
    }
    return ret
  })
} 
function removAllLike(){
  let {backClass} =  data.config 
  for(let i=0;i<backClass.length;i++){
    let t = backClass[i]
  
    let {sellerId} = t
    let contentId = "BAG-"+sellerId
    like.removeLike(contentId)
    localStorage.setItem("like-"+contentId,'')      
    localStorage.setItem('isFollow'+sellerId,'')
    localStorage.setItem('isMember'+sellerId,'')    
    if(t.task1Type) {
      let contentId = "TASK-"+t.task1Type+'-'+sellerId   
      like.removeLike(contentId)
      localStorage.setItem("like-"+contentId,'')      
    }
    if(t.task2Type) {
      let contentId = "TASK-"+t.task2Type+'-'+sellerId 
      like.removeLike(contentId)
      localStorage.setItem("like-"+contentId,'') 
    }
   
  }
}
const urlParams = navigation.getUrlParams()
if(urlParams.remove  && data.config.debug==='ON') { 
   removAllLike()
}


