//javascriptTools.httpGet("http://baidu.com");
var baseUrl;
var arrayList=new Array();
var index=0;
var chapterIndex=0;
var xiangxiId;
var chapterName;
var voaName;
var detailPic;
var fangxiangVar;
var nanduVar;
var paixuVar;
var loadingIndicator;
var searchKeys;
var searchInit=0;
var searchPage=2;
var stopSearchNext;
App.onLaunch = function(options) {
    baseUrl = options.BASEURL
	mkHome();
};

var loadingTemplate=`<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <loadingTemplate>
            <activityIndicator>
              <text>加载中...</text>
            </activityIndicator>
          </loadingTemplate>
        </document>`;

var createAlert = function(title, description) {

    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <alertTemplate>
            <title>${title}</title>
            <description>${description}</description>
          </alertTemplate>
        </document>`;

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");

    return alertDoc;
};

//显示加载状态XML
function showLoadingIndicator() {
	this.loadingIndicatorVisible=false;
        /*
        You can reuse documents that have previously been created. In this implementation
        we check to see if a loadingIndicator document has already been created. If it 
        hasn't then we create one.
        */
        if (!loadingIndicator) {
            loadingIndicator = loadDoc(loadingTemplate);
        }
        
        /* 
        Only show the indicator if one isn't already visible and we aren't presenting a modal.
        */
        if (!this.loadingIndicatorVisible) {
            navigationDocument.pushDocument(loadingIndicator);
            this.loadingIndicatorVisible = true;
        }
    }


function defaultPresenter(xml) {
	if(this.loadingIndicatorVisible) {
		navigationDocument.replaceDocument(xml,loadingIndicator);
		this.loadingIndicatorVisible = false;
	} else {
		navigationDocument.pushDocument(xml);
	}
}

//推送XML到Stack
function pushDoc(document)
{
	var parser = new DOMParser();
    var aDoc = parser.parseFromString(document, "application/xml");
    navigationDocument.pushDocument(aDoc);
}

//解析字符成XML
function loadDoc(document)
{
	var parser = new DOMParser();
    var aDoc = parser.parseFromString(document, "application/xml");
    return aDoc;
}

function mkHome()
{
	var xml = `<document>
  <mainTemplate>
    <background>
      <img src="${baseUrl}01.jpg" />
      <img src="${baseUrl}02.jpg" />
      <img src="${baseUrl}03.jpg" />
      <audio>
        <asset id="main_audio" src="${baseUrl}back-music.mp3" keyDelivery="itunes" />
      </audio>
    </background>
    <menuBar>
      <section>
        <menuItem id="course">
          <title>课程</title>
        </menuItem>
        <menuItem id="plan">
          <title>计划</title>
        </menuItem>
        <menuItem id="article">
          <title>文章</title>
        </menuItem>
        <menuItem id="fav">
          <title>收藏</title>
        </menuItem>
        <menuItem id="his">
          <title>历史</title>
        </menuItem>
        <menuItem id="search">
          <title>搜索</title>
        </menuItem>
      </section>
    </menuBar>
  </mainTemplate>
</document>`;
var loadXML=loadDoc(xml);
navigationDocument.pushDocument(loadXML);
loadXML.addEventListener("select", function(ele){
	if(ele.target.getAttribute("id")=="course")
	{
		//课程
		courseFun();
	}else if(ele.target.getAttribute("id")=="fav")
	{
		//收藏
		mkFav();
	}else if(ele.target.getAttribute("id")=="his")
	{
		//历史
		showHis();
	}else if(ele.target.getAttribute("id")=="search")
	{
		//历史
		searchController();
	}

	});
}

function courseFun()
{
	showLoadingIndicator();
  var xml = `<document>
  <head>
    <style>
      .scrollTextOnHighlight{
	      tv-text-highlight-style: marquee-on-highlight;
	      text-align: left;
      }
      .textAlign{
	      text-align: left;
      }
      .buttonStyle{
	      height: 65;
      }
      .textStyle{
	      font-size: 35;
      }
    </style>
  </head>
  <stackTemplate theme="light">
    <identityBanner>
      <title>全部课程</title>
      <subtitle id="ids">最新</subtitle>
      <row>
        <buttonLockup class="buttonStyle" onselect="fangxiangFun()">
          <text class="textStyle">全部</text>
          <title>方向</title>
        </buttonLockup>
        <buttonLockup class="buttonStyle" onselect="fenleiCostom()">
          <text class="textStyle">全部</text>
          <title>分类</title>
        </buttonLockup>
        <buttonLockup class="buttonStyle" onselect="nanduFun()">
          <text class="textStyle">全部</text>
          <title>难度</title>
        </buttonLockup>
        <buttonLockup class="buttonStyle" onselect="paixuFun()">
          <text class="textStyle">全部</text>
          <title>排序</title>
        </buttonLockup>
        <buttonLockup class="buttonStyle" onselect="shuxingA()">
          <text class="textStyle">全部</text>
          <title>收藏</title>
        </buttonLockup>
      </row>
    </identityBanner>
    <collectionList>
    <grid>
        <header>
          <title></title>
        </header>
        <section>
        </section>
      </grid>
    </collectionList>
  </stackTemplate>
</document>`;
searchInit = 0;
searchPage = 1;
stopSearchNext = false;
var loadXML=loadDoc(xml);
defaultPresenter(loadXML);
fenleiFun(1,'0','last','','');
loadXML.addEventListener("highlight", function(event){
	var hightInt=event.target.getAttribute("id");
	if(hightInt==searchInit-1 && stopSearchNext==false)
	{
		fenleiFun(1,nanduVar,paixuVar,fangxiangVar,searchPage);
	}
	});
}

function fenleiFun(append,easy,sort,classid,page)
{
	var clasid="";
	if(classid!="")
	{
		clasid="&c="+classid
	}
	var pageStr="";
	if(page!="")
	{
		pageStr="&page="+page;
	}
	var d = javascriptTools.courseListFistIndex("http://www.imooc.com/course/list?sort="+sort+"&is_easy="+easy+clasid+pageStr,searchInit);
	var searchInt = javascriptTools.getSearchCount();
	if(d!="")
	{
		searchInit=searchInit+searchInt;
		fangxiangVar = classid;
		searchPage++;
	nanduVar = easy;
	paixuVar = sort;
var doc = navigationDocument.documents.pop();
var domImplementation = doc.implementation;
var lsParser = domImplementation.createLSParser(1, null);
var lsInput = domImplementation.createLSInput();
lsInput.stringData = d;
var lastStr="";
if(sort=="last")
{
	lastStr="最新";
}else if(sort=="pop")
{
	lastStr="最热";
}
var easyStr="";
if(easy=="0")
{
	easyStr=" /全部";
}else if(easy=="1")
{
	easyStr=" /初级";
}else if(easy=="2")
{
	easyStr=" /中级";
}else if(easy=="3")
{
	easyStr=" /高级";
}
var fanxStr="";
if(classid=="fe")
{
	fanxStr=" /前段开发";
}else if(classid=="be")
{
	fanxStr=" /后段开发";
}else if(classid=="mobile")
{
	fanxStr=" /移动开发";
}else if(classid=="data")
{
	fanxStr=" /数据处理";
}else if(classid=="photo")
{
	fanxStr=" /图像处理";
}
doc.getElementById("ids").textContent=lastStr+fanxStr+easyStr;
lsParser.parseWithContext(lsInput, doc.getElementsByTagName("section").item(0), append);
	}else
	{
		stopSearchNext=true;
	}
}

function detailMK(ids)
{
	showLoadingIndicator();
	arrayList=[];
	 index=0;
 chapterIndex=0;
 xiangxiId=ids;
 
	var learnID = ids.split("/")[2];
	var d = javascriptTools.httpGetReferer("http://www.imooc.com/learn/"+learnID,"http://www.imooc.com"+ids);
	var title= javascriptTools.regexGetFormat(d,"<title>\\s*([^<]+)\\s*</title>");
	var imgUrl= javascriptTools.regexGetFormat(d,"data-src=\"([^\"]+)");
	var difficulty= javascriptTools.regexGetFormat(d,"<div class=\"static-item\\s*\">\\s*<span class=\"meta-value\"><strong>([^<]+)");
	var Time= javascriptTools.regexGetFormat(d," <div class=\"static-item static-time\">\\s*<span class=\"meta-value\"><strong>(.*)</strong>分");
	var resultTime="";
	if(Time.indexOf("小时")>-1)
	{
		var stTime=Time.substring(0, Time.indexOf("<"));
		var endTime=Time.substring(Time.indexOf("<strong>")+8, Time.length);
		resultTime=stTime+"小时"+endTime+"分";
	}else{
		resultTime=Time+"分"
	}
	
	var peoples= javascriptTools.regexGetFormat(d,"<div class=\"static-item\">\\s*<span class=\"meta-value\"><strong>([^<]+)");
	var graded= javascriptTools.regexGetFormat(d,"<h4>(.*)</h4>");
	if(imgUrl=="")
	{
		imgUrl= baseUrl + "/detailLogo.jpg"
	}
	
	var itemsStr= "";
var chapterInt = 0;
var ovInt = 0;
var history=localStorage.getItem("history");
var selectInt = 0;
var lastVistStr="";
var shoucangStr="resource://button-rate";
if(history)
{
	var hisData=JSON.parse(history);
	if(hisData[xiangxiId])
	{
		var hisDa=hisData[xiangxiId].split(",");
	selectInt=hisDa[0];
	}
}

var setFav=localStorage.getItem("setFav");
if(setFav)
{
	var favData=JSON.parse(setFav);
	if(favData[xiangxiId])
	{
		shoucangStr="resource://button-rated";
	}
}
detailPic=imgUrl;
voaName=title;

	xml = `<document>
  <head>
    <style>
    .ordinalLayout {
      margin: 8 0 0 9;
    }
    .whiteButton {
      tv-tint-color: rgb(255, 255, 255);
    }
    .lastvist{
	    color: #6a7cfc;
    }
    </style>
  </head>
  <compilationTemplate theme="dark">
    <list>
      <relatedContent>
        <itemBanner>
          <heroImg src="${imgUrl}" />
          <row>
            <buttonLockup onselect="setFav('${xiangxiId}')">
              <badge id="setFav" src="${shoucangStr}" class="whiteButton" />
              <title>关注</title>
            </buttonLockup>
            <buttonLockup>
              <badge src="resource://button-rate" class="whiteButton" />
              <title>评论</title>
            </buttonLockup>
          </row>
        </itemBanner>
      </relatedContent>
      <header>
        <title>${title}</title>
        <row>
          <text>${difficulty}</text>
          <text>${resultTime}</text>
          <text>${peoples}人观看</text>
          <text>${graded} 评分</text>
        </row>
      </header>
      <section>
        <header>
          <title></title>
        </header>
      </section>
    </list>
  </compilationTemplate>
</document>`;
var loadXML=loadDoc(xml);
defaultPresenter(loadXML);
var nHtml= d.split("\n");

for(var i=0;i<nHtml.length;i++)
{
	var cutStr = "";
	
	if(nHtml[i].indexOf("state-expand")>-1)
	{
		
		var startIndex= nHtml[i].indexOf("</i>")+4;
		var ctitle = nHtml[i].substring(startIndex, nHtml[i].length-10);
		cutStr=' disabled="true"';
		itemsStr+=`<listItemLockup${cutStr}>
          <title><![CDATA[${ctitle}]]></title>
        </listItemLockup>`;
        ovInt++;
	}
	
	if(nHtml[i].indexOf("media-item studyvideo")>-1)
	{
		var startIndex= nHtml[i].indexOf("href='")+6;
		var fistGen = nHtml[i].substring(startIndex, nHtml[i].length);
		var href=fistGen.substring(0, fistGen.indexOf("'"));
		cutStr = ` onselect="mkPlayer(${chapterInt},${ovInt})"`;
		var hightList="";
		var subStr="";
		if(selectInt==chapterInt)
		{
			hightList=" autoHighlight=\"true\"";
			if(selectInt!=0)
			subStr="<subtitle class=\"lastvist\">上次观看</subtitle>";
		}
		
		var studyTitle=fistGen.substring(fistGen.indexOf(">")+1, fistGen.length);
		itemsStr+=`<listItemLockup${cutStr}${hightList}>
          <title><![CDATA[${studyTitle}]]></title>${subStr}
        </listItemLockup>`;
        arrayList.push(href.split("/")[2]);
        chapterInt++;
        ovInt++;
	}
}
var doc = navigationDocument.documents.pop();
var domImplementation = doc.implementation;
var lsParser = domImplementation.createLSParser(1, null);
var lsInput = domImplementation.createLSInput();
lsInput.stringData = itemsStr;
lsParser.parseWithContext(lsInput, doc.getElementsByTagName("section").item(0), 1);
}

function mkPlayer(cha,ivo)
{
	index=ivo;
	chapterIndex=cha;
	addPlayerList(true);
}

function addPlayerList(oks)
{
	if(oks==false)
	chapterIndex++;
	if(arrayList[chapterIndex])
	{
		var currentVidStr=arrayList[chapterIndex];
		letvPlayerCallback(currentVidStr,function(d){
			d.addEventListener("mediaItemWillChange", function(){
				if(chapterIndex<=arrayList.length)
				{
					addPlayerList(false);
				}
			});
		});
	}
}

function letvPlayerCallback(mid,callback)
{
	var d=javascriptTools.httpGetReferer("http://www.imooc.com/course/ajaxmediainfo/?mid="+mid+"&mode=flash","http://www.imooc.com/video/"+mid);
	var mpath=JSON.parse(d)["data"]["result"]["mpath"];
	var cname=JSON.parse(d)["data"]["result"]["name"];
	var mpathStr=mpath[0];
	var player= new Player();
		var playlist = new Playlist();
		var mediaItem = new MediaItem("video", mpathStr);
		mediaItem.title = cname;
        chapterName=cname;
		player.playlist = playlist;
		player.playlist.push(mediaItem);
			
		player.play();
		setHistory();
		if(typeof callback=='function')
		{
			callback(player);
		}
}

function setHistory()
{
	var history=localStorage.getItem("history");
	if(history)
	{
		var hisData=JSON.parse(history);
		hisData[xiangxiId]=chapterIndex+","+chapterName+","+detailPic+","+voaName;
		
		var arrString=JSON.stringify(hisData);
		
		localStorage.setItem("history",arrString);
	}else
	{
		var varHis={};
		varHis[xiangxiId]=chapterIndex+","+chapterName+","+detailPic+","+voaName;
		var arrString=JSON.stringify(varHis);
		localStorage.setItem("history",arrString);
	}
}

function setFav(pid)
{
	var newStr=pid;
	
	var favv=localStorage.getItem("setFav");
	if(favv)
	{
			var data=JSON.parse(favv);
			//删除对象
			if(data[newStr])
			{
			
				delete data[newStr];
				var arrString=JSON.stringify(data);
				localStorage.setItem("setFav",arrString);
				//设置元素的src属性
				var lastDoc=navigationDocument.documents.pop();
				var favv=lastDoc.getElementById("setFav");
				favv.setAttribute("src", "resource://button-rate");
			}else{
				//存在并添加对象
				
				data[newStr]=detailPic+","+voaName+","+xiangxiId;
				var arrString=JSON.stringify(data);
			
				localStorage.setItem("setFav",arrString);
				//设置元素的src属性
				var lastDoc=navigationDocument.documents.pop();
				var favv=lastDoc.getElementById("setFav");
				favv.setAttribute("src", "resource://button-rated");
			}
	}else
	{
		//不存在 添加对象
	
		var myObject= {};
		myObject[newStr]=detailPic+","+voaName+","+xiangxiId;
		var arrString=JSON.stringify(myObject);
		
		localStorage.setItem("setFav",arrString);
		//设置元素的src属性
		var lastDoc=navigationDocument.documents.pop();
		var favv=lastDoc.getElementById("setFav");
	    favv.setAttribute("src", "resource://button-rated");
	}
}

function mkFav()
{
	var favv=localStorage.getItem("setFav");
	if(favv)
	{
		var data=JSON.parse(favv);
		var jiInt=0;
		var items="";
		for(var i in data)
		{
			
			var varStr=data[i].split(",");
	var idsd=varStr[2];
		  
			items+=`<lockup onselect="detailMK('${idsd}')" onplay="showDelSelectFav('${i}','${jiInt}')">
			<img src="${varStr[0]}" width="300" height="169" />
          <title class="maxLine"><![CDATA[${varStr[1]}]]></title>
        </lockup>`;
        jiInt++;
		}
		var xml=`<document>
  <head>
    <style>
    .imageWithGradient {
      tv-tint-color: linear-gradient(top, 0.33, transparent, 0.66, rgba(0,64,0,0.7), rgba(0,64,0,1.0));
    }
    .showTextOnHighlight {
      tv-text-highlight-style: show-on-highlight;
    }
    .scrollTextOnHighlight {
      tv-text-highlight-style: marquee-on-highlight;
    }
    .showAndScrollTextOnHighlight {
      tv-text-highlight-style: marquee-and-show-on-highlight;
    }
    .typeButton {
       margin:0 0 0 0;
       width:120px;
       height:50px;
       color:#FFFFFF;
      }
      .maxLine{
	      tv-text-max-lines: 3;
      }
    </style>
  </head>
  <stackTemplate>
  <identityBanner>
      <title>加入更多喜爱的节目收藏</title>
      <subtitle>播放键删除</subtitle>
      <row>
        <buttonLockup onselect="showDelFav()">
          <badge src="${baseUrl}remove.png" width="80" height="80" />
          <title>清空</title>
        </buttonLockup>
      </row>
    </identityBanner>
    <collectionList>
    <grid>
        <header>
          <title class="showTextOnHighlight">收藏</title>
        </header>
        <section>${items}
        </section>
      </grid>
      </collectionList>
  </stackTemplate>
</document>`;
pushDoc(xml);
	}else
	{
		alertString("提示","没有收藏节目");
	}
}

function alertString(title,description)
{
	var alertString = `<document>
  <descriptiveAlertTemplate>
  	<title>${title}</title>
    <description>${description}</description>
    <button onselect="dismissModal()">
    <title>返回</title>
    </button>
  </descriptiveAlertTemplate>
</document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");
    navigationDocument.presentModal(alertDoc);
}

