var com = com || {};

com.init = function () {
	com.width = tt.getSystemInfoSync().windowWidth;		//画布宽度
	com.height = tt.getSystemInfoSync().windowHeight; 		//画布高度
	com.spaceX = 35;		//着点X跨度
	com.spaceY = 36;		//着点Y跨度
	com.centreX = (tt.getSystemInfoSync().windowWidth - 325) / 2
	com.centreY = (tt.getSystemInfoSync().windowHeight - 403) / 2
	com.pointStartX = 5 + com.centreX;	//第一个着点X坐标;
	com.pointStartY = 20 + com.centreY;	//第一个着点Y坐标;
	com.page = "stype";			//图片目录

	com.canvas = canvas; //画布
	com.ct = com.canvas.getContext("2d");

	com.childList = com.childList || [];

	com.loadImages(com.page);		//载入图片/图片目录
}

//载入图片
com.loadImages = function (stype) {

	//绘制棋盘
	com.bgImg = new Image();
	com.bgImg.src = "images/" + stype + "/bg.png";

	//提示点
	com.dotImg = new Image();
	com.dotImg.src = "images/" + stype + "/dot.png";

	//棋子
	for (var i in com.args) {
		com[i] = {};
		com[i].images = new Image();
		com[i].images.src = "images/" + stype + "/" + com.args[i].images + ".png";
	}

	//棋子外框
	com.paneImg = new Image();
	com.paneImg.src = "images/" + stype + "/r_box.png";

	//背景
	com.background = new Image();
	com.background.src = "images/" + stype + "/bg.jpg";

	//悔棋按钮
	com.withdrawBtn = new Image();
	com.withdrawBtn.src = "images/withdrawBtn.png";

	//体力图标
	com.staminaIcon = new Image();
	com.staminaIcon.src = "images/staminaIcon.png";

	//体力图标2
	com.staminaIcon2 = new Image();
	com.staminaIcon2.src = "images/staminaIcon1.png";

	//体力图标3
	com.staminaIcon3 = new Image();
	com.staminaIcon3.src = "images/staminaIcon2.png";

	//关卡底图
	com.checkpoint = new Image();
	com.checkpoint.src = "images/checkpoint.png";

	//返回首页
	com.backToHomepage = new Image();
	com.backToHomepage.src = "images/backToHomepage.png";

}

//显示列表
com.show = function () {
	com.ct.clearRect(0, 0, com.width, com.height);
	for (var i = 0; i < com.childList.length; i++) {
		com.childList[i].show();
	}
}

//显示移动的棋子外框
com.showPane = function (x, y, newX, newY) {
	com.pane.isShow = true;
	com.pane.x = x;
	com.pane.y = y;
	com.pane.newX = newX;
	com.pane.newY = newY;
}

//生成map里面有的棋子
com.createMans = function (map) {
	for (var i = 0; i < map.length; i++) {
		for (var n = 0; n < map[i].length; n++) {
			var key = map[i][n];
			if (key) {
				com.mans[key] = new com.class.Man(key);
				com.mans[key].x = n;
				com.mans[key].y = i;
				com.childList.push(com.mans[key])
			}
		}
	}
}


//debug alert
com.alert = function (obj, f, n) {
	if (typeof obj !== "object") {
		try { console.log(obj) } catch (e) { }
		//return alert(obj);
	}
	var arr = [];
	for (var i in obj) arr.push(i + " = " + obj[i]);
	try { console.log(arr.join(n || "\n")) } catch (e) { }
	//return alert(arr.join(n||"\n\r"));
}

//com.alert的简写，考虑z变量名最不常用
var z = com.alert;
var l = console.log;

//二维数组克隆
com.arr2Clone = function (arr) {
	var newArr = [];
	for (var i = 0; i < arr.length; i++) {
		newArr[i] = arr[i].slice();
	}
	return newArr;
}

