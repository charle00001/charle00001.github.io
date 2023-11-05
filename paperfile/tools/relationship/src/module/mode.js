/*
 * 模式数据
*/
import _map from './map';

let _mode = {};                             // 模式缓存
let modeData = Object.assign({},_map);      // 最终数据

// 设置模式数据
export function setModeData(sign,data){
    _mode[sign] = Object.assign(_mode[sign]||{},data);
};

// 获取模式数据
export function getModeData(sign){
    modeData = Object.assign({},_map);
    if(sign&&_mode[sign]){
        for(let key in _mode[sign]){
            modeData[key] = [].concat(_mode[sign][key],_map[key]||[]);
        }
    }
    return modeData;
};

export {modeData};