function showDelFav()
{
	var alertString = `<document>
  <alertTemplate>
  	<title>设置</title>
    <description>删除收藏</description>
    //关闭透明弹窗
    <button onselect="dismissModal()">
    <title>否</title>
    </button>
    <button onselect="delFav()">
    <title>是(?)</title>
    </button>
  </alertTemplate>
</document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");
    
    //弹出透明弹窗
    navigationDocument.presentModal(alertDoc);
}

function delFav()
{
	var favv=localStorage.getItem("setFav");

	if(favv)
	{
		localStorage.removeItem("setFav");
	}
	navigationDocument.dismissModal();
	var doc=navigationDocument.documents.pop();
	var domImplementation = doc.implementation;
    var lsParser = domImplementation.createLSParser(1, null);
    var lsInput = domImplementation.createLSInput();
    lsInput.stringData =`<lockup>
			<img src="${baseUrl}lajitong.png" width="300" height="160" />
        </lockup>`;
    lsParser.parseWithContext(lsInput, doc.getElementsByTagName("section").item(0), 2);
}

function showDelSelectFav(ids,jiInt)
{
	var alertString = `<document>
  <alertTemplate>
  	<title>设置</title>
    <description>删除 选择收藏</description>
    //关闭透明弹窗
    <button onselect="dismissModal()">
    <title>否</title>
    </button>
    <button onselect="delSelectFav('${ids}','${jiInt}')">
    <title>是(?)</title>
    </button>
  </alertTemplate>
</document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");
    
    //弹出透明弹窗
    navigationDocument.presentModal(alertDoc);
}

