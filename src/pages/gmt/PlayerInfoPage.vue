<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <Form :model="formModel" :label-width="80">
      <FormItem label="服务器">
        <ZoneSelect v-model="formModel.selectedZoneId"></ZoneSelect>
      </FormItem>
      <FormItem label="玩家名称">
        <Input v-model="formModel.roleName" placeholder="输入玩家名称..."></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="ios-search" @click="handleSubmit">查询</Button>
      </FormItem>
    </Form>
    <Tabs value="baseInfo">
      <TabPane label="基础信息" name="baseInfo">
        <Table border :columns="baseInfoColumns" :data="baseInfoRows" :show-header="false"
               :row-class-name="rowClassName" width="600"></Table>
      </TabPane>
      <TabPane label="背包" name="bag">
        <Table border :columns="propColumns" :data="propRows" :row-class-name="rowClassName" width="330"></Table>
      </TabPane>
      <TabPane label="资源" name="foster">
        <Table border :columns="fosterColumns" :data="fosterRows" :row-class-name="rowClassName" width="752"></Table>
      </TabPane>
      <TabPane label="武将" name="pet">
        <Table border :columns="petColumns" :data="petRows" :row-class-name="rowClassName" width="702"></Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import * as services from '@/services'
  import ZoneSelect from '@/components/ZoneSelect'
  import RegionSelect from '@/components/RegionSelect'
  import moment from "moment";

  export default {
    data() {
      return {
        formModel: {
          selectedZoneId: "",
          roleName: ""
        },

        baseInfoColumns: [
          {
            title: "属性",
            key: "fieldName",
            width: 180,
            align: "left"
          },
          {
            title: "值",
            key: "fieldValue",
            align: "left"
          }
        ],
        baseInfoRows: [],

        propColumns: [
          {
            title: "名称",
            key: "name",
            width: 150,
            align: "center"
          },
          {
            title: "品质",
            key: "quality",
            width: 90,
            align: "center"
          },
          {
            title: "数目",
            key: "num",
            align: "center"
          }
        ],
        propRows: [],

        fosterColumns: [
          {
            title: "名称",
            key: "name",
            width: 100,
            align: "center"
          },
          {
            title: "进阶等级",
            key: "advanceLv",
            width: 100,
            align: "center"
          },
          {
            title: "觉醒等级",
            key: "awakeLv",
            width: 100,
            align: "center"
          },
          {
            title: "使用属性丹",
            key: "attrItem",
            width: 100,
            align: "center"
          },
          {
            title: "技能列表",
            key: "skills",
            width: 350,
            align: "center"
          }
        ],
        fosterRows: [],

        petColumns: [
          {
            title: "名称",
            key: "name",
            width: 100,
            align: "center"
          },
          {
            title: "品质",
            key: "quality",
            width: 100,
            align: "center"
          },
          {
            title: "等级",
            key: "level",
            width: 100,
            align: "center"
          },
          {
            title: "进阶次数",
            key: "advanceNum",
            width: 100,
            align: "center"
          },
          {
            title: "飞升等级",
            key: "flyLevel",
            width: 100,
            align: "center"
          },
          {
            title: "洗练值",
            key: "washValue",
            width: 100,
            align: "center"
          },
          {
            title: "出战位",
            key: "battleSlot",
            width: 100,
            align: "center"
          }
        ],
        petRows: [],

        gotSuccessResult: false
      };
    },

    methods: {
      handleSubmit() {
        // 服务器id
        var zoneId = this.formModel.selectedZoneId;
        if (typeof zoneId === 'string') {
          this.$Message.error("请先选择服务器");
          return
        }

        // 玩家名称
        var roleName = this.formModel.roleName.trim();
        if (roleName.length === 0) {
          this.$Message.error("请正确填入玩家名称");
          return;
        }

        // 先将所有旧数据清空
        this.baseInfoRows = [];
        this.propRows = [];
        this.fosterRows = [];
        this.petRows = [];

        services.getHttpClient().post({
          url: '/xy/gmt/query_role',
          body: {
            server_id: zoneId,
            type: 0,  // 按角色名查询
            role_name: roleName
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error(body.msg);
            return;
          }

          this.showBaseInfo(body.data.base_msg);
          this.showBagItemList(body.data.bag_item_msg);
          this.showFosterList(body.data.foster_msg);
          this.showPetList(body.data.pet_msg);
        });
      },

      showBaseInfo(baseInfo) {
        this.baseInfoRows = [];
        if (!baseInfo) {
          return
        }

        this.baseInfoRows.push({"fieldName": "id", "fieldValue": baseInfo.id});
        this.baseInfoRows.push({"fieldName": "名称", "fieldValue": baseInfo.name});
        this.baseInfoRows.push({"fieldName": "渠道id", "fieldValue": baseInfo.channel_id});
        this.baseInfoRows.push({"fieldName": "游戏渠道id", "fieldValue": baseInfo.game_channel_id});
        this.baseInfoRows.push({"fieldName": "平台唯一id", "fieldValue": baseInfo.open_id});

        this.baseInfoRows.push({
          "fieldName": "何时创角",
          "fieldValue": moment.unix(baseInfo.create_time).format("YYYY-MM-DD HH:mm:ss")
        });

        this.baseInfoRows.push({"fieldName": "在线状态", "fieldValue": baseInfo.is_online ? "在线" : "离线"});
        this.baseInfoRows.push({
          "fieldName": "最近登录",
          "fieldValue": moment.unix(baseInfo.last_login_time).format("YYYY-MM-DD HH:mm:ss")
        });
        if (!baseInfo.is_online) {
          this.baseInfoRows.push({
            "fieldName": "最近离线",
            "fieldValue": moment.unix(baseInfo.last_logout_time).format("YYYY-MM-DD HH:mm:ss")
          });
        }

        var totalOnlineDurationDesc = "";
        var day = Math.floor(baseInfo.total_online_seconds / (60 * 60 * 24));
        var hour = Math.floor(baseInfo.total_online_seconds % (60 * 60 * 24) / (60 * 60));
        var minute = Math.floor(baseInfo.total_online_seconds % (60 * 60) / 60);
        var second = baseInfo.total_online_seconds % 60;
        if (day > 0) {
          totalOnlineDurationDesc = `${day}天${hour}时${minute}分${second}秒`;
        } else if (hour > 0) {
          totalOnlineDurationDesc = `${hour}时${minute}分${second}秒`;
        } else if (minute > 0) {
          totalOnlineDurationDesc = `${minute}分${second}秒`;
        } else if (second > 0) {
          totalOnlineDurationDesc = `${baseInfo.total_online_seconds}秒`;
        }
        this.baseInfoRows.push({"fieldName": "历史累计在线时长", "fieldValue": totalOnlineDurationDesc});

        this.baseInfoRows.push({"fieldName": "转生等级", "fieldValue": baseInfo.rebirth_level});
        this.baseInfoRows.push({"fieldName": "等级", "fieldValue": baseInfo.level});
        this.baseInfoRows.push({"fieldName": "经验", "fieldValue": baseInfo.exp});
        this.baseInfoRows.push({"fieldName": "战力", "fieldValue": baseInfo.power});
        this.baseInfoRows.push({"fieldName": "vip等级", "fieldValue": baseInfo.vip});
        this.baseInfoRows.push({"fieldName": "vip经验", "fieldValue": baseInfo.vip_exp});

        this.baseInfoRows.push({"fieldName": "累计充值金额(元)", "fieldValue": baseInfo.total_recharge_money});
        this.baseInfoRows.push({"fieldName": "累计充值次数", "fieldValue": baseInfo.total_recharge_times});

        this.baseInfoRows.push({"fieldName": "元宝", "fieldValue": baseInfo.gold});
        this.baseInfoRows.push({"fieldName": "绑元", "fieldValue": baseInfo.bind_gold});
        this.baseInfoRows.push({
          "fieldName": "银币",
          "fieldValue": baseInfo.silver >= 100000 ? `${(baseInfo.silver / 10000)}万` : baseInfo.silver
        });

        this.baseInfoRows.push({
          "fieldName": "何时解除禁言",
          "fieldValue": baseInfo.chat_ban_end_time === 0 ? "<未被禁言>" : moment.unix(baseInfo.chat_ban_end_time).format("YYYY-MM-DD HH:mm:ss")
        });
        this.baseInfoRows.push({
          "fieldName": "何时解除封号",
          "fieldValue": baseInfo.login_ban_end_time === 0 ? "<未被封号>" : moment.unix(baseInfo.login_ban_end_time).format("YYYY-MM-DD HH:mm:ss")
        });

        this.baseInfoRows.push({
          "fieldName": "帮会",
          "fieldValue": baseInfo.guild_name.length === 0 ? "<未加入帮会>" : `${baseInfo.guild_name}（Lv.${baseInfo.guild_level}）`
        });
      },

      showBagItemList(bagItemList) {
        this.propRows = [];
        this.equipRows = [];
        if (bagItemList == null) {
          return;
        }

        for (var i = 0; i < bagItemList.length; i++) {
          var bagItem = bagItemList[i];

          var quality = ["白", "绿", "蓝", "紫", "橙", "红", "炫彩"][bagItem.quality];
          this.propRows.push({"name": bagItem.name, "num": bagItem.num, "quality": quality});
        }
      },

      showFosterList(fosterList) {
        this.fosterRows = [];
        if (fosterList == null) {
          return;
        }

        for (var i = 0; i < fosterList.length; i++) {
          var foster = fosterList[i];
          var skills = "";
          if (foster.skills) {
            skills = foster.skills.join(',')
          }

          this.fosterRows.push({
            "name": foster.name,
            "advanceLv": foster.advance_lv,
            "awakeLv": foster.awake_lv,
            "skills": skills,
            "attrItem": foster.attr_item
          });
        }
      },

      showPetList(petList) {
        this.petRows = [];
        if (petList == null) {
          return;
        }

        for (var i = 0; i < petList.length; i++) {
          var pet = petList[i];
          var quality = ["白", "绿", "蓝", "紫", "橙", "红", "炫彩"][pet.quality];
          this.petRows.push({
            "name": pet.name,
            "quality": quality,
            "level": pet.level,
            "advanceNum": pet.advance_num,
            "flyLevel": pet.fly_level,
            "washValue": pet.wash_value,
            "battleSlot": pet.battle_slot === 0 ? "未出战" : pet.battle_slot,
          });
        }
      },

      rowClassName(row, index) {
        return 'table-row';
      }
    },

    components: {
      ZoneSelect,
      RegionSelect
    }
  };
</script>

<style>
  .table-row td {
    height: 50px;
  }
</style>
