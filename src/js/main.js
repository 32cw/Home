window.hiddenProperty =
	'hidden' in document
		? 'hidden'
		: 'webkitHidden' in document
		? 'webkitHidden'
		: 'mozHidden' in document
		? 'mozHidden'
		: null

window.DIRECTIONS = {
	UP: 'UP',
	DOWN: 'DOWN',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	UNDIRECTED: 'UNDIRECTED'
}
window.isPhone =
	/Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(
		navigator.userAgent
	) && window.innerWidth < 760

function isMobile() {
	var viewType = navigator.userAgent.toLowerCase();
	// console.log(viewType);
	return viewType.match(/(phone|pad|pod|midp|iphone|ipod|iphone os|ios|ipad|android|mobile|blackberry|iemobile|mqqbrowser|juc|rv:1.2.3.4|ucweb|fennec|wosbrowser|browserng|webos|symbian|windows ce|windows mobile|windows phone)/i);
}

var isPC = true;
if (isPhone) {
	isPC = false;
	// console.log(isPhone);
}
if (isMobile()) {
	isPC = false;
	// console.log(isMobile());
}

function getMoveDirection(startx, starty, endx, endy) {
	if (!isPhone) {
		return
	}

	const angx = endx - startx
	const angy = endy - starty

	if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
		return DIRECTIONS.UNDIRECTED
	}

	const getAngle = (angx, angy) => (Math.atan2(angy, angx) * 180) / Math.PI

	const angle = getAngle(angx, angy)
	if (angle >= -135 && angle <= -45) {
		return DIRECTIONS.UP
	} else if (angle > 45 && angle < 135) {
		return DIRECTIONS.DOWN
	} else if (
		(angle >= 135 && angle <= 180) ||
		(angle >= -180 && angle < -135)
	) {
		return DIRECTIONS.LEFT
	} else if (angle >= -45 && angle <= 45) {
		return DIRECTIONS.RIGHT
	}

	return DIRECTIONS.UNDIRECTED
}

const signatureEl = $$('#signature')
const maxAlpha = 0.7;
function getDayLight() {
	let time = new Date()
	let hour = time.getHours() - 12
	let factor = hour ? Math.abs(hour) / hour : 1
	hour = hour + (time.getMinutes() * 60 + time.getSeconds()) / 3600

	const result = (hour / 4 - factor) * factor
	return Math.min(maxAlpha, Math.max(result, 0))
}

function setLightColor() {
	$$('#page').style.backgroundColor = `rgba(85,85,85,$${getDayLight()})`
}

function typeSignature() {
	typeSignature.count = typeSignature.count || 0

	if (typeSignature.count <= signature.length) {
		signatureEl.innerHTML = `${signature.slice(0, typeSignature.count++)}|`
		setTimeout(typeSignature, 100)
	} else {
		signatureEl.innerHTML = signature
	}
}

function messenger(el) {
	const context = this
	let countCall = 0
	let counter = 0
	let callCount = 0

	context.init = function() {
		context.codeletters = '&#*+%?￡@§$'
		context.message = 0
		context.currentLength = 0
		context.fadeBuffer = false
		context.messages = ['...']

		setTimeout(context.animateIn, 100)
	}

	context.generateRandomString = function(length) {
		let randomText = ''
		while (randomText.length < length) {
			randomText += context.codeletters.charAt(
				Math.floor(Math.random() * context.codeletters.length)
			)
		}

		return randomText
	}

	context.animateIn = function() {
		if (context.currentLength < context.messages[context.message].length) {
			context.currentLength = context.currentLength + 2
			if (context.currentLength > context.messages[context.message].length) {
				context.currentLength = context.messages[context.message].length
			}

			el.innerHTML = context.generateRandomString(context.currentLength)

			setTimeout(context.animateIn, 20)
		} else {
			if (++callCount > 2) {
				return
			}
			setTimeout(context.animateFadeBuffer, 20)
		}
	}

	context.animateFadeBuffer = function() {
		if (context.fadeBuffer === false) {
			context.fadeBuffer = []
			for (let i = 0; i < context.messages[context.message].length; i++) {
				context.fadeBuffer.push({
					c: Math.floor(Math.random() * 12) + 1,
					l: context.messages[context.message].charAt(i)
				})
			}
		}

		let doCycles = false
		let message = ''

		for (let i = 0; i < context.fadeBuffer.length; i++) {
			let fader = context.fadeBuffer[i]
			if (fader.c > 0) {
				doCycles = true
				fader.c--
				message += context.codeletters.charAt(
					Math.floor(Math.random() * context.codeletters.length)
				)
			} else {
				message += fader.l
			}
		}

		el.innerHTML = message

		if (doCycles === true) {
			if (++counter === 15) {
				typeSignature()
				countCall = 3
				return
			} else if (counter < 15) {
				setTimeout(context.animateFadeBuffer, 50)
			} else {
				return
			}
		} else {
			if (countCall > 2) {
				return
			} else if (++countCall === 2) {
				typeSignature()
			} else {
				context.cycleText()
			}
		}
	}
	context.cycleText = function() {
		context.message = context.message + 1
		if (context.message >= context.messages.length) {
			context.message = 0
		}

		context.currentLength = 0
		context.fadeBuffer = false
		el.innerHTML = ''

		setTimeout(context.animateIn, 200)
	}

	context.init()
}

