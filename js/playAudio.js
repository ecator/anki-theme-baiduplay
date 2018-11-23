//播放音频函数，需要传入音频地址
function playAudio(audioSrc){
	// alert(audioSrc)
	//尝试获取语速
	var spd=document.getElementById('spd')
 	// console.log(spd)
 	spd=spd?spd.value:'3'
 	audioSrc+="&spd="+spd
 	//判断是否为PC端，PC和移动端的播放方式不一样
 	if(typeof(pycmd)=="function"){
 		//PC端，需要代码为498789867的插件依赖
 		pycmd("ankiplay"+audioSrc)
	}else{
 		//移动端
 		var player=new Audio(audioSrc)
 		player.play()
 	}
}