//ajax载入数据
com.getData = function (url, fun) {
	var XMLHttpRequestObject = false;
	if (window.XMLHttpRequest) {
		XMLHttpRequestObject = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (XMLHttpRequestObject) {
		XMLHttpRequestObject.open("GET", url);
		XMLHttpRequestObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		XMLHttpRequestObject.onreadystatechange = function () {
			if (XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200) {
				fun(XMLHttpRequestObject.responseText)
				//return XMLHttpRequestObject.responseText;
			}
		}
		XMLHttpRequestObject.send(null);
	}
}

//把坐标生成着法
com.createMove = function (map, x, y, newX, newY) {
	var h = "";
	var man = com.mans[map[y][x]];
	h += man.text;
	map[newY][newX] = map[y][x];
	delete map[y][x];
	if (man.my === 1) {
		var mumTo = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
		newX = 8 - newX;
		h += mumTo[8 - x];
		if (newY > y) {
			h += "退";
			if (man.pater == "m" || man.pater == "s" || man.pater == "x") {
				h += mumTo[newX];
			} else {
				h += mumTo[newY - y - 1];
			}
		} else if (newY < y) {
			h += "进";
			if (man.pater == "m" || man.pater == "s" || man.pater == "x") {
				h += mumTo[newX];
			} else {
				h += mumTo[y - newY - 1];
			}
		} else {
			h += "平";
			h += mumTo[newX];
		}
	} else {
		var mumTo = ["１", "２", "３", "４", "５", "６", "７", "８", "９", "10"];
		h += mumTo[x];
		if (newY > y) {
			h += "进";
			if (man.pater == "M" || man.pater == "S" || man.pater == "X") {
				h += mumTo[newX];
			} else {
				h += mumTo[newY - y - 1];
			}
		} else if (newY < y) {
			h += "退";
			if (man.pater == "M" || man.pater == "S" || man.pater == "X") {
				h += mumTo[newX];
			} else {
				h += mumTo[y - newY - 1];
			}
		} else {
			h += "平";
			h += mumTo[newX];
		}
	}
	return h;
}

com.initMap = [
	['C0', 'M0', 'X0', 'S0', 'J0', 'S1', 'X1', 'M1', 'C1'],
	[, , , , , , , ,],
	[, 'P0', , , , , , 'P1',],
	['Z0', , 'Z1', , 'Z2', , 'Z3', , 'Z4'],
	[, , , , , , , ,],
	[, , , , , , , ,],
	['z0', , 'z1', , 'z2', , 'z3', , 'z4'],
	[, 'p0', , , , , , 'p1',],
	[, , , , , , , ,],
	['c0', 'm0', 'x0', 's0', 'j0', 's1', 'x1', 'm1', 'c1']
];

com.keys = {
	"c0": "c", "c1": "c",
	"m0": "m", "m1": "m",
	"x0": "x", "x1": "x",
	"s0": "s", "s1": "s",
	"j0": "j",
	"p0": "p", "p1": "p",
	"z0": "z", "z1": "z", "z2": "z", "z3": "z", "z4": "z", "z5": "z",

	"C0": "c", "C1": "C",
	"M0": "M", "M1": "M",
	"X0": "X", "X1": "X",
	"S0": "S", "S1": "S",
	"J0": "J",
	"P0": "P", "P1": "P",
	"Z0": "Z", "Z1": "Z", "Z2": "Z", "Z3": "Z", "Z4": "Z", "Z5": "Z",
}

//棋子能走的着点
com.bylaw = {}
//车
com.bylaw.c = function (x, y, map, my) {
	var d = [];
	//左侧检索
	for (var i = x - 1; i >= 0; i--) {
		if (map[y][i]) {
			if (com.mans[map[y][i]].my != my) d.push([i, y]);
			break
		} else {
			d.push([i, y])
		}
	}
	//右侧检索
	for (var i = x + 1; i <= 8; i++) {
		if (map[y][i]) {
			if (com.mans[map[y][i]].my != my) d.push([i, y]);
			break
		} else {
			d.push([i, y])
		}
	}
	//上检索
	for (var i = y - 1; i >= 0; i--) {
		if (map[i][x]) {
			if (com.mans[map[i][x]].my != my) d.push([x, i]);
			break
		} else {
			d.push([x, i])
		}
	}
	//下检索
	for (var i = y + 1; i <= 9; i++) {
		if (map[i][x]) {
			if (com.mans[map[i][x]].my != my) d.push([x, i]);
			break
		} else {
			d.push([x, i])
		}
	}
	return d;
}

//马
com.bylaw.m = function (x, y, map, my) {
	var d = [];
	//1点
	if (y - 2 >= 0 && x + 1 <= 8 && !play.map[y - 1][x] && (!com.mans[map[y - 2][x + 1]] || com.mans[map[y - 2][x + 1]].my != my)) d.push([x + 1, y - 2]);
	//2点
	if (y - 1 >= 0 && x + 2 <= 8 && !play.map[y][x + 1] && (!com.mans[map[y - 1][x + 2]] || com.mans[map[y - 1][x + 2]].my != my)) d.push([x + 2, y - 1]);
	//4点
	if (y + 1 <= 9 && x + 2 <= 8 && !play.map[y][x + 1] && (!com.mans[map[y + 1][x + 2]] || com.mans[map[y + 1][x + 2]].my != my)) d.push([x + 2, y + 1]);
	//5点
	if (y + 2 <= 9 && x + 1 <= 8 && !play.map[y + 1][x] && (!com.mans[map[y + 2][x + 1]] || com.mans[map[y + 2][x + 1]].my != my)) d.push([x + 1, y + 2]);
	//7点
	if (y + 2 <= 9 && x - 1 >= 0 && !play.map[y + 1][x] && (!com.mans[map[y + 2][x - 1]] || com.mans[map[y + 2][x - 1]].my != my)) d.push([x - 1, y + 2]);
	//8点
	if (y + 1 <= 9 && x - 2 >= 0 && !play.map[y][x - 1] && (!com.mans[map[y + 1][x - 2]] || com.mans[map[y + 1][x - 2]].my != my)) d.push([x - 2, y + 1]);
	//10点
	if (y - 1 >= 0 && x - 2 >= 0 && !play.map[y][x - 1] && (!com.mans[map[y - 1][x - 2]] || com.mans[map[y - 1][x - 2]].my != my)) d.push([x - 2, y - 1]);
	//11点
	if (y - 2 >= 0 && x - 1 >= 0 && !play.map[y - 1][x] && (!com.mans[map[y - 2][x - 1]] || com.mans[map[y - 2][x - 1]].my != my)) d.push([x - 1, y - 2]);

	return d;
}

//相
com.bylaw.x = function (x, y, map, my) {
	var d = [];
	if (my === 1) { //红方
		//4点半
		if (y + 2 <= 9 && x + 2 <= 8 && !play.map[y + 1][x + 1] && (!com.mans[map[y + 2][x + 2]] || com.mans[map[y + 2][x + 2]].my != my)) d.push([x + 2, y + 2]);
		//7点半
		if (y + 2 <= 9 && x - 2 >= 0 && !play.map[y + 1][x - 1] && (!com.mans[map[y + 2][x - 2]] || com.mans[map[y + 2][x - 2]].my != my)) d.push([x - 2, y + 2]);
		//1点半
		if (y - 2 >= 5 && x + 2 <= 8 && !play.map[y - 1][x + 1] && (!com.mans[map[y - 2][x + 2]] || com.mans[map[y - 2][x + 2]].my != my)) d.push([x + 2, y - 2]);
		//10点半
		if (y - 2 >= 5 && x - 2 >= 0 && !play.map[y - 1][x - 1] && (!com.mans[map[y - 2][x - 2]] || com.mans[map[y - 2][x - 2]].my != my)) d.push([x - 2, y - 2]);
	} else {
		//4点半
		if (y + 2 <= 4 && x + 2 <= 8 && !play.map[y + 1][x + 1] && (!com.mans[map[y + 2][x + 2]] || com.mans[map[y + 2][x + 2]].my != my)) d.push([x + 2, y + 2]);
		//7点半
		if (y + 2 <= 4 && x - 2 >= 0 && !play.map[y + 1][x - 1] && (!com.mans[map[y + 2][x - 2]] || com.mans[map[y + 2][x - 2]].my != my)) d.push([x - 2, y + 2]);
		//1点半
		if (y - 2 >= 0 && x + 2 <= 8 && !play.map[y - 1][x + 1] && (!com.mans[map[y - 2][x + 2]] || com.mans[map[y - 2][x + 2]].my != my)) d.push([x + 2, y - 2]);
		//10点半
		if (y - 2 >= 0 && x - 2 >= 0 && !play.map[y - 1][x - 1] && (!com.mans[map[y - 2][x - 2]] || com.mans[map[y - 2][x - 2]].my != my)) d.push([x - 2, y - 2]);
	}
	return d;
}

//士
com.bylaw.s = function (x, y, map, my) {
	var d = [];
	if (my === 1) { //红方
		//4点半
		if (y + 1 <= 9 && x + 1 <= 5 && (!com.mans[map[y + 1][x + 1]] || com.mans[map[y + 1][x + 1]].my != my)) d.push([x + 1, y + 1]);
		//7点半
		if (y + 1 <= 9 && x - 1 >= 3 && (!com.mans[map[y + 1][x - 1]] || com.mans[map[y + 1][x - 1]].my != my)) d.push([x - 1, y + 1]);
		//1点半
		if (y - 1 >= 7 && x + 1 <= 5 && (!com.mans[map[y - 1][x + 1]] || com.mans[map[y - 1][x + 1]].my != my)) d.push([x + 1, y - 1]);
		//10点半
		if (y - 1 >= 7 && x - 1 >= 3 && (!com.mans[map[y - 1][x - 1]] || com.mans[map[y - 1][x - 1]].my != my)) d.push([x - 1, y - 1]);
	} else {
		//4点半
		if (y + 1 <= 2 && x + 1 <= 5 && (!com.mans[map[y + 1][x + 1]] || com.mans[map[y + 1][x + 1]].my != my)) d.push([x + 1, y + 1]);
		//7点半
		if (y + 1 <= 2 && x - 1 >= 3 && (!com.mans[map[y + 1][x - 1]] || com.mans[map[y + 1][x - 1]].my != my)) d.push([x - 1, y + 1]);
		//1点半
		if (y - 1 >= 0 && x + 1 <= 5 && (!com.mans[map[y - 1][x + 1]] || com.mans[map[y - 1][x + 1]].my != my)) d.push([x + 1, y - 1]);
		//10点半
		if (y - 1 >= 0 && x - 1 >= 3 && (!com.mans[map[y - 1][x - 1]] || com.mans[map[y - 1][x - 1]].my != my)) d.push([x - 1, y - 1]);
	}
	return d;

}

//将
com.bylaw.j = function (x, y, map, my) {
	var d = [];
	var isNull = (function (y1, y2) {
		var y1 = com.mans["j0"].y;
		var x1 = com.mans["J0"].x;
		var y2 = com.mans["J0"].y;
		for (var i = y1 - 1; i > y2; i--) {
			if (map[i][x1]) return false;
		}
		return true;
	})();

	if (my === 1) { //红方
		//下
		if (y + 1 <= 9 && (!com.mans[map[y + 1][x]] || com.mans[map[y + 1][x]].my != my)) d.push([x, y + 1]);
		//上
		if (y - 1 >= 7 && (!com.mans[map[y - 1][x]] || com.mans[map[y - 1][x]].my != my)) d.push([x, y - 1]);
		//老将对老将的情况
		if (com.mans["j0"].x == com.mans["J0"].x && isNull) d.push([com.mans["J0"].x, com.mans["J0"].y]);

	} else {
		//下
		if (y + 1 <= 2 && (!com.mans[map[y + 1][x]] || com.mans[map[y + 1][x]].my != my)) d.push([x, y + 1]);
		//上
		if (y - 1 >= 0 && (!com.mans[map[y - 1][x]] || com.mans[map[y - 1][x]].my != my)) d.push([x, y - 1]);
		//老将对老将的情况
		if (com.mans["j0"].x == com.mans["J0"].x && isNull) d.push([com.mans["j0"].x, com.mans["j0"].y]);
	}
	//右
	if (x + 1 <= 5 && (!com.mans[map[y][x + 1]] || com.mans[map[y][x + 1]].my != my)) d.push([x + 1, y]);
	//左
	if (x - 1 >= 3 && (!com.mans[map[y][x - 1]] || com.mans[map[y][x - 1]].my != my)) d.push([x - 1, y]);
	return d;
}

//炮
com.bylaw.p = function (x, y, map, my) {
	var d = [];
	//左侧检索
	var n = 0;
	for (var i = x - 1; i >= 0; i--) {
		if (map[y][i]) {
			if (n == 0) {
				n++;
				continue;
			} else {
				if (com.mans[map[y][i]].my != my) d.push([i, y]);
				break
			}
		} else {
			if (n == 0) d.push([i, y])
		}
	}
	//右侧检索
	var n = 0;
	for (var i = x + 1; i <= 8; i++) {
		if (map[y][i]) {
			if (n == 0) {
				n++;
				continue;
			} else {
				if (com.mans[map[y][i]].my != my) d.push([i, y]);
				break
			}
		} else {
			if (n == 0) d.push([i, y])
		}
	}
	//上检索
	var n = 0;
	for (var i = y - 1; i >= 0; i--) {
		if (map[i][x]) {
			if (n == 0) {
				n++;
				continue;
			} else {
				if (com.mans[map[i][x]].my != my) d.push([x, i]);
				break
			}
		} else {
			if (n == 0) d.push([x, i])
		}
	}
	//下检索
	var n = 0;
	for (var i = y + 1; i <= 9; i++) {
		if (map[i][x]) {
			if (n == 0) {
				n++;
				continue;
			} else {
				if (com.mans[map[i][x]].my != my) d.push([x, i]);
				break
			}
		} else {
			if (n == 0) d.push([x, i])
		}
	}
	return d;
}

//卒
com.bylaw.z = function (x, y, map, my) {
	var d = [];
	if (my === 1) { //红方
		//上
		if (y - 1 >= 0 && (!com.mans[map[y - 1][x]] || com.mans[map[y - 1][x]].my != my)) d.push([x, y - 1]);
		//右
		if (x + 1 <= 8 && y <= 4 && (!com.mans[map[y][x + 1]] || com.mans[map[y][x + 1]].my != my)) d.push([x + 1, y]);
		//左
		if (x - 1 >= 0 && y <= 4 && (!com.mans[map[y][x - 1]] || com.mans[map[y][x - 1]].my != my)) d.push([x - 1, y]);
	} else {
		//下
		if (y + 1 <= 9 && (!com.mans[map[y + 1][x]] || com.mans[map[y + 1][x]].my != my)) d.push([x, y + 1]);
		//右
		if (x + 1 <= 8 && y >= 6 && (!com.mans[map[y][x + 1]] || com.mans[map[y][x + 1]].my != my)) d.push([x + 1, y]);
		//左
		if (x - 1 >= 0 && y >= 6 && (!com.mans[map[y][x - 1]] || com.mans[map[y][x - 1]].my != my)) d.push([x - 1, y]);
	}

	return d;
}

com.value = {

	//车价值
	c: [
		[206, 208, 207, 213, 214, 213, 207, 208, 206],
		[206, 212, 209, 216, 233, 216, 209, 212, 206],
		[206, 208, 207, 214, 216, 214, 207, 208, 206],
		[206, 213, 213, 216, 216, 216, 213, 213, 206],
		[208, 211, 211, 214, 215, 214, 211, 211, 208],

		[208, 212, 212, 214, 215, 214, 212, 212, 208],
		[204, 209, 204, 212, 214, 212, 204, 209, 204],
		[198, 208, 204, 212, 212, 212, 204, 208, 198],
		[200, 208, 206, 212, 200, 212, 206, 208, 200],
		[194, 206, 204, 212, 200, 212, 204, 206, 194]
	],

	//马价值
	m: [
		[90, 90, 90, 96, 90, 96, 90, 90, 90],
		[90, 96, 103, 97, 94, 97, 103, 96, 90],
		[92, 98, 99, 103, 99, 103, 99, 98, 92],
		[93, 108, 100, 107, 100, 107, 100, 108, 93],
		[90, 100, 99, 103, 104, 103, 99, 100, 90],

		[90, 98, 101, 102, 103, 102, 101, 98, 90],
		[92, 94, 98, 95, 98, 95, 98, 94, 92],
		[93, 92, 94, 95, 92, 95, 94, 92, 93],
		[85, 90, 92, 93, 78, 93, 92, 90, 85],
		[88, 85, 90, 88, 90, 88, 90, 85, 88]
	],

	//相价值
	x: [
		[0, 0, 20, 0, 0, 0, 20, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 23, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 20, 0, 0, 0, 20, 0, 0],

		[0, 0, 20, 0, 0, 0, 20, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[18, 0, 0, 0, 23, 0, 0, 0, 18],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 20, 0, 0, 0, 20, 0, 0]
	],

	//士价值
	s: [
		[0, 0, 0, 20, 0, 20, 0, 0, 0],
		[0, 0, 0, 0, 23, 0, 0, 0, 0],
		[0, 0, 0, 20, 0, 20, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],

		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 20, 0, 20, 0, 0, 0],
		[0, 0, 0, 0, 23, 0, 0, 0, 0],
		[0, 0, 0, 20, 0, 20, 0, 0, 0]
	],

	//将价值
	j: [
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],

		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0]
	],

	//炮价值
	p: [
		[100, 100, 96, 91, 90, 91, 96, 100, 100],
		[98, 98, 96, 92, 89, 92, 96, 98, 98],
		[97, 97, 96, 91, 92, 91, 96, 97, 97],
		[96, 99, 99, 98, 100, 98, 99, 99, 96],
		[96, 96, 96, 96, 100, 96, 96, 96, 96],

		[95, 96, 99, 96, 100, 96, 99, 96, 95],
		[96, 96, 96, 96, 96, 96, 96, 96, 96],
		[97, 96, 100, 99, 101, 99, 100, 96, 97],
		[96, 97, 98, 98, 98, 98, 98, 97, 96],
		[96, 96, 97, 99, 99, 99, 97, 96, 96]
	],

	//卒价值
	z: [
		[9, 9, 9, 11, 13, 11, 9, 9, 9],
		[19, 24, 34, 42, 44, 42, 34, 24, 19],
		[19, 24, 32, 37, 37, 37, 32, 24, 19],
		[19, 23, 27, 29, 30, 29, 27, 23, 19],
		[14, 18, 20, 27, 29, 27, 20, 18, 14],

		[7, 0, 13, 0, 16, 0, 13, 0, 7],
		[7, 0, 7, 0, 15, 0, 7, 0, 7],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	]
}

