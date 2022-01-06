"use strict";

var canvasCtx = null;
var witheArr = [];

function drawPiece(x, y, count) {
  if (canvasCtx) {
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, 10, 0, 2 * Math.PI);
    var chessstyle = canvasCtx.createRadialGradient(x + 2, y - 2, 10, x + 2, y - 2, 1);

    if (count % 2 === 0) {
      chessstyle.addColorStop(0, '#0A0A0A');
      chessstyle.addColorStop(1, '#636766');
    } else {
      chessstyle.addColorStop(0, '#D1D1D1');
      chessstyle.addColorStop(1, '#F9F9F9');
    }

    canvasCtx.fillStyle = chessstyle;
    canvasCtx.fill();
    canvasCtx.closePath();
  }
}

function drawBoard(el) {
  if (!el) {
    el = document.getElementById('canvas');
  }

  canvasCtx = el.getContext('2d');
  canvasCtx.beginPath(); // 新建一条path

  for (var i = 1; i < 22; i++) {
    canvasCtx.moveTo(30, 30 * i); // 把画笔移动到指定的坐标

    canvasCtx.lineTo(630, 30 * i); // 绘制一条从当前位置到指定坐标(200, 50)的直线.

    canvasCtx.moveTo(30 * i, 30); // 把画笔移动到指定的坐标

    canvasCtx.lineTo(30 * i, 630); // 绘制一条从当前位置到指定坐标(200, 50)的直线.
  } // 闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做


  canvasCtx.closePath();
  canvasCtx.stroke(); // 绘制路径。
}

function reDraw(bArr, wArr) {
  bArr.forEach(function (item) {
    drawPiece(item[0], item[1], 0);
  });
  wArr.forEach(function (item) {
    drawPiece(item[0], item[1], 1);
  });
}

function clearCanvas() {
  var c = document.getElementById("canvas");
  var cxt = c.getContext("2d");
  c.height = c.height;
}

function isMeBlack() {
  if (!curRoom) {
    return false;
  }

  return curRoom.black === myWSId;
}

function isMeWithe() {
  if (!curRoom) {
    return false;
  }

  return curRoom.withe === myWSId;
}

function isMeViewer() {
  if (!curRoom) {
    return false;
  }

  return curRoom.black !== myWSId && curRoom.withe !== myWSId;
}

function boolB() {
  if (!curRoom) {
    return false;
  }

  return Boolean(curRoom.bArr.length);
}

function boolW() {
  return Boolean(curRoom.wArr.length);
}

function isHasDrop(x, y) {
  var bArr = curRoom.bArr,
      wArr = curRoom.wArr;
  var isDrop = false;
  bArr.forEach(function (item) {
    if (x === item[0] && y === item[1]) {
      isDrop = true;
    }
  });
  wArr.forEach(function (item) {
    if (x === item[0] && y === item[1]) {
      isDrop = true;
    }
  });
  return isDrop;
}

function canvasClick(clientX, clientY, el) {
  var x = Math.round((clientX - el.offsetLeft) / 30) * 30;
  var y = Math.round((clientY - el.offsetTop) / 30) * 30;
  var tips = document.getElementById('text');

  if (!curRoom || !curRoom.withe || !curRoom.black || curRoom.winner || isHasDrop(x, y)) {
    console.log(1, curRoom);
    return;
  }

  if (curRoom.black !== myWSId && curRoom.withe !== myWSId) {
    console.log(2, curRoom);
    return;
  }

  if (isMeBlack() && curRoom.color === 'withe') {
    console.log(3, curRoom);
    return;
  }

  if (isMeWithe() && curRoom.color === 'black') {
    console.log(4, curRoom);
    return;
  }

  if (curRoom.winner && boolB() !== boolW()) {
    console.log(5, curRoom);
    return;
  }

  var blackUserId = curRoom.black,
      witheUserId = curRoom.withe;
  msg = {}; // 我拿黑子

  if (blackUserId === myWSId && curRoom.color === 'black') {
    drawPiece(x, y, 0);
    msg['type'] = 'drop-piece';
    msg['curPiece'] = {
      x: x,
      y: y,
      color: 'black'
    };
    msg['roomId'] = curRoom.id;
    send(msg);
    tips.innerText = '白子';
  } // 我拿白子


  if (witheUserId === myWSId && curRoom.color === 'withe') {
    drawPiece(x, y, 1);
    msg['type'] = 'drop-piece';
    msg['curPiece'] = {
      x: x,
      y: y,
      color: 'withe'
    };
    msg['roomId'] = curRoom.id;
    send(msg);
    tips.innerText = '黑子';
  }
}

function renderMsg(msg) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1500;
  var sysmsg = document.getElementById('sysmsg');
  sysmsg.innerText = '系统消息：' + msg;
  sysmsg.style.display = 'block';
  setTimeout(function () {
    sysmsg.style.display = 'none';
  }, time);
}

function renderRoomItem(id) {
  var li = document.createElement('li');
  li.id = id;
  li.innerText = id;
  var btn = document.createElement('button');
  btn.innerText = '进入';
  btn.disabled = id === curRoomId ? true : false;

  btn.onclick = function () {
    enteryRoom(id);
  };

  li.appendChild(btn);
  return li;
}