function dismissModal()
{
	navigationDocument.dismissModal();
}

function delSelectFav(ids,jiInt)
{
	var favv=localStorage.getItem("setFav");
	if(favv)
	{
			var data=JSON.parse(favv);
			//删除对象
			if(data[ids])
			{
				
				delete data[ids];
				var arrString=JSON.stringify(data);
				localStorage.setItem("setFav",arrString);
				dismissModal();
				var doc=navigationDocument.documents.pop();
	var domImplementation = doc.implementation;
    var lsParser = domImplementation.createLSParser(1, null);
    var lsInput = domImplementation.createLSInput();
    lsInput.stringData =`<lockup>
			<img src="${baseUrl}lajitong.png" width="300" height="160" />
			<title>删除成功</title>
        </lockup>`;

    lsParser.parseWithContext(lsInput, doc.getElementsByTagName("lockup").item(jiInt), 5);
			}
	}
}

function showHis()
{
	var favv=localStorage.getItem("history");
	if(favv)
	{
		var data=JSON.parse(favv);
		var jiInt=0;
		var items="";
		for(var i in data)
		{
			
			var varStr=data[i].split(",");
	var idsd=varStr[2];
			items+=`<lockup onselect="detailMK('${i}')" onplay="showDelSelectHis('${i}','${jiInt}')">
			<img src="${varStr[2]}" width="300" height="160" />
          <title class="maxLine"><![CDATA[${varStr[1]}]]></title>
        </lockup>`;
        jiInt++;
		}
		var xml=`<document>
  <head>
    <style>
    .imageWithGradient {
      tv-tint-color: linear-gradient(top, 0.33, transparent, 0.66, rgba(0,64,0,0.7), rgba(0,64,0,1.0));
    }
    .showTextOnHighlight {
      tv-text-highlight-style: show-on-highlight;
    }
    .scrollTextOnHighlight {
      tv-text-highlight-style: marquee-on-highlight;
    }
    .showAndScrollTextOnHighlight {
      tv-text-highlight-style: marquee-and-show-on-highlight;
    }
    .typeButton {
       margin:0 0 0 0;
       width:120px;
       height:50px;
       color:#FFFFFF;
      }
      .maxLine{
	      tv-text-max-lines: 3;
      }
    </style>
  </head>
  <stackTemplate>
  <identityBanner>
      <title>赶快观看您喜爱的节目吧</title>
      <subtitle>播放键删除</subtitle>
      <row>
        <buttonLockup onselect="showDelHis()">
          <badge src="${baseUrl}remove.png" width="80" height="80" />
          <title>清空</title>
        </buttonLockup>
      </row>
    </identityBanner>
    <collectionList>
    <grid>
        <header>
          <title class="showTextOnHighlight">影片播放记录</title>
        </header>
        <section>${items}
        </section>
      </grid>
      </collectionList>
  </stackTemplate>
</document>`;
pushDoc(xml);
	}else
	{
		alertString("提示","没有影片播放记录");
	}
}

