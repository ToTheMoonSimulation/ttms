<template>
  <v-container fluid>
    <v-data-table
      :headers="userHeaders"
      :items="userItems"
      sort-by="benefitRatio"
      class="elevation-1"
      :loading="isLoading"
      loading-text="Loading... Please wait"
      :sort-desc="true"
      @click:row="onClickRow"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>회원 리스트</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog v-model="dialogUserInfo">
            <v-card>
              <v-card-title>
                <span class="text-h5">회원 정보</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <!--회원 데이터 TABLE 위치 -->
                      <v-data-table
                        :headers="userDetailHeaders"
                        :items="selectedUserDetail"
                        sort-by="benefitRatio"
                        :sort-desc="true"
                      >
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => {
    return {
      userHeaders: [
        {
          text: "아이디",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "최고 수익률", value: "benefitRatio" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      userItems: [],
      userDetailHeaders: [
        {
          text: "계좌 이름",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "시작 금액", value: "initBalance" },
        { text: "현재 금액", value: "currentBalance" },
        { text: "수익률", value: "benefitRatio" },
      ],
      userDetails: [],
      selectedUserDetail: [],
      isLoading: true,
      dialogUserInfo: false,
      dialogDelete: false,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  mounted() {
    // 1. 전체 회원 리스트 가져오기
    this.isLoading = true;
    axios.get("/api/admin").then((e) => {
      if (e.data.success) {
        e.data.userDocs.some((user) => {
          this.userItems.push({
            name: user.id,
            benefitRatio: -99999,
          });
        });
        this.userItems.some((user) => {
          e.data.docs.some((data) => {
            if (user.name == data.id) {
              //계좌 개설하지 않은 회원들은 수익률 -9999999로 표시
              var bestBenefitRatio = -9999999;
              data.scenarios.some((scenario) => {
                bestBenefitRatio = Math.max(
                  scenario.benefitRatio,
                  bestBenefitRatio
                );
                this.userDetails.push({
                  userId: data.id,
                  name: scenario.scenarioName,
                  initBalance: scenario.initBalance,
                  currentBalance: scenario.currentBalance,
                  benefitRatio: scenario.benefitRatio,
                });
                user.benefitRatio = bestBenefitRatio;
              });
            }
          });
        });
      }
    });
    this.isLoading = false;
  },
  unmounted() {},
  methods: {
    onClickRow(e) {
      if (this.dialogDelete) return;
      this.selectedUserDetail = [];
      this.userDetails.some((item) => {
        if (item.userId == e.name) {
          this.selectedUserDetail.push(item);
        }
      });
      this.dialogUserInfo = true;
    },
    deleteItem(e) {
      this.dialogDelete = true;
      this.selectedUserDetail = [];
      this.userDetails.some((item) => {
        if (item.userId == e.name) {
          this.selectedUserDetail.push(item);
          return true;
        }
      });
      if (this.selectedUserDetail.length == 0) {
        this.selectedUserDetail.push({
          userId: e.name,
        });
      }
    },

    deleteItemConfirm() {
      axios
        .delete("/api/admin", {
          data: {
            userId: this.selectedUserDetail[0].userId,
          },
        })
        .then((e) => {
          if (e.data.success) {
            var idx = 0;
            this.userItems.some((item) => {
              if (item.name == this.selectedUserDetail[0].userId) {
                return true;
              }
              idx++;
            });

            this.userItems.splice(idx, 1);
          }
        });
      this.closeDelete();
    },

    close() {
      this.dialogUserInfo = false;
    },

    closeDelete() {
      this.dialogDelete = false;
    },
  },
};
</script>

<style></style>
