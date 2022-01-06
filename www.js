const WebSocket = require('ws').Server

const wss = new WebSocket({port:911})

var roomList = [];
var userList = []

//广播
const broadcast = (obj)=>{	
	wss.clients.forEach(client=> {
			client.send(JSON.stringify(obj));
		});	
}


wss.on('connection', function (ws) {
    console.log('服务端：客户端已连接,当前人数:',wss.clients.size);
    
    function send(obj){
        ws.send(JSON.stringify(obj))
    }
    function parse(msg){
        return JSON.parse(msg.toString())
    }
    /**
     * 根据id获取房间
     * @param {*} id 
     * @param {*} index 是否返回下标
     * @returns 
     */
    function getRoom(id,index){
        let len = roomList.length;
        if(len === 0){
            return
        }

        while(len --){
            if(roomList[len].id === id){
                if(index){
                    return len
                }
                return roomList[len]
            }
        }
    }
    /**
     * 修改房间
     * @param {*} id 房间下标
     * @param {*} room 房间对象
     */
    function setRoom(id,room){
        let index = getRoom(id,true);
        if(room === null){
            roomList.splice(index, 1)
        }else{
            roomList[index] = room
        }
    }
    /**
     * 检查房间中人员是否还在线
     */
    function checkRoom(){
        let data = roomList.map(item=>{return item})
        data.forEach((item,index)=>{
            let bIndex = -1, wIndex = -1 ;
            if(item.black != null){
                bIndex = userList.indexOf(item.black)
            }
            if(item.withe !== null){
                wIndex = userList.indexOf(item.withe)
            }
            if(bIndex === -1 && wIndex === -1 && item.viewer.length === 0){
                roomList.splice(index,1)
            }
        })
    }
    /**
     * 登录
     */
    function replyLogin(){
        let id = parseInt(Math.random()*1000)
        userList.push(id)
        checkRoom()
        send({type:'login',roomList,userList,userId:id})
        broadcast({type:'bro-login',userList})
    }
    
    /**
     *  创建房间
     * @param {*} msg 
     */
    function replyCreateRoom(msg){
        let roomId = parseInt(Math.random()*1000)
        let room = {};
        room['id'] = roomId;
        room['color'] = 'black';
        room['black'] = msg.userId;
        room['withe'] = null;
        room['viewer'] = [];
        room['bArr'] = [];
        room['wArr'] = [];
        room['last'] = null;
        room['curr'] = null;
        room['winner'] = null;
        room['chatArr'] = [];
        roomList.push(room)
        broadcast({type:'bro-create-room',roomList,room})
    }
    /**
     *  进入房间
     * @param {*} msg 
     */
    function replyEnteryRoom(msg){
        let room = getRoom( msg.roomId)
        
        if(!room.black){
            room.black = msg.userId;
        }
        if(!room.withe){
            room.withe = msg.userId;
        }
        if(room.black!==msg.userId  &&  room.withe!==msg.userId){
            if(room.viewer.indexOf(msg.userId) < 0){
                room.viewer.push(msg.userId)
            }
        }
        setRoom(msg.roomId,room)
        broadcast({type:'bro-entery-room',roomList,room,userId:msg.userId})
    }
    /**
     *  离开房间
     * @param {*} msg 
     */
    function replyLeaveRoom(msg){
        let room = getRoom(msg.roomId)
            viewerIndex = room && room.viewer.indexOf(msg.userId) || -1
        if(room.black === msg.userId){
            room.black = null
        }
        if(room.withe === msg.userId){
            room.withe = null
        }
        if(viewerIndex > 0){
            room.viewer.splice(room.viewer,1)
        }
        if(room.black === null && room.withe === null){
            room = null
        }
        setRoom(msg.roomId,room)
        checkRoom()
        broadcast({type:'bro-leave-room',roomList,room,userId:msg.userId})
    }
    /**
     *  落子
     * @param {*} msg 
     */
    function replyDropPiece(msg){
        let room = getRoom(msg.roomId )
        // 第一次落子
        if(room.curr === null && room.last === null){
            room.curr = msg.curPiece
        }else{
            room.last = room.curr
            room.curr = msg.curPiece
        }
        if(msg.curPiece.color === 'black'){
            room.color = 'withe'
            room.bArr.push([msg.curPiece.x,msg.curPiece.y])
        }else{
            room.color = 'black'
            room.wArr.push([msg.curPiece.x,msg.curPiece.y])
        }
        setRoom(msg.roomId,room)
        broadcast({type:'bro-drop-piece',roomList,room})
    }
    function replyWin(msg){
        let room = getRoom(msg.roomId)
        room.winner = msg.winner
        setRoom(room)
        broadcast({type:'bro-win',roomList,room})
    }
    /**
     * 重启开始游戏
     * @param {*} msg 
     */
    function replyRestart(msg){
        let room = getRoom(msg.roomId);
        
        if(room.black === msg.userId){
            room.winner = true
            room.bArr = []
        }
        if(room.withe === msg.userId){
            room.winner = true
            room.wArr = []
        }
        if(room.bArr.length === 0 && room.wArr.length === 0){
            room.last = null;
            room.curr = null;
            room.winner = null;
        }
        setRoom(room)
        broadcast({type:'bro-restart',roomList,room})
    }
    /**
     * 聊天室消息
     * @param {*} msg 
     */
    function replyChatMsg(msg){
        let room = getRoom(msg.chat.roomId)
        room.chatArr.push(msg.chat)
        setRoom(room)
        broadcast({type:'bro-chat-msg',roomList,room})
    }
    /**
     *  关闭ws
     * @param {*} msg 
     */
    function colseWS(msg){
        
        userList.push(msg.id)
        send({type:'close-server-reply',userList,})
    }
    ws.on('message', function (message) {
        //打印客户端监听的消息
        let msg = parse(message)
        console.log(msg)
        
        switch(msg.type){
            case 'login':
                replyLogin()
                break;
            case 'create-room':
                replyCreateRoom(msg)
                break;
            case 'entery-room':
                replyEnteryRoom(msg)
                break;
            case 'leave-room':
                replyLeaveRoom(msg);
                break;
            case 'drop-piece':
                replyDropPiece(msg)
                break;
            case 'win':
                replyWin(msg);
                break;
            case 'restart':
                replyRestart(msg)
                break;
            case 'chat-msg':
                replyChatMsg(msg);
                break;
            case 'close-client-reply':
                colseWS(msg)
                break;
        }
    });
    ws.on('close',(msg)=>{
        console.log('有人离开',msg)
        userList = []
        broadcast({type:'bro-close'})
    })
});