function showDelHis()
{
	var alertString = `<document>
  <alertTemplate>
  	<title>设置</title>
    <description>删除历史记录</description>
    //关闭透明弹窗
    <button onselect="dismissModal()">
    <title>否</title>
    </button>
    <button onselect="delHisa()">
    <title>是(?)</title>
    </button>
  </alertTemplate>
</document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");
    
    //弹出透明弹窗
    navigationDocument.presentModal(alertDoc);
}


function delHisa()
{
	var favv=localStorage.getItem("history");
	
	if(favv)
	{
		localStorage.removeItem("history");
	}
	navigationDocument.dismissModal();
	var doc=navigationDocument.documents.pop();
	var domImplementation = doc.implementation;
    var lsParser = domImplementation.createLSParser(1, null);
    var lsInput = domImplementation.createLSInput();
    lsInput.stringData =`<lockup>
			<img src="${baseUrl}lajitong.png" width="300" height="200" />
        </lockup>`;
    lsParser.parseWithContext(lsInput, doc.getElementsByTagName("section").item(0), 2);
}

function showDelSelectHis(ids,jiInt)
{
	var alertString = `<document>
  <alertTemplate>
  	<title>设置</title>
    <description>删除 选择收看历史</description>
    //关闭透明弹窗
    <button onselect="dismissModal()">
    <title>否</title>
    </button>
    <button onselect="delSelectHis('${ids}','${jiInt}')">
    <title>是(?)</title>
    </button>
  </alertTemplate>
</document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");
    
    //弹出透明弹窗
    navigationDocument.presentModal(alertDoc);
}

