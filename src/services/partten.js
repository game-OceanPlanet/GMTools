/** 领取鱼日产金币*/
export const MONEY_REWARD = 1;
/** 金币买鱼*/
export const MONEY_BUY_FISH = 2;
/** OTC-卖给Ta，消耗金币*/
export const OCT_SELL_MONEY = 3;
/** OTC-有玩家卖金币给我了，得金币*/
export const OCT_SOMEONE_SELL_ME = 4;
/** KAD-用金币兑换KAD，消耗金币*/
export const MONEY_EXCHANGE_KAD = 5;
/** 直推成员领取金币，得到金币*/
export const DIRECT_MONEY_REWARD = 6;
/** 非直推成员领取金币，得到金币*/
export const TEAM_MONEY_REWARD = 7;

/** U买鱼*/
export const DIAMOND_BUY_FISH = 101;
/** OTC-买入金币（挂单），消耗u*/
export const OCT_BUY_MONEY_COST_U = 102;
/** OTC-卖给Ta，获得U*/
export const OCT_SELL_MONEY_GOT_U = 103;
/** OTC-撤单，获得U*/
export const OCT_CANCEL_GOT_U = 104;
/** KAD-注入每日分红，获得U*/
export const KAD_BONUS_GOT_U = 105;
/** 玩家充值，获得U*/
export const RECHARGE_GOT_U = 106;
/** 海豚卖出，获得U*/
export const DOLPHIN_SELL_OUT_GOT_U = 107;
/** 购买海豚，消耗U*/
export const DOLPHIN_BUY_COST_U = 108;
/** 孵化海豚，消耗U*/
export const DOLPHIN_HATCH_COST_U = 109;

/** KAD-用金币兑换KAD，得到KAD*/
export const EXCHANGE_GOT_KAD = 201;
/** KAD-注入，消耗KAD*/
export const INJECT_COST_KAD = 202;
/** KAD-注入到期，返还KAD*/
export const INJECT_EXPIRE_GOT_KAD = 203;


/** 激活秘钥-自己使用*/
export const USE_KEY = 301;
/** 激活秘钥-赠送给他人*/
export const KEY_GIVE = 302;
/** 激活秘钥-被赠送*/
export const KEY_BE_GIVE = 303;


/** 实名验证系统赠送， 获得领养名额*/
export const DOLPHIN_BUY_COUNT_BE_GIVE = 401;
/** 购买海豚，消耗领养名额*/
export const DOLPHIN_BUY_COST_BUY_COUNT = 402;
/** 用海豚金币兑换， 获得领养名额*/
export const DOLPHIN_EXCHANGE_GOT_COUNT = 403;

/** 用海豚金币兑换领养名额, 消耗海豚金币*/
export const DOLPHIN_EXCHANGE_COST_MONEY = 501;
/** 受孕海豚, 消耗海豚金币*/
export const DOLPHIN_FERTILIZE_COST_MONEY = 502;
/** 签到, 获得海豚金币*/
export const DOLPHIN_SIGN_IN_GOT_MONEY = 503;

/** 加速海豚状态, 消耗加速积分*/
export const DOLPHIN_SPEED_COST_SPEED_COUNT = 601;