/*
 * 标识符 - 唯一性关系链，将【关系链】转换成【中文表述】
*/
import _pair from './data/pair';

import {number2zh} from './unit';
import {selector2id} from './selector';
import {modeData} from './mode';

// 逆转ID
export function reverseId(id,sex){
    let hash = {
        f:['d','s'],
        m:['d','s'],
        h:['w',''],
        w:['','h'],
        s:['m','f'],
        d:['m','f'],
        lb:['os','ob'],
        ob:['ls','lb'],
        xb:['xs','xb'],
        ls:['os','ob'],
        os:['ls','lb'],
        xs:['xs','xb']
    };
    let age = '';
    if(id.match(/&o$/)){
        age = '&l';
    }else if(id.match(/&l$/)){
        age = '&o';
    }
    if(id){
        id = id.replace(/&[ol\d+]/g,'');
        //性别判断
        if(sex<0){
            if(id.match(/^w/)){
                sex = 1;
            }else if(id.match(/^h/)){
                sex = 0;
            }
        }
        let result = [];
        let doing = function(sex){
            let sid = (','+sex+','+id).replace(/,[fhs]|,[olx]b/g,',1').replace(/,[mwd]|,[olx]s/g,',0');
            sid = sid.substring(0,sid.length-2);
            let id_arr = id.split(',').reverse();
            let sid_arr = sid.split(',').reverse();
            let arr = id_arr.map((id,i)=>hash[id][sid_arr[i]]);
            let r_id = arr.join(',');
            let gen = getGenById(r_id);
            return r_id +(gen?'':age);
        };
        if(sex<0){
            result.push(doing(1));
            result.push(doing(0));
        }else{
            result.push(doing(sex));
        }
        return result;
    }
    return [''];
};

// ID列表去重
export function filterId(arr){
    let sameList = arr.filter(item=>item==item.replace(/[ol](?=[s|b])/g,'x').replace(/&[ol]/,''));
    return arr.filter(item=>{
        let temp = item.replace(/[ol](?=[s|b])/g,'x').replace(/&[ol]/,'');
        return sameList.includes(item)||item!=temp&&!sameList.includes(temp);
    }).filter((item,idx,arr) => arr.indexOf(item) === idx);
};

// 通过ID获取世代数
export function getGenById(id){
    let gMap = {'f':1,'m':1,'s':-1,'d':-1};
    let gen = 0;
    id.split(',').forEach(function(sub){
        let s = sub.replace(/&[ol\d]+/,'');
        gen += gMap[s]||0;
    });
    return gen;
};

// 通过ID获取关系称呼
export function getItemsById(id){
    let items = [];
    let getData = function(key){
        let ids = [];
        let k1 = key.replace(/(,[sd])(,[wh])?$/,'$1&o$2');
        let k2 = key.replace(/(,[sd])(,[wh])?$/,'$1&l$2');
        if(modeData[k1]&&modeData[k2]){
            ids = [k1,k2];
        }else if(modeData[key]){
            ids = [key];
        }
        return filterId(ids).map(function(id){
            return modeData[id][0];
        });
    };
    // 对排序进行处理
    if(id.match(/&([\d]+)(,[hw])?$/)){
        let num = id.match(/&([\d]+)(,[hw])?$/)[1];
        let zh = number2zh(num);
        id = id.replace(/&\d+/g,'');
        if(modeData[id]){
            let item = '';
            let gen = getGenById(id);
            if(gen<3&&!id.match(/[hw],/)){
                modeData[id].forEach(function(name){
                    if(!item&&name.includes('几')){
                        item = name.replace('几',zh);
                    }
                });
                if(!item){
                    item = modeData[id][0].match(/^[大小]/)?modeData[id][0].replace(/^[大小]/,zh):zh+modeData[id][0];
                }
            }else{
                item = modeData[id][0]
            }
            items.push(item);
        }
    }else{
        id = id.replace(/&\d+/g,'');
    }
    // 直接匹配称呼
    if(!items.length){
        items = getData(id);
    }
    // 忽略年龄条件查找
    if(!items.length){
        id = id.replace(/&[ol]/g,'');
        items = getData(id);
    }
    // 忽略年龄条件查找
    if(!items.length){
        id = id.replace(/[ol](b|s)/g,'x$1');
        items = getData(id);
    }
    // 缩小访问查找
    if(!items.length){
        let l = id.replace(/x/g,'l');
        let o = id.replace(/x/g,'o');
        items = items.concat(getData(o),getData(l));
    }
    return items;
};

// 通过ID获取关系链
let data = Object.assign({},modeData,{
    'xb':['兄弟'],
    'xs':['姐妹']
});
export function getChainById(id,sex){
    let item = id.split(',').map(function(sign){
        let key = sign.replace(/&[ol\d]+/,'');
        return data[key][0];
    }).join('的');
    if(sex&&sex>-1&&data[sex+','+id]){
        if(sex==0){
            item = '(女性)'+item;
        }else if(sex==1){
            item = '(男性)'+item;
        }
    }
    return item
};

// 通过ID获取关系合称
export function getPairsById(id1,id2){
    let result = [];
    let result_x = [];
    let result_r = [];
    id1 = id1.replace(/&\d+/,'');
    id2 = id2.replace(/&\d+/,'');
    let id1_x = id1.replace(/([ol])([bs])/,'x$2');
    let id2_x = id2.replace(/([ol])([bs])/,'x$2');
    let id1_r = id1.replace(/&[ol]/,'');
    let id2_r = id2.replace(/&[ol]/,'');
    for(let key in _pair){
        let selectors = key.split('#');
        if(selectors.length>1){
            let list1 = selector2id(selectors[0]);
            let list2 = selector2id(selectors[1]);
            let list1_r = list1.map(function(selector){
                return selector.replace(/&[ol\d]+/,'').replace(/([ol])([bs])/,'x$2');
            });
            let list2_r = list2.map(function(selector){
                return selector.replace(/&[ol\d]+/,'').replace(/([ol])([bs])/,'x$2');
            });
            if(list1.includes(id1)&&list2.includes(id2)||list1.includes(id2)&&list2.includes(id1)){
                result.push(_pair[key][0]);
            }
            if(list1_r.includes(id1_x)&&list2_r.includes(id2_x)||list1_r.includes(id2_x)&&list2_r.includes(id1_x)){
                result_x.push(_pair[key][0]);
            }
            if(list1_r.includes(id1_r)&&list2_r.includes(id2_r)||list1_r.includes(id2_r)&&list2_r.includes(id1_r)){
                result_r.push(_pair[key][0]);
            }
        }
    }
    if(!result.length){
        result = result_x;
    }
    if(!result.length){
        result = result_r;
    }
    return result;
};