function delSelectHis(ids,jiInt)
{
	var favv=localStorage.getItem("history");
	if(favv)
	{
			var data=JSON.parse(favv);
			//删除对象
			if(data[ids])
			{
			
				delete data[ids];
				var arrString=JSON.stringify(data);
				localStorage.setItem("history",arrString);
				dismissModal();
				var doc=navigationDocument.documents.pop();
	var domImplementation = doc.implementation;
    var lsParser = domImplementation.createLSParser(1, null);
    var lsInput = domImplementation.createLSInput();
    lsInput.stringData =`<lockup>
			<img src="${baseUrl}lajitong.png" width="300" height="200" />
        </lockup>`;
  
    lsParser.parseWithContext(lsInput, doc.getElementsByTagName("lockup").item(jiInt), 5);
			}
	}
}

function fangxiangFun()
{
	var xml=`<document>
<alertTemplate>
<title>方向</title>
   <button onselect="fangFun('','全部')">
   <text>全部</text>
   </button>
   <button onselect="fangFun('fe','前段开发')">
   <text>前段开发</text>
   </button>
   <button onselect="fangFun('be','后段开发')">
   <text>后段开发</text>
   </button>
   <button onselect="fangFun('mobile','移动开发')">
   <text>移动开发</text>
   </button>
   <button onselect="fangFun('data','数据处理')">
   <text>数据处理</text>
   </button>
   <button onselect="fangFun('photo','图像处理')">
   <text>图像处理</text>
   </button>
</alertTemplate></document>`;
var parser = new DOMParser();
var alertDoc = parser.parseFromString(xml, "application/xml");
navigationDocument.presentModal(alertDoc);
}

