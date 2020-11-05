## 关于 u2202577470990-tmall-queen-day

* [千叶模块开发指南](https://pages.tmall.com/wow/heihe/act/isv-demo)

如需 typescript 支持，将 src/index.js 改为 src/index.ts，重启编辑器后生效。


### 千叶测试发布地址
https://pages.tmall.com/wow/pegasus/test-site/739630/5V693t



### 做任务
import {goTask,openBag,hasOpenBag,updateLuckyBagStatus,getTaskStatus,completeTaskStatus} from "./util/luckyBag"  
#### 去做任务
goTask
#### 拆福袋
openBag
#### 是否福袋已开启（查询状态）
hasOpenBag
#### 更新福袋开启（更新状态）
updateLuckyBagStatus
#### 是否任务已完成（查询状态）
getTaskStatus
#### 更新完成任务（更新状态）
completeTaskStatus

import {isMember,isFollow} from "./util/common"  

### 是否已经是会员
isMember

### 是否已经是关注
isFollow


福袋列表 -> 查询是否福袋已开启（hasOpenBag）  
任务列表 -> 查询是否任务已完成（getTaskStatus）,全部完成的拆福袋（openBag） 
去做任务 -> 做任务(goTask) 

 openBag({   
    "bannnerUrl": "https://www.taobao.com",
  "image": "https://img.alicdn.com/imgextra/i2/2202577470990/O1CN01AYMdq41JBSfXyXTxT_!!2202577470990-2-fans.png",
  "task2Type": "goshop",
  "shopUrl": "https://www.taobao.com",
  "draw2Id": "2",
  "draw1Id": "1",
  "sellerId": "92686194",
  "icon_img": "https://gw.alicdn.com/tfs/TB1Az7iXG5s3KVjSZFNXXcD3FXa-350-150.png",
  "bgImage":"https://gw.alicdn.com/tfs/TB1Az7iXG5s3KVjSZFNXXcD3FXa-350-150.png",
  "notice":"完成入会获得奖励",
  "couponPrize": "乘车红包",
  "task1Type": "member",
  "_TAG": null,
  "name": "飞利浦",
  "id": "92686194",
  "task1Url": "https://www.taobao.com",
  "task2Url": "https://www.taobao.com"}).then((res)=>{
    console.log('openBag',res)
  })

goTask({taskId:'92686194',taskType:'member',sellerId:'92686194',url:''})
goTask({taskId:'92686194',taskType:'goshop',sellerId:'92686194',url:'https://www.taobao.com'})
