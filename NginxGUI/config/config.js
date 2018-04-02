import shelljs from 'shelljs';
import path from 'path';
import fs from 'fs';

export default configPath = {
	nginxPathDefault: '/usr/local/etc/nginx/nginx.conf',
	getNignxPathCMD: 'find /usr -name nginx.conf',
    configList: path.join(__dirname, '../config/config-list.json')
};

export let setConfList = (str) => { // 此时配置文件一定存在, 不存在的话在上层逻辑新建

};

export let getConfList = (cb) => {
	if (fs.existsSync(configPath.configList)) {
		cb(new Error('不存在'));
	} else {
	    let text = shelljs.cat(configPath.configList);
	    console.log(JSON.parse(text));
		cb(null, text);
	}
};