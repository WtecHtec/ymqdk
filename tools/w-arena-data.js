// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid')
const data = require('./arena.json')
console.log(data.length, uuidv4())





const mysql = require("mysql2");


function formatDate(date, fmt) {
	const weekMap = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' };
	const day = date.getDay();
	const o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'H+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		S: date.getMilliseconds(), // 毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
	if (/(w+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, weekMap[day]);
	if (/(W+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, day === 0 || day === 6 ? `(${weekMap[day]})` : '');
	for (const k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length));
		}
	}
	return fmt;
}
//创建一个连接
const connection = mysql.createConnection({
	host: "1.116.139.149",
	port: 3306,
	database: "ymq_dk",
	user: "root",
	password: "oneX8748",
});

let statement = 'insert into arena (arena_id, arena_name, arena_longitude, arena_latitude, arena_belong,create_id, arena_location, create_time, update_time) VALUES';

data.forEach(({ arena_name, arena_longitude, arena_latitude }, i) => {
	statement = `${statement} ('${uuidv4()}', '${arena_name}', '${arena_longitude}', '${arena_latitude}', '深圳', 'root', '深圳', '${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')}', '${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')}')${i < data.length - 1 ? ',' : ';'}`
})

// console.log(statement)
// DDL/DML/DQL/DCL
connection.query(statement, (err, values, fields) => {
	if (err) {
		console.log("查询失败:", err);
		return;
	}
	// console.log(values); // 查看结果
	console.log('成功')
	// console.log(fields);   //字段相关信息
});