var io = require('socket.io')();
//在线用户
var users = {};
io.sockets.on('connection', function(socket) {
    //有人上线
    socket.on('online', function (data) {
        //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
        socket.name = data.user;
        //users 对象中不存在该用户名则插入该用户名
        if (!users[data.user]) {
            users[data.user] = data.user;
        }
        //向所有用户广播该用户上线信息
        io.sockets.emit('online', {users: users, user: data.user});
    });

    //有人发话
    socket.on('say', function (data) {
        if (data.to == 'all') {
            //向其他所有用户广播该用户发话信息
            socket.broadcast.emit('say', data);
        } else {
            //向特定用户发送该用户发话信息
            //clients 为存储所有连接对象的数组
            var clients = io.sockets.clients();
            //遍历找到该用户
            clients.forEach(function (client) {
                if (client.name == data.to) {
                    //触发该用户客户端的 say 事件
                    client.emit('say', data);
                }
            });
        }
    });

    //有人下线
    socket.on('disconnect', function() {
        //若 users 对象中保存了该用户名
        if (users[socket.name]) {
            //从 users 对象中删除该用户名
            delete users[socket.name];
            //向其他所有用户广播该用户下线信息
            socket.broadcast.emit('offline', {users: users, user: socket.name});
        }
    });
});

//导出监听的方法
exports.listen = function(server) {
    return io.listen(server);
};