function fenleiCostom()
{
	var ids =fangxiangVar;
	var varArray;
	if(ids=="")
	{
		varArray=[['HTML/CSS','html'],['JavaScript','javascript'],['CSS3','CSS3'],['Html5','html5'],['jQuery','jquery'],['AngularJS','angularjs'],['Node.js','nodejs'],['Bootstrap','bootstrap'],['WebApp','webapp'],['前端工具','fetool'],['PHP','php'],['JAVA','java'],['Linux','linux'],['Python','python'],['C','C'],['C++','C+puls+puls'],['Go','Go'],['C#','C%23'],['数据结构','data+structure'],['Android','android'],['IOS','ios'],['Unity 3D','Unity+3D'],['Cocos2d-x','Cocos2d-x'],['MySQL','mysql'],['MongoDB','mongodb'],['云计算','cloudcomputing'],['Oracle','Oracle'],['大数据','大数据'],['SQL Server','SQL+Server'],['Photoshop','photoshop'],['Maya','maya'],['Premiere','premiere'],['ZBrush','ZBrush']];
	}else if(ids=="fe")
	{
		varArray=[['HTML/CSS','html'],['JavaScript','javascript'],['CSS3','CSS3'],['Html5','html5'],['jQuery','jquery'],['AngularJS','angularjs'],['Node.js','nodejs'],['Bootstrap','bootstrap'],['WebApp','webapp'],['前端工具','fetool']];
	}else if(ids=="be")
	{
		varArray=[['PHP','php'],['JAVA','java'],['Linux','linux'],['Python','python'],['C','C'],['C++','C+puls+puls'],['Go','Go'],['C#','C%23'],['数据结构','data+structure']];
	}else if(ids=="mobile")
	{
		varArray=[['Android','android'],['IOS','ios'],['Unity 3D','Unity+3D'],['Cocos2d-x','Cocos2d-x']];
	}else if(ids=="data")
	{
		varArray=[['MySQL','mysql'],['MongoDB','mongodb'],['云计算','cloudcomputing'],['Oracle','Oracle'],['大数据','大数据'],['SQL Server','SQL+Server']];
	}else if(ids=="photo")
	{
		varArray=[['Photoshop','photoshop'],['Maya','maya'],['Premiere','premiere'],['ZBrush','ZBrush']];
	}
	
	var itemsStr="";
	for(var i=0;i<varArray.length;i++)
	{
		itemsStr+=`<button onselect="fenleiCostomFun('${varArray[i][1]}','${varArray[i][0]}')">
   <text>${varArray[i][0]}</text>
   </button>`;
	}
	var xml=`<document>
<alertTemplate>
<title>分类</title>${itemsStr}
</alertTemplate></document>`;
var parser = new DOMParser();
var alertDoc = parser.parseFromString(xml, "application/xml");
navigationDocument.presentModal(alertDoc);
}

