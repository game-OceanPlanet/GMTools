export const operateMap = {
  1:'系统',
  2:'GM操作',
  3:'充值',
  10:'使用物品'
};

export const getOperateName = function (id) {
  let name = operateMap[id];
  if (name) {
    return name;
  } else {
    return `未知[${id}]`;
  }
};
