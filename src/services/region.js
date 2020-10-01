import {getUserPlatform} from "./session";

let selectedRegion = '';

// 平台id(游戏服的定义)
let platforms = {
  3: "jh-wb",   // 君海玩吧
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

export const saveSelectedRegion = function (region) {
  selectedRegion = region;
};

export const getSelectedRegion = function () {
  return selectedRegion;
};

export const getSelectedPfId = function () {
  if (selectedRegion === "jh-wb") {
    return 3;
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
  "108199": "玩吧"
};

let xdChannels = {
  "1": "测试",
  "2": "黑八",
  "2063": "微信小游戏",
};
