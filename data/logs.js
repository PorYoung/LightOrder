let logs = [
  {
    "date": "10-19",
    "time": "8:49",
    "content": "foodSelected结构\n1.键名为foodId\n2.每个子对象包括:foodOrderId、categoryId,categoryOrderId"
  },
  {
    "date": "10-7",
    "time": "21:51",
    "content": "1.增加商家订餐页面\n2.目前未完成功能：\na.添加进购物车\nb.打开购物车\nc.立即订购\nd.评论结构设计及循环读取"
  },
  {
    "date": "10-6",
    "time": "0:00",
    "content": "修改完善已有页面，设计数据存储结构"
  },
  {
    "date": "10-5",
    "time": "00:00",
    "content": "协助后台工作"
  },
  {
    "date": "10-4",
    "time": "17:05",
    "content": "1.获取位置使用wgs84，查看位置使用chooseLocation\n2.将getLocation、getHistorySearch等放在index页面的onShow中，实现切换页面时更新\n3.将地址点击事件变更为tapToGetLocation，点击时能打开地图选取位置"
  },
  {
    "date": "10-4",
    "time": "21:33",
    "content": "1.新增search页面，用于显示search结果和进行search操作\n2.抽象出获取用户地理信息的方法，作为全局可以调用的方法，使用hasLocation作为判断标志，每个页面在加载时需要判断\n3.将search和index页面中有关search bar和商铺列表的样式提出作为公共样式村为canteenList.wxss，在pages目录下"
  },
  {
    "date": "10-4",
    "time": "19:44",
    "content": "1.完成首页商铺信息循环渲染，商铺信息数据来源/data/canteens.js\n2.修改餐厅部分的数据库结构设计，增加餐厅分类，营业时间，以及配送时间"
  },
  {
    "date": "10-4",
    "time": "11:39",
    "content": "1.设计首页商铺列表排版，存在可能排版混乱隐患——使用max-width控制text-overflow\n2.设计商铺显示的信息：商铺头像、商铺名称、商铺评分、商铺销售量、商铺地址、商铺公告、优惠即是否支持配送、营业状态"
  },
  {
    "date": "10-3",
    "time": "16:27",
    "content": "1.重新设置searchHistory结构，为数组，每个元素为字符串，即搜索名称，去掉搜索时间time字段"
  },
  {
    "date": "10-3",
    "time": "16:27",
    "content": "1.完成搜索建议\n2.页面使用container包裹，height为100%，当searchBoard展开，设置overflow为hidden，searchBoard的overflow为auto\n3.搜索建议的排序只按字符串匹配优先级过于简单\n4.searchBoard展开后如何返回需要再合理设计\n4.后续需要对searchSuggestion的内容分类，分成搜索链接和店铺链接",
    "images": ["/images/logs/warning.png"]
  },
  {
    "date": "10-3",
    "time": "9:32",
    "content": "1.search框聚焦后展开searboard，searchboard监听tap事件，触发则收起searboard，searchboard内元素通过catchtap阻止冒泡\n2.search历史存储在本地，有content和time两个属性\n3.catchtap触发的事件的target为源组件，currentTarget为当前绑定组件"
  },
  {
    "date": "10-2",
    "time": "21:33",
    "content": "1.引入的ColorUI组件中搜索框样式存在拼写错误，已将serach更正为search"
  },
  {
    "date": "10-2",
    "time": "20:21",
    "content": "1.引入腾讯地图JDK，将实例化的QQMapWX设未全局变量qqmapsdk，通过getApp().qqmapsdk调用\n2.引入腾讯地图SDK，尚未将添加https://apis.map.qq.com为request合法域名"
  },
  {
  "date": "10-2",
  "time": "19:16",
  "content": "1.引入ColorUI\n2.引入腾讯地图JDK解析位置信息\n3.删除初始化小程序生成的代码",
  "images": ["/images/logs/colorUI.png"]
  }
]
module.exports = logs