function fenleiCostomFun(ids,titlea)
{
	searchInit = 0;
searchPage = 1;
stopSearchNext = false;
	dismissModal();
	var doc=navigationDocument.documents.pop();
	doc.getElementsByTagName("text").item(1).innerHTML=titlea;
	fenleiFun(2,nanduVar,paixuVar,ids,'');
}

function fangFun(ids,titlea)
{
	searchInit = 0;
searchPage = 1;
stopSearchNext = false;
	dismissModal();
	var doc=navigationDocument.documents.pop();
	doc.getElementsByTagName("text").item(0).innerHTML=titlea;
	doc.getElementsByTagName("text").item(1).innerHTML="全部";
	doc.getElementsByTagName("text").item(2).innerHTML="全部";
	doc.getElementsByTagName("text").item(3).innerHTML="全部";
	fenleiFun(2,'0','last',ids,'');
}

function nanduFun()
{
	var xml=`<document>
<alertTemplate>
<title>难度</title>
   <button onselect="nanFun('0','全部')">
   <text>全部</text>
   </button>
   <button onselect="nanFun('1','初级')">
   <text>初级</text>
   </button>
   <button onselect="nanFun('2','中级')">
   <text>中级</text>
   </button>
   <button onselect="nanFun('3','高级')">
   <text>高级</text>
   </button>
</alertTemplate></document>`;
var parser = new DOMParser();
var alertDoc = parser.parseFromString(xml, "application/xml");
navigationDocument.presentModal(alertDoc);
}

