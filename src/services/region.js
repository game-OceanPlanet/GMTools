import {getUserPlatform} from "./session";

let selectedRegion = '';

let regionGmtAddr = {
  //"jh-wb": 'http://192.168.0.108:3903/',
  "jh-wb": 'http://jh-wb.tstd.black8.com.cn/',
  "jh-9130": 'http://jh-9130.tstd.black8.com.cn/',
  "xd-wx": 'http://xd-wx.tstd.black8.com.cn/',
  "jh-hf": 'http://jh-hf.tstd.black8.com.cn/',
  "jh-fk": 'http://jh-fk.tstd.black8.com.cn/',
};

// 平台id(游戏服的定义)
let platforms = {
  3: "jh-wb",   // 君海玩吧
  4: "xd-wx",   // 炫动微信
  5: "jh-9130", // 君海9130
  6: "jh-fk",   // 君海疯狂
  7: "jh-hf",   // 君海混服
};

// 用户默认大区
export const initRegion = function () {
  let pfId = getUserPlatform();
  let platform = platforms[pfId];
  if (!platform) {
    selectedRegion = "jh-wb";
  } else {
    selectedRegion = platform;
  }
};

// 刷新页面尝试初始化大区
export const tryRefreshRegion = function () {
  if (selectedRegion !== '') {
    return
  }

  let pfId = getUserPlatform();
  let platform = platforms[pfId];
  if (!platform) {
    selectedRegion = "jh-wb";
  } else {
    selectedRegion = platform;
  }
};

// 获取大区gmt地址
export const getGmtAddr = function () {
  let addr = regionGmtAddr[selectedRegion];
  if (!addr) {
    console.error(`Unrecognized region '${selectedRegion}'`);
    return '';
  }
  return addr
};

export const saveSelectedRegion = function (region) {
  selectedRegion = region;
};

export const getSelectedRegion = function () {
  return selectedRegion;
};

export const getSelectedPfId = function () {
  if (selectedRegion === "jh-wb") {
    return 3;
  } else if (selectedRegion === "xd-wx") {
    return 4;
  } else if (selectedRegion === "jh-9130") {
    return 5;
  } else if (selectedRegion === "jh-fk") {
    return 6;
  } else if (selectedRegion === "jh-hf") {
    return 7;
  }

  return 1;
};

let totalZoneMap = {};
export const saveZoneList = function (zones) {
  let zoneMap = {};
  zones.forEach((zone) => {
    zoneMap[zone.id] = zone
  });
  totalZoneMap[selectedRegion] = zoneMap;
};

export const getZoneNameByZoneId = function (zoneId) {
  let zoneMap = totalZoneMap[selectedRegion];
  if (!zoneMap) {
    return `${zoneId}服`;
  }

  let zone = zoneMap[zoneId];
  if (zone) {
    return zone.name
  }
  return `${zoneId}服`;
};

/**
 * 判断指定渠道是否是未知渠道
 * 所谓未知渠道，仅仅只是我们不知道其名称而已
 */
export const isChannelUnknown = function (channelId) {
  let channelIdStr = channelId.toString();
  if (selectedRegion === "xd-wx") {
    let xdName = xdChannels[channelIdStr];
    return !xdName;
  } else {
    let jhName = jhChannels[channelIdStr];
    return !jhName;
  }
};

/**
 * 根据渠道id获取对应的渠道名称
 * @param {number} channelId
 */
export const getChannelNameByChannelId = function (channelId) {
  let channelIdStr = channelId.toString();
  if (selectedRegion === "xd-wx") {
    let xdName = xdChannels[channelIdStr];
    if (xdName) {
      return xdName
    }
  } else {
    let jhName = jhChannels[channelIdStr];
    if (jhName) {
      return jhName
    }
  }
  return `未知(id-${channelId})`;
};

let jhChannels = {
  "1": "测试",
  "108199": "玩吧",
  "108962": "9130",
  "109103": "TT游戏",
  "109105": "熊猫",
  "109106": "17玩",
  "109107": "群黑(109107)",
  "109132": "百家互娱",
  "109144": "4399",
  "109064": "华为快游戏",
  "109224": "8090",
  "109237": "一牛",
  "109170": "橙子",
  "109404": "小米",
  "109390": "云游",
  "109281": "7723",
  "109283": "顺网",
  "109286": "天宇游",
  "109287": "1758",
  "109359": "8U",
  "109360": "360",
  "109378": "搜游记",
  "109379": "易乐玩",
  "109420": "疯狂游乐场",
  "109424": "乐趣",
  "109463": "爱奇艺",
  "109468": "x游网",
  "109492": "萝卜玩",
  "109493": "2217",
  "109505": "群黑(109505)",
  "109514": "飞火",
};

let xdChannels = {
  "1": "测试",
  "2": "黑八",
  "2063": "微信小游戏",
};
