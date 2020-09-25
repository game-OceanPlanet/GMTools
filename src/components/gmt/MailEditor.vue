<template>
  <div>
    <Form ref="form" :model="formModel" :label-width="80">
      <FormItem label="标题">
        <Input v-model="formModel.mailTitle" placeholder="输入邮件标题..."></Input>
      </FormItem>
      <FormItem label="正文">
        <Input v-model="formModel.mailContent" type="textarea" :autosize="{minRows: 6, maxRows: 8}"
               placeholder="输入邮件正文..."></Input>
      </FormItem>
      <FormItem label="附件列表">
        <FormItem
          v-for="(item, index) in formModel.mailItemListOfCascaderFormat" :key="index">
          <div style="margin-bottom: 5px;">
            <Cascader v-model="formModel.mailItemListOfCascaderFormat[index].cascaderValue" :data="itemCfgCascaderData"
                      placeholder="请选择或搜索" trigger="hover" style="display: inline-block" filterable></Cascader>
            <span style="margin-left: 5px">x</span>
            <Input v-model="formModel.mailItemListOfCascaderFormat[index].itemNum" placeholder="数目"
                   style="width: 80px; margin-left: 5px;"></Input>
            <Button @click="handleRemoveMailItem(index)">删除</Button>
          </div>
        </FormItem>
        <Button type="dashed" icon="plus-round" long @click="handleAddMailItem" style="width: 200px">{{
          formModel.mailItemListOfCascaderFormat.length === 0 ? '开始添加附件' : '继续添加附件'}}
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import * as services from '@/services'

  export default {
    props: {
      // 初始值，标题
      title: {
        type: String,
        default: ''
      },

      // 初始值，正文
      content: {
        type: String,
        default: ''
      },
    },

    data() {
      return {
        formModel: {
          mailTitle: '',
          mailContent: '',
          mailItemListOfCascaderFormat: [],
        },
        itemCfgCascaderData: [] // 所有物品的配置
      };
    },

    created() {
      // 根据当前组件的使用者传入的值，初始化子组件的初始值
      this.formModel.mailTitle = this.title;
      this.formModel.mailContent = this.content;

      // 获取所有物品的配置
      this.fetchItemCfgList();
    },

    methods: {
      // 供当前组件的使用者调用，用来获取当前组件的数据
      getData() {
        // 邮件标题
        var title = this.formModel.mailTitle.trim();
        if (title.length === 0) {
          this.$Message.error('邮件标题不能为空');
          return null;
        }

        // 邮件正文
        var content = this.formModel.mailContent.trim();
        if (content.length === 0) {
          this.$Message.error('邮件正文不能为空');
          return null;
        }

        // 解析附件列表
        var itemList = [];
        for (var i = 0; i < this.formModel.mailItemListOfCascaderFormat.length; i++) {
          var formMailItem = this.formModel.mailItemListOfCascaderFormat[i];

          // cascaderValue数组中最后一个元素，就是物品的id
          if (formMailItem.cascaderValue.length === 0) {
            this.$Message.error('请正确选择附件');
            return;
          }

          // 物品id
          var itemId = parseInt(
            formMailItem.cascaderValue[
            formMailItem.cascaderValue.length - 1
              ].trim()
          );
          if (isNaN(itemId) || itemId <= 0) {
            this.$Message.error('无法识别附件id');
            return;
          }

          // 物品数目
          var itemNum = parseInt(formMailItem.itemNum);
          if (isNaN(itemNum) || itemNum <= 0) {
            this.$Message.error('请正确输入附件数目');
            return;
          }

          // 保存
          itemList.push({id: itemId, num: itemNum});
        }

        return {
          title: title,
          content: content,
          itemList: itemList
        };
      },

      // 获取所有物品的配置
      fetchItemCfgList() {
        services.getHttpClient().post({
          url: '/xy/gmt/query_item_list'
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code != 0) {
            this.$Message.error(body.msg);
            return;
          }

          if (!body.data) {
            return
          }

          // 下面将获取的数据转换为Cascader组件能够识别的格式
          // 货币
          this.itemCfgCascaderData.push({
            value: 'currency',
            label: '货币',
            children: (() => {
              var result = [];
              body.data.amount_list.forEach(element => {
                result.push({
                  value: element.id.toString(),
                  label: element.name
                });
              });

              return result;
            })()
          });

          // 非货币类道具
          this.itemCfgCascaderData.push({
            value: 'prop',
            label: '道具',
            children: (() => {
              var result = [];
              body.data.item_list.forEach(element => {
                result.push({
                  value: element.id.toString(),
                  label: element.name
                });
              });

              return result;
            })()
          });

          // 虎符
          this.itemCfgCascaderData.push({
            value: 'hufu',
            label: '虎符',
            children: (() => {
              var result = [];
              body.data.hufu_list.forEach(element => {
                result.push({
                  value: element.id.toString(),
                  label: element.name
                });
              });

              return result;
            })()
          });

          // 装备
          this.itemCfgCascaderData.push({
            value: 'equip',
            label: '装备',
            children: (() => {
              var result = [];
              body.data.equip_list.forEach(element => {
                result.push({
                  value: element.id.toString(),
                  label: element.name
                });
              });

              return result;
            })()
          });
        });
      },

      // 新增一个附件
      handleAddMailItem() {
        this.formModel.mailItemListOfCascaderFormat.push({
          cascaderValue: [], // Cascader组件的value是一个数组，我们在最终获取选择的物品的id时，需要对该数组进行解析
          itemNum: 1
        });
      },

      // 删除一个附件
      handleRemoveMailItem(itemIndex) {
        this.formModel.mailItemListOfCascaderFormat.splice(itemIndex, 1);
      },

      handleReset() {
        this.$refs['form'].resetFields();
      },

      /**
       * 发送邮件
       * @param zoneIdListStr 服务器id列表，id之间以逗号隔开，比如，'1,2,3'
       * @param type 1: 全体 2: 个人
       * @param roleId 收件人id。若type为1，则roleId会被忽略
       * @param title 邮件标题
       * @param content 邮件正文
       * @param itemList 附件列表
       */
      sendMail(zoneIdListStr, type, roleId, title, content, itemList) {
        services.getHttpClient().post({
          url: '/xy/gmt/send_mail',
          body: {
            type: type,
            role_id: type === 1 ? 0 : roleId,
            server_id: zoneIdListStr,
            title: title,
            content: content,
            mail_item: itemList
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            this.$emit('on-change');
            return;
          }

          if (body.code != 0) {
            this.$Message.error(body.msg);
            this.$emit('on-change');
            return;
          }

          this.$Message.success('邮件发送成功');
          this.$emit('on-change');
        });
      }
    }
  };
</script>