//黑子为红字价值位置的倒置
com.value.C = com.arr2Clone(com.value.c).reverse();
com.value.M = com.arr2Clone(com.value.m).reverse();
com.value.X = com.value.x;
com.value.S = com.value.s;
com.value.J = com.value.j;
com.value.P = com.arr2Clone(com.value.p).reverse();
com.value.Z = com.arr2Clone(com.value.z).reverse();

//棋子们
com.args = {
	//红子 中文/图片地址/阵营/权重
	'c': { text: "车", images: 'r_c', my: 1, bl: "c", value: com.value.c },
	'm': { text: "马", images: 'r_m', my: 1, bl: "m", value: com.value.m },
	'x': { text: "相", images: 'r_x', my: 1, bl: "x", value: com.value.x },
	's': { text: "仕", images: 'r_s', my: 1, bl: "s", value: com.value.s },
	'j': { text: "帅", images: 'r_j', my: 1, bl: "j", value: com.value.j },
	'p': { text: "炮", images: 'r_p', my: 1, bl: "p", value: com.value.p },
	'z': { text: "兵", images: 'r_z', my: 1, bl: "z", value: com.value.z },

	//蓝子
	'C': { text: "車", images: 'b_c', my: -1, bl: "c", value: com.value.C },
	'M': { text: "馬", images: 'b_m', my: -1, bl: "m", value: com.value.M },
	'X': { text: "象", images: 'b_x', my: -1, bl: "x", value: com.value.X },
	'S': { text: "士", images: 'b_s', my: -1, bl: "s", value: com.value.S },
	'J': { text: "将", images: 'b_j', my: -1, bl: "j", value: com.value.J },
	'P': { text: "炮", images: 'b_p', my: -1, bl: "p", value: com.value.P },
	'Z': { text: "卒", images: 'b_z', my: -1, bl: "z", value: com.value.Z }
};

