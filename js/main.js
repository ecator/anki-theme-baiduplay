//入口模块
//检测是否有版本更新
var lastVersion='2.0'
if (version!=lastVersion) {
	if(!document.querySelector(".version")){
		var div=document.createElement('div')
		div.setAttribute('class',"version")
		div.innerHTML="发现新版本"+lastVersion+"(当前版本"+version+")<a href='https://raw.githubusercontent.com/ecator/anki-theme-basic-baidu-jp-en/master/BaiduPlay.apkg'>点我</a>更新"
		document.body.appendChild(div)
	}
}
//加载js文件函数
function loadjs(filename){
	var script=document.createElement("script")
	script.setAttribute("src",getjsBaseurl()+filename+'.js')
	document.head.appendChild(script)
}
//获取script自身baseurl
function getjsBaseurl(){
var script=document.getElementsByTagName("script")[document.getElementsByTagName("script").length-1]
if(script.getAttribute("data-baseurl")){
	return script.getAttribute("data-baseurl")

}else
{
	var tmp=script.src.split('/')
	// console.log(tmp)
	tmp.pop()
	return tmp.join("/")+"/"
}
}
/*忘head中注册一个全局变量，用于Anki卡片正反面传值
**name和val值必须要为字符串
*/
function regist2Head(name,val){
	// console.log(window[name])
	if (window[name]) return
	var script=document.createElement('script')
	script.innerHTML="var "+name+"="+val
	document.head.appendChild(script)
}


//加载依赖模块
loadjs("playAudio")

//执行anki的初始化js代码
function initialAnki(){
	if (typeof(playAudio)=='function' && typeof(baiduplay)=='object') {
		var playbtn=document.getElementById('playButton')
		if (!playbtn) {
			setTimeout(initialAnki,1000)
		}else{
			//当前卡片为背面，加载控件
			//先判断控件是否存在，防止重复加载
			if(document.querySelector('label[for=spd]')) return
			//加载音频按钮
			playbtn.setAttribute('src',getjsBaseurl()+'../img/button/'+language+'.png')
			var word=document.getElementById('word').innerText
			var audiourl="http://fanyi.baidu.com/gettts?lan="+language+"&text="+encodeURI(word)+"&source=web"
			playbtn.setAttribute('onclick',"playAudio(\""+audiourl+"\")")
			playbtn.style.display='block'
			//加载语速调节器
			var adjuster=document.querySelector(".adjuster")
			var labelSpd=document.createElement('label')
			labelSpd.setAttribute('for','spd')
			labelSpd.innerText='当前语速:'+baiduplay.spd
			var spd=document.createElement('input')
			spd.setAttribute('min',1)
			spd.setAttribute('max',7)
			spd.setAttribute('step',1)
			spd.setAttribute('type','range')
			spd.setAttribute('id','spd')
			spd.setAttribute('value',baiduplay.spd)
			spd.onchange=function(){
				document.querySelector('label[for=spd]').innerText="当前语速:"+this.value
				baiduplay.spd=this.value
			}
			adjuster.appendChild(labelSpd)
			adjuster.appendChild(spd)
			//加载自动播放选项框
			var labelAutoPlay=document.createElement('label')
			labelAutoPlay.setAttribute('for','AutoPlay')
			labelAutoPlay.innerText="自动播放"
			var AutoPlay=document.createElement('input')
			AutoPlay.setAttribute('type','checkbox')
			AutoPlay.onchange=function(){
				if (this.checked) {
					baiduplay.autoplay=true
				}else{
					baiduplay.autoplay=false
				}
			}
			adjuster.appendChild(labelAutoPlay)
			adjuster.appendChild(AutoPlay)
			//所有组件加载完毕，隐藏过度div
			document.querySelector('.transition').style.display='none'
			//判断是否自动播放音频
			if (baiduplay.autoplay) {
				AutoPlay.checked=true
				playAudio(audiourl)
			}else{
				AutoPlay.checked=false
			}
		}
	}else{
		setTimeout(initialAnki,1000)
	}
}
//设置全局变量baiduplay用于卡片正反传值
regist2Head('baiduplay',"{autoplay:false,spd:3}")
setTimeout(initialAnki,1000)