# 对于网易云音乐首页接口分析

如前文，前几日在做网易云音乐flutter 的app，根据某开放性接口，目前功能大抵是完成了。但是就当我打算结束app开发转向后端学习，发现了如下接口。大受震撼，夜不能寐。本质是利用后端返回的数据来控制前端的界面，堪称接口思想之集大成，于是便来分析一下。

首先来看最外层 

```
{
	code:
	data:{
	 	cursor:
	 	blocks:[]
	 	hasMore:
	 	blockUUIDs:
	 	pageConfig:{}
	 	guideToast:{}
	 	internalTest:
	 	titles:[]
	 	blockCodeOrderList:null
	 	exposedResource: "..."
	 	demote:false
	 	
	}
	message:
	trip:
}
```

首先，code、message、trip基本上都是标识符一类，略过。我们来看cursor

### 1.cursor部分 排序作用

```
"cursor": "{\"offset\":10,\"blockCodeOrderList\":[\"HOMEPAGE_BANNER\",\"HOMEPAGE_BLOCK_OLD_DRAGON_BALL\",\"HOMEPAGE_BLOCK_PLAYLIST_IMPORT_GUIDE\",\"HOMEPAGE_BLOCK_PLAYLIST_RCMD\",\"HOMEPAGE_BLOCK_STYLE_RCMD\",\"HOMEPAGE_BLOCK_TOPLIST\",\"HOMEPAGE_BLOCK_NEW_HOT_COMMENT\",\"HOMEPAGE_BLOCK_OPACTIVITY\",\"HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG\",\"HOMEPAGE_HEART_LYRICS\",\"HOMEPAGE_WHOLENET_HOT_PODCAST\",\"HOMEPAGE_BLOCK_RESEARCH\"]}",
```

两个部分：offset、blockCodeOrderList

这里超前引用一下block部分

```
{
	blockCode:"HOMEPAGE_BLOCK_OLD_DRAGON_BALL",
	showType:...
	....
}
```

分析：最外层的字段blocks是一个map列表，每个item都有一个blockCode字段，再根据字段名称，可以看出cursor作用是根据blockCode排序，offset则是偏移量，大抵是页面距离顶部或者侧边的padding margin值

### 2. pageConfig

首先上数据

```
	"pageConfig": {
            "refreshToast": "",             //刷新时候的indictaor展示的文字
            "nodataToast": "到底啦~",		  //加载时的如果没有数据现实的文字
            "refreshInterval": 120000,		//自动刷新间隔，没有单位不过按我提ui测，120000 大抵是 1200秒，二十分钟刷新											 //一次，算是比较合理的间隔
            "title": null,
            "fullscreen": false,
            "abtest": [
                "homepage-v7.3",			
                "homepage-v7.4",			
        		...
            ],
            "songLabelMarkPriority": [	  	//一个歌曲会有许多label，比如 “vip”  “hot”之类的，priority			
                "vip",						//设置优先级  可以在后端进行展示切换
				... 
            ],
            "songLabelMarkLimit": 1,		//歌曲 label 最大展示个数 比如 vip的优先级大于hot，如果是vip 、hot 都有											//那么只展示vip
            
            "homepageMode": "RCMD_MODE",	//首页展示模式 ，RCMD_MODE 即 recommend推荐模式 根据用户行为、兴趣或者其											//他算法来生成推荐内容
            
            "showModeEntry": true,  		
            "orderInfo": null
        },
```

可以看到，如果需要更改刷新的标志，只需要在后端数据更改，而无需前端修改。这样节省了

### 3. 重头戏：block

#### 1.展示模式

block 部分 是由一个block list生成的，由1所述，根据cursor控制排列顺序，在说明block部分的字段功能之前，我们先来看一下wyyapp首页三个展示模式

![image-20240130102457057](C:\Users\炳耀\AppData\Roaming\Typora\typora-user-images\image-20240130102457057.png)

1. 最顶部列表，由一个长方形的展示块 形成一行 5 个的列表
2. 由正方形形成一行6个的列表
3. 由 三个纵向歌曲形成的page ，这样的page一共有4页，所以总计12首歌

 

​	我们先自己抽象一个类（或者json数据）来尝试展示一下,看看如何能用一个类来完成这三个模块的封装

1.简单一点

```
class Show {
	String mode;  	//展示模式，区分那三种，最好按枚举值
	String title;
	List source;
}
```

2.如果需要在title的尾部添加一个 按钮 ，点击之后可以移除本模块，应该怎么做 ？

```
比较直观的代码是：
class Show{
	...
	String title;
	IconData icon;					//或许是传入一个总的封装的Widget，但是，传入widget无法受后端控制
	Function onclickIcon;
	.....
}
```

3.再封装一下

```
class Show{
	...
	Title title;
}

class Title{
	String title
	IconData icon;						//如果需要适配后端的话，那么按钮应该传入一个操作，即url ：														//比如 orpheus://playlistCollection?					    
										//referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD
	Function onClickIcon;
}
```



以下是block 中的键值 ，不同block所含有的键值不同，不过并集如下

```
{
	blockCode:                      //从cursor来排序的标志
 	showType: "HOMEPAGE_SLIDE_PLAYLIST",
	dislickShowType:0          
	action: 						//这里是一个wyyapp的链接，点击自动跳转
	actionType:""
	extInfo:{
	}
	uiElement:{						//类似于封装的Show类的Title类
	}
	creatives:[						//歌曲列表的image、title、subtitle之类的东西
	],
	canClose:
	blockStyle:0
    resourceIdList:[				//类似于source ，不过由于首页需要展示
    ]					
    canFeedback:
	blockDemote:false,
	sort:0

```



uiElement:  类似于头部资源

```
uiElement:{
	mainTitle:{   //可为空
	  "title": "推荐歌单",
      "canShowTitleLogo": false
	},
	subTitle:{  //可为空
	  "title": "推荐歌单",
      "canShowTitleLogo": false
	},
	button:{         //可为空
	 "action": "orpheus://playlistCollection?referLog=HOMEPAGE_BLOCK_PLAYLIST_RCMD",
      actionType": "orpheus
      "text": "更多
      "iconUrl": null,
      "biData": null
	},
	image:{
	
	},
	rcmdShowType:DEFAULT
}
```

extInfo

```
"extInfo": {
 "title": "导入外部歌单",
  "subTitle": "轻松导入其他APP里的歌单",
    "imgUrl":"https://p5.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/14574515885/a209/d982/c744/5925341e8606929111da9104aef04543.png",
 "targetUrl": "https://mp.music.163.com/5fdc112488038505bee2ea15/new/index.html?nm_style=sbt&bounces=false",
                    "buttonText": "去导入"
},
```





