com.class = com.class || {} //类
com.class.Man = function (key, x, y) {
	this.pater = key.slice(0, 1);
	var o = com.args[this.pater]
	this.x = x || 0;
	this.y = y || 0;
	this.key = key;
	this.my = o.my;
	this.text = o.text;
	this.value = o.value;
	this.isShow = true;
	this.alpha = 1;
	this.ps = []; //着点

	this.show = function () {
		if (this.isShow) {
			com.ct.save();
			com.ct.globalAlpha = this.alpha;
			com.ct.drawImage(com[this.pater].images, com.spaceX * this.x + com.pointStartX, com.spaceY * this.y + com.pointStartY);
			com.ct.restore();
		}
	}

	this.bl = function (map) {
		var map = map || play.map
		return com.bylaw[o.bl](this.x, this.y, map, this.my)
	}
}

com.class.Main = function (images, x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.isShow = true;

	const withdrawBtnWidth = tt.getSystemInfoSync().windowWidth / 8
	const withdrawBtnHeight = withdrawBtnWidth

	const staminaWidth = tt.getSystemInfoSync().windowWidth / 4
	const staminaHeight = withdrawBtnWidth / 1.5

	this.show = function () {
		if (this.isShow) {
			com.ct.drawImage(com.background, 0, 0, tt.getSystemInfoSync().windowWidth, tt.getSystemInfoSync().windowHeight)
			com.ct.drawImage(com.bgImg, com.spaceX * this.x + com.centreX, com.spaceY * this.y + com.centreY)
			com.ct.drawImage(com.withdrawBtn, com.centreX + 5, com.centreY + com.bgImg.height + 20, withdrawBtnWidth, withdrawBtnHeight)
			com.ct.drawImage(com.withdrawBtn, com.centreX + 10 + (com.withdrawBtn.width) * 0.5, com.centreY + com.bgImg.height + 20, withdrawBtnWidth, withdrawBtnHeight)
			com.ct.drawImage(com.withdrawBtn, com.bgImg.width - withdrawBtnWidth + com.centreX + 5, com.centreY + com.bgImg.height + 20, withdrawBtnWidth, withdrawBtnHeight)
			com.ct.drawImage(com.checkpoint, com.centreX + 5, com.centreY - staminaHeight * 2.25, staminaWidth * 0.75, staminaHeight)
			com.ct.drawImage(com.backToHomepage, com.centreX - 5, com.centreY - staminaHeight * 4, staminaWidth * 0.55, staminaWidth * 0.55)

			this.levelName(com.ct)
			this.withdrawText(com.ct)
			this.promptText(com.ct)
			this.revisitText(com.ct)
			this.staminaIconNum(com.ct)
			canvas.addEventListener('touchstart', this.touchEvent)
		}
	}

	this.levelName = function (ctx) {
		const levelNameText = com.clasli[play.checkpoint1.clasli].name
		const firstPart = levelNameText.split("：")[0]
		const secondPart = levelNameText.split("：")[1]
		ctx.fillStyle = '#DED1B4'

		let fontSize = parseInt(withdrawBtnWidth / 4)
		let wordCount = firstPart.length
		if (wordCount > 3) {
			fontSize *= Math.pow(0.85, (wordCount - 3))
		}

		ctx.font = `${fontSize}px Arial`
		ctx.fillText(`${firstPart}`, com.centreX + 3 + (staminaWidth * 0.75 - parseInt(withdrawBtnWidth / 4) * 3) / 2, com.centreY - staminaHeight * 2.25 + (staminaHeight + parseInt(withdrawBtnWidth / 4)) * 0.45)

		ctx.fillStyle = '#E9D9B4'
		ctx.font = `${parseInt(withdrawBtnWidth / 2.2)}px Arial`
		ctx.fillText(`${secondPart}`, com.centreX + 5, com.centreY - staminaHeight * 0.3)

	}

	this.withdrawText = function (ctx) {
		ctx.fillStyle = '#F9D195'
		ctx.font = `${parseInt(withdrawBtnWidth / 4)}px Arial`
		ctx.fillText('悔棋', com.centreX + 10 + (com.withdrawBtn.width) * 0.5 + (withdrawBtnWidth - parseInt(withdrawBtnWidth / 2)) / 2, com.spaceY * this.y + com.centreY + com.bgImg.height + withdrawBtnHeight - parseInt(withdrawBtnWidth / 12))
	}

	this.promptText = function (ctx) {
		ctx.fillStyle = '#F9D195'
		ctx.font = `${parseInt(withdrawBtnWidth / 4)}px Arial`
		ctx.fillText('支招', com.spaceX * this.x + com.centreX + 5 + (withdrawBtnWidth - parseInt(withdrawBtnWidth / 2)) / 2, com.centreY + com.bgImg.height + withdrawBtnHeight - parseInt(withdrawBtnWidth / 12))
	}

	this.revisitText = function (ctx) {
		ctx.fillStyle = '#F9D195'
		ctx.font = `${parseInt(withdrawBtnWidth / 4)}px Arial`
		ctx.fillText('重来', com.bgImg.width - withdrawBtnWidth + com.centreX + 5 + (withdrawBtnWidth - parseInt(withdrawBtnWidth / 2)) / 2, com.centreY + com.bgImg.height + withdrawBtnHeight - parseInt(withdrawBtnWidth / 12))
	}

	this.touchEvent = function (e) {
		e.preventDefault()
		const x = e.touches[0].clientX
		const y = e.touches[0].clientY

		if (this.lastCollisionTime1 === undefined) {
			this.lastCollisionTime1 = Date.now()
		} else {
			if (Date.now() - this.lastCollisionTime1 < 500) {
				return
			}
			this.lastCollisionTime1 = Date.now()
		}

		if (x >= com.centreX + 5
			&& x <= com.centreX + 5 + withdrawBtnWidth
			&& y >= com.centreY + com.bgImg.height + 20
			&& y <= com.centreY + com.bgImg.height + 20 + withdrawBtnHeight) {
			if (play.stamina.stamina <= 1) {
				tt.showModal({
					title: "体力不足",
					content: "是否观看广告，获取体力值",
					confirmText: "确定",
					success(res) {
						if (res.confirm) {
							const rewardedVideoAd = tt.createRewardedVideoAd({
								adUnitId: '21o0p96tp0u95im7qf'
							})
							rewardedVideoAd.show()
							rewardedVideoAd.onClose((res) => {
								if (res && res.isEnded) {
									console.log(res)
									play.stamina.staminaAdd(6)
									play.stamina.setStorage()
									updateStaminaText(com.ct)
								}
							})
						}
					},
				});
			} else {
				play.stamina.staminaLow(2)
				play.stamina.setStorage()
				updateStaminaText(com.ct)
				setTimeout(() => {
					const val1 = AI.getAlphaBeta(-99999, 99999, 4, com.arr2Clone(play.map), 1)
					const map1 = play.mans[val1.key]
					console.log('最佳着法：' + com.createMove(com.arr2Clone(play.map), map1.x, map1.y, val1.x, val1.y))
					tt.showModal({
						title: "最佳着法",
						content: com.createMove(com.arr2Clone(play.map), map1.x, map1.y, val1.x, val1.y),
						confirmText: "确定",
						showCancel: false
					});
				}, 300)
			}
		}

		if (x >= com.bgImg.width - withdrawBtnWidth + com.centreX + 5
			&& x <= com.bgImg.width + com.centreX + 5
			&& y >= com.centreY + com.bgImg.height + 20
			&& y <= com.centreY + com.bgImg.height + 20 + withdrawBtnHeight) {
			play.init(4, play.nowMap)
		}

		if (x >= com.centreX - 5
			&& x <= com.centreX - 5 + staminaWidth * 0.55
			&& y >= com.centreY - staminaHeight * 4
			&& y <= com.centreY - staminaHeight * 4 + staminaWidth * 0.55) {
			play.isPlay = false
			play.main.prototype.startPage()
		}

		if (x >= com.centreX + 10 + (com.withdrawBtn.width) * 0.5
			&& x <= com.centreX + 10 + (com.withdrawBtn.width) * 0.5 + withdrawBtnWidth
			&& y >= com.centreY + com.bgImg.height + 20
			&& y <= com.centreY + com.bgImg.height + 20 + withdrawBtnHeight) {
			setTimeout(() => {
				if (play.stamina.stamina <= 1) {
					tt.showModal({
						title: "体力不足",
						content: "是否观看广告，获取体力值",
						confirmText: "确定",
						success(res) {
							if (res.confirm) {
								if (res.confirm) {
									const rewardedVideoAd = tt.createRewardedVideoAd({
										adUnitId: '21o0p96tp0u95im7qf'
									})
									rewardedVideoAd.show()
									rewardedVideoAd.onClose((res) => {
										if (res && res.isEnded) {
											console.log(res)
											play.stamina.staminaAdd(6)
											play.stamina.setStorage()
											updateStaminaText(com.ct)
										}
									})
								}
							}
						},
					});
				} else {
					play.stamina.staminaLow(2)
					play.stamina.setStorage()
					updateStaminaText(com.ct)
					setTimeout(() => {
						play.regret()
					}, 300)
				}
			}, 300)
		}
	}

	const updateStaminaText = (ctx) => {
		com.ct.drawImage(com.staminaIcon, com.bgImg.width - staminaWidth + com.centreX + 5, com.centreY - staminaHeight * 2, staminaWidth, staminaHeight)
		com.ct.drawImage(com.staminaIcon2, com.bgImg.width - staminaWidth + com.centreX, com.centreY - staminaHeight * 2.2, staminaHeight, staminaHeight * 1.49)
		com.ct.drawImage(com.staminaIcon3, com.bgImg.width - staminaHeight + com.centreX + 5, com.centreY - staminaHeight * 2.1, staminaHeight * 1.1, staminaHeight * 1.1)
		const text = `${play.stamina.stamina}`
		ctx.fillText(
			text,
			com.bgImg.width + com.centreX - staminaWidth / 2 - ((play.stamina.stamina.toString().split('').length + 1) * (staminaWidth / 5)) / 2 + (staminaWidth - parseInt(staminaWidth / 1.5)) / 2,
			com.centreY - parseInt(staminaWidth / 2.3)
		)
	}

	this.staminaIconNum = function (ctx) {
		ctx.fillStyle = '#FFFFFF'
		ctx.font = `${parseInt(staminaWidth / 5)}px Arial`
		updateStaminaText(ctx)
	}

}

com.class.Pane = function (images, x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.newX = x || 0;
	this.newY = y || 0;
	this.isShow = true;

	this.show = function () {
		if (this.isShow) {
			com.ct.drawImage(com.paneImg, com.spaceX * this.x + com.pointStartX, com.spaceY * this.y + com.pointStartY)
			com.ct.drawImage(com.paneImg, com.spaceX * this.newX + com.pointStartX, com.spaceY * this.newY + com.pointStartY)
		}
	}
}

com.class.Dot = function (images, x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.isShow = true;
	this.dots = []

	this.show = function () {
		for (var i = 0; i < this.dots.length; i++) {
			if (this.isShow) com.ct.drawImage(com.dotImg, com.spaceX * this.dots[i][0] + 10 + com.pointStartX, com.spaceY * this.dots[i][1] + 10 + com.pointStartY)
		}
	}
}

//获取ID
com.get = function (id) {
	return document.getElementById(id)
}

com.main = new com.class.Main();
com.dot = new com.class.Dot();
com.pane = new com.class.Pane();
com.pane.isShow = false;

com.childList = [com.main, com.dot, com.pane];
com.mans = {};		//棋子集合

com.init();

window.com = com