function loadMain() {
	if (loadMain.loaded) {
		return
	}
	setLightColor()
	setTimeout(() => {
		new messenger(signatureEl)
	}, 400)
	loadMain.loaded = true
}

$.get("https://v1.hitokoto.cn", {}, function (data, status, jqxhr) {
	// console.log(data);
	var text = data;
	window.signature = text.hitokoto + ' - ' + text.from;
	loadMain();
}).fail(function () {
	loadMain();
});

function bgSet() {
	try {
		var img = new Image();
		var imgUrl = 'https://cdn.jsdelivr.net/gh/wliduo/CDN@master/wallpaper/201911/20191107005.jpg';
		if (seconds % 2 == 0) {
			imgUrl = 'https://cdn.jsdelivr.net/gh/wliduo/CDN@master/wallpaper/201911/20191107010.jpg';
		}
		if (seconds % 5 == 0) {
			imgUrl = 'https://cdn.jsdelivr.net/gh/wliduo/CDN@master/wallpaper/201911/20191101005.jpg';
		}
		img.src = imgUrl;
		img.onload = function () {
			// $("#bg").hide()
			document.getElementById('bg').style.backgroundImage = "url(" + imgUrl + ")";
			$("#bg").fadeIn(1000);
		}
	} catch(err) {
		bgSet();
	} finally {
		
	}
}

// 获取当前时间
var date = new Date();
var seconds = date.getSeconds();
bgSet();

// $$('#qq').setAttribute('href', window.isPhone ? 'mqqwpa://im/chat?chat_type=wpa&uin=123456789&version=1&src_type=web&web_src=oicqzone.com' : 'tencent://message/?uin=123456789')
if (isPC) {
    // 加载雪花
    html2canvas([document.body], {
        onrendered: function(e) {
            try {
                var snow = detectEdge(e);
                snow.flakeCount = 30, Snowflakes.init(snow);
            } catch (err) {
                console.log('[Error] Snow is not defined.');
            }
        }
    });
    // 加载Live2D
    try {
        $('body').append('<style>.waifu-tool span{display:block;cursor:pointer;color:#f3f9f1;transition:.2s}</style><div class="waifu"><div class="waifu-tips"></div><canvas id="live2d" class="live2d"></canvas><div class="waifu-tool"><span class="fui-home"></span> <span class="fui-chat"></span> <span class="fui-eye"></span> <span class="fui-user"></span> <span class="fui-photo"></span> <span class="fui-info-circle"></span> <span class="fui-cross"></span></div></div>');
        /* 可直接修改部分参数 */
        live2d_settings['modelId'] = 6;                  // 默认模型 ID
        live2d_settings['modelTexturesId'] = 2;         // 默认材质 ID
        live2d_settings['modelStorage'] = false;         // 不储存模型 ID
        live2d_settings['canTurnToHomePage'] = false;    // 隐藏 返回首页 按钮
        live2d_settings['waifuEdgeSide'] = 'right:30';   // 看板娘贴边方向
        live2d_settings['aboutPageUrl'] = 'https://github.com/fghrsh/live2d_demo';   // 关于页地址
        live2d_settings['hitokotoAPI'] = 'hitokoto.cn';
        /* 在 initModel 前添加 */
        initModel("https://cdn.jsdelivr.net/gh/wliduo/Mark@master/assets/live2d/waifu-tips.json?v=1.4.2");
    } catch(err) {
        console.log('[Error] JQuery is not defined.')
    } finally {
        
    }
} else {
	// 加载雪花
    html2canvas([document.body], {
        onrendered: function(e) {
            try {
                var snow = detectEdge(e);
                snow.flakeCount = 5, Snowflakes.init(snow);
            } catch (err) {
                console.log('[Error] Snow is not defined.');
            }
        }
    });
}