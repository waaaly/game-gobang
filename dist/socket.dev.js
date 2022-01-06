"use strict";

var ws = new WebSocket("ws://192.168.91.3:911");
var myWSId = -1;
var curRoomId = -1;
var curRoom = null;

function send(obj) {
  ws.send(JSON.stringify(obj));
}

function parse(msg) {
  return JSON.parse(msg);
}

function enteryRoom(roomId) {
  if (curRoomId === roomId) {
    window.alert('您已在当前房间！');
    return;
  }

  curRoomId = roomId;
  var msg = {
    type: 'entery-room',
    userId: myWSId,
    roomId: roomId
  };
  send(msg);
}

function createRoom() {
  var msg = {
    type: 'create-room',
    userId: myWSId
  };
  send(msg);
}

function leaveRoom() {
  var msg = {
    type: 'leave-room',
    roomId: curRoomId,
    userId: myWSId
  };
  send(msg);
}

function win(color) {
  var msg = {
    type: 'win',
    winner: color,
    roomId: curRoomId
  };
  send(msg);
}

function restart() {
  if (!curRoom || isMeViewer()) {
    console.log(6, curRoom);
    return;
  }

  var msg = {
    type: 'restart',
    roomId: curRoomId,
    userId: myWSId
  };
  send(msg);
}

function sendChat(content, id) {
  var msg = {
    type: 'chat-msg',
    chat: {
      roomId: curRoomId,
      id: id ? id : myWSId,
      content: content
    }
  };
  send(msg);
}

function sendChatMsg(e) {
  if (!curRoom) {
    return;
  }

  sendChat(e.target.value);
}

function connect() {
  //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
  ws.onopen = function () {
    //当WebSocket创建成功时，触发onopen事件
    console.log("open");
    var msg = {
      type: 'login'
    };
    send(msg); //将消息发送到服务端
  }; //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据


  ws.onmessage = function (e) {
    var msg = parse(e.data);
    console.log('get msg:\n', msg);

    switch (msg.type) {
      case 'login':
        myWSId = msg.userId;
        document.getElementById('myid').innerText = "\u6211\u7684ID:" + myWSId;
        renderRoom(msg.roomList);
        renderUser(msg.userList);
        break;

      case 'bro-login':
        renderUser(msg.userList);
        break;

      case 'bro-create-room':
        console.log('创建房间成功，id：', msg.room.id);
        renderMsg('创建房间成功，id：' + msg.room.id);

        if (msg.room.withe === myWSId || msg.room.black === myWSId) {
          curRoomId = msg.room.id;
          curRoom = msg.room;
          sendChat('创建房间成功，id：' + msg.room.id, 'system');
          renderCuroom(true);
          renderTips(msg.room);
          renderPlayer(msg.room);
          renderRoom(msg.roomList);
          renderCreateBtn(false);
        } else {
          renderCreateBtn(true);
          renderRoom(msg.roomList);
        }

        break;

      case 'bro-entery-room':
        console.log('进入房间成功，id：', msg.room.id);

        if (msg.room.id === curRoomId) {
          curRoom = msg.room;
          renderMsg('玩家：' + msg.userId + '进入房间');
          sendChat('玩家：' + msg.userId + '进入房间', 'system'); // 重新绘制棋盘

          reDraw(msg.room.bArr, msg.room.wArr);
          renderCuroom(true);
          renderCreateBtn(false);
          renderPlayer(msg.room);
          renderViewer(msg.room.viewer);
        }

        if (msg.room.withe === myWSId || msg.room.black === myWSId) {
          reDraw(msg.room.bArr, msg.room.wArr);
          renderTips(msg.room);
        }

        renderRoom(msg.roomList);
        break;

      case 'bro-leave-room':
        if (msg.room && msg.room.id === curRoomId) {
          renderMsg('玩家：' + msg.userId + '离开房间');
          sendChat('玩家：' + msg.userId + '离开房间', 'system');
          renderPlayer(msg.room);
          renderViewer(msg.room.viewer);
        } // 我


        if (msg.userId === myWSId) {
          renderCuroom(false);
          renderCreateBtn(true); //清空棋盘

          clearCanvas();
          drawBoard();
          renderTips(msg.room);
        } // 对手


        if (msg.room && (msg.room.withe === myWSId || msg.room.black === myWSId)) {
          renderPlayer(msg.room);
        }

        curRoomId = -1;
        curRoom = null;
        renderRoom(msg.roomList);
        break;

      case 'bro-drop-piece':
        if (msg.room.id === curRoomId) {
          curRoom = msg.room;

          if (msg.room.last) {
            clearRedDot();
          }

          drawPiece(msg.room.curr.x, msg.room.curr.y, msg.room.curr.color === 'black' ? 0 : 1);
          renderRedDot(msg.room.curr.x, msg.room.curr.y);

          if (msg.room.curr.color === 'black') {
            if (isWin(msg.room.bArr)) {
              win('black');
            }
          }

          if (msg.room.curr.color === 'withe') {
            if (isWin(msg.room.wArr)) {
              win('withe');
            }
          }
        }

        if (msg.room.withe === myWSId || msg.room.black === myWSId) {
          renderTips(msg.room);
        }

        break;

      case 'bro-win':
        if (msg.room.id === curRoomId) {
          curRoom = msg.room;
          renderMsg(msg.room.winner === 'black' ? '黑子获胜！' : '白子获胜', 10000);
          sendChat(msg.room.winner === 'black' ? '黑子获胜！' : '白子获胜', 'system');
        }

        break;

      case 'bro-restart':
        if (msg.room.id === curRoomId) {
          clearRedDot();
          curRoom = msg.room;
          clearCanvas();
          drawBoard();
          renderPlayer(msg.room);
        }

        break;

      case 'bro-chat-msg':
        if (msg.room.id === curRoomId) {
          renderChat(msg.room.chatArr);
        }

        break;

      case 'bro-close':
        send({
          type: 'close-client-reply',
          id: myWSId
        });
        break;

      case 'close-server-reply':
        renderUser(msg.userList);
        break;
    }
  }; //当客户端收到服务端发送的关闭连接请求时，触发onclose事件


  ws.onclose = function (e) {
    console.log("close", e);
  }; //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件


  ws.onerror = function (e) {
    console.log(e);
  };
}

connect();