function nanFun(ids,titlea)
{
	searchInit = 0;
searchPage = 1;
stopSearchNext = false;
	dismissModal();
	var doc=navigationDocument.documents.pop();
	doc.getElementsByTagName("text").item(2).innerHTML=titlea;
	fenleiFun(2,ids,paixuVar,fangxiangVar,'');
}

function paixuFun()
{
	var xml=`<document>
<alertTemplate>
<title>排序</title>
   <button onselect="paiFun('last','最新')">
   <text>最新</text>
   </button>
   <button onselect="paiFun('pop','最热')">
   <text>最热</text>
   </button>
</alertTemplate></document>`;
var parser = new DOMParser();
var alertDoc = parser.parseFromString(xml, "application/xml");
navigationDocument.presentModal(alertDoc);
}

function paiFun(ids,titlea)
{
	searchInit = 0;
searchPage = 1;
stopSearchNext = false;
	dismissModal();
	var doc=navigationDocument.documents.pop();
	doc.getElementsByTagName("text").item(3).innerHTML=titlea;
	fenleiFun(2,nanduVar,ids,fangxiangVar,'');
}

function searchController()
{
	var xml=`<document>
  <head>
    <style>
    .longDescriptionLayout {
      max-width: 1280;
    }
    </style>
  </head>
  <formTemplate>
    <banner>
      <title>请输入想要搜索的内容</title>
     </banner>
    <textField></textField>
    <footer>
      <button onselect="searchFun()">
        <text>提交</text>
      </button>
    </footer>
  </formTemplate>
</document>`;
var varXML=loadDoc(xml);
 navigationDocument.pushDocument(varXML);
}

function searchFun()
{
	var varXML = navigationDocument.documents.pop();
	var searchField = varXML.getElementsByTagName("textField").item(0);
	var keyboard = searchField.getFeature("Keyboard");
	var searchText = keyboard.text;
	
	if(searchText)
	{
		showLoadingIndicator();
		searchKeys=searchText;
		stopSearchNext=false;
		searchPage=2;
		var d=javascriptTools.httpGet("http://www.imooc.com/index/search?words="+searchText);
		var ahtml=javascriptTools.searchResultFistIndex(d,searchInit);
		var searchInt=javascriptTools.getSearchCount();
		var courseNum=javascriptTools.regexGetFormat(d,"<span>课程([^<]+)");
		searchInit=searchInit+searchInt;
		xml = `<document>
  <head>
    <style>
    .ordinalLayout {
      margin: 8 0 0 9;
    }
    .whiteButton {
      tv-tint-color: rgb(255, 255, 255);
    }
    .lastvist{
	    color: #6a7cfc;
    }
    </style>
  </head>
  <compilationTemplate theme="dark">
    <list>
      <relatedContent>
        <itemBanner>
          <heroImg src="${baseUrl}/detailLogo.jpg" />
        </itemBanner>
      </relatedContent>
      <header>
        <title>找到相关课程${courseNum}个</title>
      </header>
      <section>
        <header>
          <title></title>
        </header>${ahtml}
      </section>
    </list>
  </compilationTemplate>
</document>`;
var loadXML=loadDoc(xml);
defaultPresenter(loadXML);
loadXML.addEventListener("highlight", function(event){
	var hightInt=event.target.getAttribute("id");
	if(hightInt==searchInit-1 && stopSearchNext==false)
	{
		searchFanye();
	}
});
	}else{
		alertString("错误","请输入搜索关键字!");
	}
}

function searchFanye()
{
	var d=javascriptTools.httpGet("http://www.imooc.com/index/search?words="+searchKeys+"&tag=0&page="+searchPage);
	var ahtml=javascriptTools.searchResultFistIndex(d,searchInit);
	var searchInt=javascriptTools.getSearchCount();
		searchInit=searchInit+searchInt;
	if(ahtml.length>2&&d.indexOf("下一页")>-1)
	{
		searchPage++;
		var doc = navigationDocument.documents.pop();
var domImplementation = doc.implementation;
var lsParser = domImplementation.createLSParser(1, null);
var lsInput = domImplementation.createLSInput();
lsInput.stringData = ahtml;
lsParser.parseWithContext(lsInput, doc.getElementsByTagName("section").item(0), 1);
	}else
	{
		if(d.length>10)
		{
			stopSearchNext=true;
		}
	}
}