<template>
  <div>
    <RegionSelect ref="regionSelect"></RegionSelect>
    <br>
    <!--<Button @click="handleSelectAll(true)">设置全选</Button>-->
    <!--<Button @click="handleSelectAll(false)">取消全选</Button>-->
    <Table border ref="selection" @on-selection-change="handleSelect" :columns="tableColumns" :data="tableRows"></Table>
    <!--<br>-->
    <!--<Button type="primary" @click="handleDelete">删除选择列表</Button>-->
  </div>
</template>
<script>
  import * as services from '@/services'
  import RegionSelect from '@/components/RegionSelect'

  export default {
    created() {
      this.search();
    },

    data() {
      return {
        tableColumns: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center'
          // },
          {
            title: 'Id',
            key: 'id',
            width: 60,
            align: 'center'
          },
          {
            title: '内容',
            key: 'content',
            align: 'center',
            render: (h, params) => {
              var texts = ''; //表格列显示文字
              if (params.row.content !== null) {
                if (params.row.content.length > 15) {
                  texts = params.row.content.substring(0, 15) + "...";
                } else {
                  texts = params.row.content;
                }
              }

              return h('Tooltip', {
                props: {
                  placement: 'bottom'
                },
                style: {
                  cursor: 'pointer',
                }
              }, [
                texts,
                h('span', {slot: 'content', style: {whiteSpace: 'normal', wordBreak: 'break-all'}}, params.row.content)
              ])
            }
          },
          {
            title: '发送区服',
            key: 'zones',
            align: 'center',
            render: (h, params) => {
              var texts = ''; //表格列显示文字
              if (params.row.zones !== null) {
                if (params.row.zones.length > 9) {
                  texts = params.row.zones.substring(0, 9) + "...";
                } else {
                  texts = params.row.zones;
                }
              }

              return h('Tooltip', {
                props: {
                  placement: 'bottom'
                },
                style: {
                  cursor: 'pointer',
                }
              }, [
                texts,
                h('span', {slot: 'content', style: {whiteSpace: 'normal', wordBreak: 'break-all'}}, params.row.zones)
              ])
            }
          },
          {
            title: '间隔时长',
            key: 'interval',
            align: 'center',
          },
          {
            title: '详情',
            key: 'information',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showInfo(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        tableRows: [],
        selectRows: []
      }
    },

    methods: {
      search() {
        if (!services.checkGmtAuthor(2)) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        this.tableRows = [];
        services.getHttpClient().post({
          url: '/xy/gmt/query_marquee'
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code !== 0) {
            this.$Message.error(body.msg);
            return;
          }

          if (!body.data || body.data.length === 0) {
            return
          }

          var rows = body.data
          rows.forEach((row) => {
            var tableRow = {};
            tableRow["id"] = row.id;
            tableRow["content"] = row.content;
            tableRow["interval"] = row.interval + "分钟";

            if (row.server_id === '') {
              tableRow["zones"] = '全部区服(包括未来开的新服)'
            } else {
              var zones = row.server_id.split(",");
              var zoneNames = [];
              zones.forEach((zone) => {
                zoneNames.push(services.getZoneNameByZoneId(zone));
              });
              tableRow["zones"] = zoneNames.join(",");
            }

            var state = row.state;
            var stateName = '';
            if (state === 1) {
              stateName = '系统消息'
            } else if (state === 2) {
              stateName = '跑马灯'
            } else if (state === 3) {
              stateName = '跑马灯和系统消息'
            } else {
              stateName = '未知类型[' + state + ']'
            }
            tableRow["state"] = stateName;

            var sortId = row.sort_id;
            var sortName = '';
            if (sortId === 10) {
              sortName = '高'
            } else if (sortId === 20) {
              sortName = '中'
            } else if (sortId === 30) {
              sortName = '低'
            } else {
              sortName = '未知优先级[' + sortId + ']'
            }
            tableRow["sortId"] = sortName;

            this.tableRows.push(tableRow);
          });
        });
      },

      handleSelect(selection) {
        this.selectRows = [];
        selection.forEach((data) => {
          this.selectRows.push(data.id)
        });
      },

      handleSelectAll(status) {
        this.$refs.selection.selectAll(status);
      },

      showInfo(index) {
        this.$Modal.info({
          title: '跑马灯详情',
          scrollable: true,
          content: `发送内容：${this.tableRows[index].content}<br>发送区服：${this.tableRows[index].zones}<br>发送类型：${this.tableRows[index].state}<br>间隔时长：${this.tableRows[index].interval}<br>消息级别：${this.tableRows[index].sortId}`
        })
      },

      remove(index) {
        if (!services.checkGmtAuthor(1)) {
          this.$Message.error("权限不足,请联系管理员!");
          return
        }

        services.getHttpClient().post({
          url: '/xy/gmt/delete_marquee',
          body: {
            id: this.tableRows[index].id
          }
        }, (error, response, body) => {
          if (error) {
            this.$Message.error(error.toString());
            return;
          }

          if (body.code !== 0) {
            this.$Message.error(body.msg);
            return;
          }

          this.$Message.success('删除成功');
          this.tableRows.splice(index, 1);
          //this.$refs.selection.selectAll(false);
        });
      }
    },

    components: {
      RegionSelect
    }
  }
</script>