function renderRoom(roomList) {
  var room = document.getElementById('room');

  while (room.childNodes.length > 0) {
    room.removeChild(room.childNodes[0]);
  }

  var legend = document.createElement('legend');
  legend.innerText = '房间列表';
  room.append(legend);
  roomList.forEach(function (item) {
    room.appendChild(renderRoomItem(item.id));
  });
}

function renderUserItem(id) {
  var li = document.createElement('li');
  li.id = id;
  li.innerText = id;

  if (id === myWSId) {
    li.style.color = 'red';
    li.innerText = li.innerText + '（自己）';
  }

  return li;
}

function renderUser(userList) {
  var user = document.getElementById('user');

  while (user.childNodes.length > 0) {
    user.removeChild(user.childNodes[0]);
  }

  var legend = document.createElement('legend');
  legend.innerText = '用户列表';
  user.append(legend);
  userList.forEach(function (item) {
    user.appendChild(renderUserItem(item));
  });
}

function renderTips(room) {
  var roomId = document.getElementById('roomid');
  var myColor = document.getElementById('mycolor');
  var text = document.getElementById('text');

  if (room && (room.black === myWSId || room.withe === myWSId)) {
    roomId.innerText = '您当前的房间号：' + room.id;

    if (room.withe === myWSId) {
      myColor.innerText = '您手持白子';
    } else {
      myColor.innerText = '您手持黑子';
    }

    if (room.color) {
      text.innerText = room.color === 'black' ? '当前落子：黑子' : '当前落子：白子';
    }
  } else {
    roomId.innerText = null;
    myColor.innerText = null;
    text.innerText = null;
  }
}

function renderCreateBtn(isShow) {
  var createBtn = document.getElementById('create-room'),
      leaveBtn = document.getElementById('leave-room');

  if (isShow) {
    createBtn.style.display = 'block';
    leaveBtn.style.display = 'none';
  } else {
    createBtn.style.display = 'none';
    leaveBtn.style.display = 'block';
  }
}

function renderCuroom(isShow) {
  var curoom = document.getElementById('curoom');

  if (isShow) {
    curoom.style.display = 'block';
  } else {
    curoom.style.display = 'none';
  }
}

function renderPlayer(room) {
  var bPlayer = document.getElementById('b-player'),
      wPlayer = document.getElementById('w-player');

  if (room.black === null) {
    bPlayer.innerText = '黑子：' + '等待玩家进入';
  } else {
    if (room.winner && boolB() !== boolW() && room.bArr.length !== 0) {
      bPlayer.innerText = '黑子：' + room.black + '等待玩家重新开始';
    } else {
      bPlayer.innerText = '黑子：' + room.black;
    }
  }

  if (room.withe === null) {
    wPlayer.innerText = '白子：' + '等待玩家进入';
  } else {
    if (room.winner && boolB() !== boolW() && room.wArr.length !== 0) {
      wPlayer.innerText = '白子：' + room.withe + '等待玩家重新开始';
    } else {
      wPlayer.innerText = '白子：' + room.withe;
    }
  }
}

function renderViewer(viewerList) {
  var viewer = document.getElementById('viewer');

  while (viewer.childNodes.length > 0) {
    viewer.removeChild(viewer.childNodes[0]);
  }

  var legend = document.createElement('legend');
  legend.innerText = '观众列表';
  viewer.append(legend);
  viewerList.forEach(function (item) {
    viewer.appendChild(renderUserItem(item));
  });
}

function renderChat(chatList) {
  var chatContent = document.getElementById('chat-content');

  while (chatContent.childNodes.length > 0) {
    chatContent.removeChild(chatContent.childNodes[0]);
  }

  console.log(chatList);
  chatList.forEach(function (item) {
    chatContent.appendChild(renderChatItem(item));
  });
}

function renderChatItem(chat) {
  var chatItem = document.createElement('div');
  chatItem.innerText = chat.content;

  if (chat.id === 'system') {
    chatItem.style.textAlign = 'center';
  } else if (chat.id === myWSId) {
    chatItem.style.textAlign = 'end';
    chatItem.innerText = "".concat(chat.content, ":[\u6211]\u8BF4");
  } else {
    chatItem.innerText = "[\u73A9\u5BB6".concat(chat.id, "]\u8BF4\uFF1A").concat(chat.content);
  }

  return chatItem;
}

function renderRedDot(x, y) {
  var wuzi = document.getElementById('wuzi');
  var canvas = document.getElementById('canvas');
  var redDot = document.createElement('div');
  redDot.id = 'red-dot';
  redDot.style.height = '8px';
  redDot.style.width = '8px';
  redDot.style.background = 'red';
  redDot.style.borderRadius = '50%';
  redDot.style.position = 'absolute';
  redDot.style.top = 35 + y + 'px';
  redDot.style.left = 235 + x + 'px';
  wuzi.appendChild(redDot);
}

function clearRedDot() {
  var wuzi = document.getElementById('wuzi');
  var redDot = document.getElementById('red-dot');

  if (redDot) {
    wuzi.removeChild(redDot);
  }
}

function start() {
  var el = document.getElementById('canvas');

  if (el) {
    drawBoard(el);

    el.onclick = function (e) {
      canvasClick(e.clientX, e.clientY, el);
    };
  }
}

start();