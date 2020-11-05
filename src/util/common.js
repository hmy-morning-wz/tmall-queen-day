import React from  'zebra-isv-base/libs/preact';
import { navigation,goldlog,localStorage,mtop } from 'zebra-isv-base'
import {TRACKER_ID} from '../constant'
import {Base64} from "./base64" 
const DEBUG = data.config.debug==='ON'
//跳转
var loadTime 
const LINK_TYPE=[
  {k:"${money}",v:"https://money.allcitygo.com"},
  {k:"${operation}",v:"https://operation.allcitygo.com"},
  {k:"${sit-operation}",v:"https://sit-operation.allcitygo.com"},
  {k:"${detail}",v:"https://detail.tmall.com"}]

export const pushWindow = ({link,link_type,name,id},showLoading=true) =>{
    let url = link
    if(link && link.indexOf('http')!=0){
        if(link_type==='ALLCITYGO1'){
            url = "https://money.allcitygo.com"+link
        }
        else if(link_type==='ALLCITYGO2'){
            url = "https://operation.allcitygo.com"+link
        }else if(link_type==='ALLCITYGO3'){
            url = "https://sit-operation.allcitygo.com"+link
        }else if(link_type==='detail.tmall'){
            url = "https://detail.tmall.com"+link
        }else {
          let replace = false
          LINK_TYPE.forEach((t)=>{
            if((!replace) && link.indexOf(t.k) >-1 ) {
              url =  link.replace(t.k,t.v)
              replace = true
            }
          })
          if((!replace) &&/^[A-Za-z\d+/]*([A-Za-z\d+/][A-Za-z\d+/=]|==)$/.test(link))
          {
            url = Base64.decode(link)
          }
         
        }
        //https://detail.tmall.com/item.htm?id=566446518116
    }
    let stay_time = (+Date.now()) - loadTime
    let p = {url,stay_time,name,id}   
    trackerClk("PUSH_WINDOW",p)
    url && navigation.pushWindow(url)
    showLoading && showPopup.showLoading && (showPopup.showLoading('跳转中'),setTimeout(()=>{showPopup.hideLoading() },3000))
}

