/*
 * 通过表达式获取配置
*/
import _expression from './rule/expression';

export function getOptions(text){
    for(let item of _expression){
        let match = text.match(item['exp']);
        if(match){
            return item['opt'](match);
        }
    }
    return {};
};