export function dateFormat(t, format) {
  var fmt = format || 'yyyy-MM-dd hh:mm:ss.S'
  if (typeof t !== 'object') {
    t = new Date(t)
  }
  var o = {
    'M+': t.getMonth() + 1, //月份
    'd+': t.getDate(), //日
    'h+': t.getHours(), //小时
    'm+': t.getMinutes(), //分
    's+': t.getSeconds(), //秒
    'q+': Math.floor((t.getMonth() + 3) / 3), //季度
    S: t.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (t.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

export const today = dateFormat(Date.now(), 'yyyy-MM-dd')
const urlParams = navigation.getUrlParams()
const  trackerData= {}
let userNumId = localStorage.getItem('userNumId')  || 0
userNumId && (trackerData.userNumId = userNumId)
export const trackerUser= (user)=>{
  Object.assign(trackerData,user)
  localStorage.setItem('userNumId',user && user.userNumId) 
}
const GOLDLOG_KEY = '/alipay-huichang.lscxr2003.'+ "QUEEN-"
//isFirst，bizScenario，shellerId，countOfAllDraw，countOfDayDraw，countOfTaskFinished
export const trackerClk =(seed,param1 = {})=>{
    let param = {}
    Object.assign(param,param1)
    Object.assign(param,trackerData)
    Object.assign(param,urlParams)
    param.seedName=TRACKER_ID[seed]
    let p =  qs.stringify(param)
    let seed1 = seed
    let seed2 = seed+'-sellerId-'+(param.sellerId)
    let seed3 = seed+'-bizScenario-'+(param.bizScenario)
    goldlog.record(GOLDLOG_KEY+seed1, 'CLK',p )
    param.sellerId && goldlog.record(GOLDLOG_KEY+seed2, 'CLK',p )
    goldlog.record(GOLDLOG_KEY+seed3, 'CLK',p )
    DEBUG && console.log('trackerCLK.'+param.seedName,seed,param,p) 
}

export const trackerExp =(seed,param1 = {})=>{
    let param = {}
    Object.assign(param,param1)
    Object.assign(param,trackerData)
    Object.assign(param,urlParams)
    param.seedName=TRACKER_ID[seed] || seed
    let p =  qs.stringify(param) 
    let seed1 = seed
    let seed2 = seed+'-sellerId-'+(param.sellerId)
    let seed3 = seed+'-bizScenario-'+(param.bizScenario)
    goldlog.record(GOLDLOG_KEY+seed1, 'EXP',p )
    param.sellerId && goldlog.record(GOLDLOG_KEY+seed2, 'EXP',p )
    goldlog.record(GOLDLOG_KEY+seed3, 'EXP',p )
    DEBUG && console.log('trackerEXP.'+param.seedName,seed,param,p)
}

export const trackerPageLoad =()=>{
    loadTime = +Date.now()
    trackerExp('LOAD',{version:__version__,loadTime})  
}

export const qs = {
    parse: function(str) {
      if (!str || str.length == 0) return {}
      let list = str.split('&')
      if (!list || list.length == 0) return {}
      let out = {}
      for (let index = 0; index < list.length; index++) {
        let set = list[index].split('=')
        set && set.length > 1 && (out[set[0]] = decodeURIComponent(set[1]))
      }
      return out
    },
    stringify: function(data) {
      if (!data) return ''
      let list = []
      for (let key in data) {
        if (data[key] instanceof Array && data[key].length) {
          data[key].forEach(t => {
            list.push(key + '=' + encodeURIComponent(t))
          })
        }
        else {
          list.push(key + '=' + encodeURIComponent(data[key]))
        }
      }
      return list.join('&')
    }
  }
  export function makeUrl(url, data){
    let index = url && url.indexOf('?')
    return index && index > -1 ? url + "&" + qs.stringify(data) : url + "?" + qs.stringify(data)
  }
//iPhone、乘车红包、生活缴费红包、现金红包、商品优惠券
export const IPHONE =  "IPHONE"
export const BUS_RED_PACKET = "BUS_RED_PACKET"
export const LIFE_PAY_RED_PACKET = "LIFE_PAY_RED_PACKET"
export const CASH_RED_PACKET = "CASH_RED_PACKET"
export const GOODS_COUPON = "GOODS_COUPON"
export const NONE =  "NONE"



export const showPopup = {}



export function updateDrawCount(res2){
  console.log('updateDrawCount',res2)
  let count2 = +res2.count    
  let  leftCount2 = res2.leftCount
  localStorage.setItem(today+'leftCount2',leftCount2)

  let countOfDay =0// + (localStorage.getItem(today+'countOfDayDraw')  || 0)
  let countOfAllDraw = + (localStorage.getItem('countOfAllDraw')  || 0)
  if(countOfAllDraw<count2) {
      localStorage.setItem('countOfAllDraw',count2+1)
  }
  //if(countOfDay<=count2)
  {
  countOfDay = count2
  localStorage.setItem(today+'countOfDayDraw',countOfDay)
  }
  let addcount = +res2.addcount
  let  countOfTaskFinished =0//  +(localStorage.getItem('countOfTaskFinished') || 0)
  //if(countOfTaskFinished<=(addcount)) 
  {
      countOfTaskFinished = addcount
      localStorage.setItem(today+'countOfTaskFinished',countOfTaskFinished)
  }
  /*
  if(countOfTaskFinished<=(count2-1)) {
      countOfTaskFinished = count2-1
      localStorage.setItem(today+'countOfTaskFinished',countOfTaskFinished)
  }*/
  return countOfDay
}

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
const app = {
  $events:{},
  Tracker:{
    click:trackerClk
  }
}
export const my = {
  showToast:function({content,delay}){
  console.log("my.showToast")
  const box = document.getElementById('box') 
  React.render( <Toast content={content}  />, box)
  //am-toast
  setTimeout(()=>{
    const toast = document.getElementsByClassName('am-toast')
    toast &&toast[0] && box.removeChild(toast[0])
  },delay||3000)
 
},
showLoading:function({content}){
  console.log("my.showToast")
  const box = document.getElementById('box')
  React.render( <Loading content={content}  />, box)
},
hideLoading:function(){
  const box = document.getElementById('box') 
  const toast = document.getElementsByClassName('am-toast')
  toast &&toast[0] && box.removeChild(toast[0])
},
navigateTo:function({url}){//url
  console.log("my.navigateTo")
  pushWindow({link:url})
},
follow:function(){
  return new Promise((resolve, reject)=>{reject(new Error("not implement"))})
},
bind:function(){
  return new Promise((resolve, reject)=>{reject(new Error("not implement"))})
}
/*
emit:function(e){
  let events = app.$events[key] || []
  events.forEach((cb)=>{cb(e)}) 
},
on:function(key,cb){
  let events = app.$events[key] || []
  events.push[cb]
  app.$events[key] = event
},
off:function(key,cb){
  let events = app.$events[key] || []
  if(typeof cb==='function'){
  let index = events.indexOf(cb)
  if(index>-1) {
    events.splice(index,1)
  }
 }if(typeof cb==='number') {
  if(cb>-1 && cb <events.length) {
    events.splice(cb,1)
  }
 }
 else {
  events = []
 }
  app.$events[key] = events
}*/

}
export function PromiseMap(array) {
  return  new Promise((resolve, reject) => {
    if(array && array.length==0 || array===undefined) {
       reject( {success:false,data: {msg:"array length == 0"}} )
       return 
    }
    let result=new Array(array.length);
    let count = 0;  
    array.forEach((p,index)=>{
      //console.log("PromiseMap each",index)
      let timerId = setTimeout(()=>{ 
        result[index] = {success:false,data: {msg:"timeout"}}  
        count ++
        if(count==array.length) {
          console.log("PromiseMap resolve timeout",index)
          resolve(result)
        }
      },3000)
      p.then((res)=>{
        clearTimeout(timerId)
        result[index] = {success:true,data: res}
        count ++
        if(count==array.length) {
          //console.log("PromiseMap resolve",index)
          resolve(result)
        }
      }).catch((err)=>{  
        clearTimeout(timerId)    
        result[index] = {success:false,data: err}  
        count ++
        if(count==array.length) {
          console.log("PromiseMap resolve err",index)
          resolve(result)
        }
      })
    }) 

  })
}
export function isMember ({sellerId}){
  return  new Promise((resolve, reject) => {
   let checkMember = localStorage.getItem('isMember'+sellerId) 
   let bindError = +(localStorage.getItem('bindError'+sellerId)  || 0)
   if(checkMember) {
      console.log("isMember localStorage true",sellerId)
      return  resolve({isMember:true,bindError,sellerId})
   }
   mtop('mtop.taobao.seattle.memberinfo.get', {sellerId}, { needSignIn: true }).then((result) => {
       console.log('memberinfo.get',result)  
       let data = result && result.data && result.data.result &&  result.data.result
       let isMember =data.isMember=='true'
       let buyerNick =data.buyerNick
       //let cardCover =data.cardCover
       let mobile =data.mobile
       if(isMember){
           localStorage.setItem('isMember'+sellerId,isMember) 
       }
       resolve({isMember,bindError,mobile,buyerNick,sellerId})
   },(err)=>{
       console.log("mtop memberinfo.get err",err)
       resolve({isMember:true,mobile:null,buyerNick:null,sellerId,bindError})
      // reject(err)
   })
   })
}


export function isFollow ({sellerId}){
  return  new Promise((resolve, reject) => {
   let checkMember = localStorage.getItem('isFollow'+sellerId) 
   let bindError = +(localStorage.getItem('followError'+sellerId)  || 0)
   if(checkMember) {
      console.log("isFollow localStorage true",sellerId)
      return  resolve({isFollow:true,bindError,sellerId})
   }
   mtop('mtop.tmall.retail.storefollow.info.get',  {query:`type=tb&id=${sellerId}&r=false&img=&back=null&pts=1564979196718&hash=A9674CCC6694A869FCC522F2B1941FBD&spm=a21123.12268209.1.d1`}, { needSignIn: true }).then((result) => {
       console.log('memberinfo.get',result)  
       let data1 = result && result.data && result.data.result      
       let isFollow =data1.items[0].status=='true'          
       if(isFollow){
           localStorage.setItem('isFollow'+sellerId,isFollow) 
       }
       resolve({isFollow,bindError,sellerId})
   },(err)=>{
       console.log("mtop memberinfo.get err",err)
       resolve({isFollow:true,mobile:null,buyerNick:null,sellerId,bindError})
      // reject(err)
   })
   })
}

export function getApp() {
    return app
}

export const store = {
  on:function on(key,fn){
    app.$events[key]=fn
  },
  update:function update(key ,data){
   let fn =  app.$events[key]
   if(fn) {
    fn(data)
   }
  },
}