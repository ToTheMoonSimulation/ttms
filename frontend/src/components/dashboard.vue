<template>
  <v-data-table
    :headers="headers"
    :items="scenarios"
    sort-by="initBalance"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>계좌 리스트</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              계좌 생성
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="계좌 이름"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.initBalance"
                      label="시작 금액"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Save
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
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template> -->
  </v-data-table>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "계좌 이름",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "시작 금액", value: "initBalance" },
      { text: "현재 금액", value: "currentBalance" },
      { text: "수익률", value: "benefitRatio" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    scenarios: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      initBalance: 10000,
      currentBalance: 0,
      benefitRatio: 0,
    },
    defaultItem: {
      name: "",
      initBalance: 10000,
      currentBalance: 0,
      benefitRatio: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "계좌 생성" : "계좌 수정";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    axios.get("/api/dashboard").then((e) => {
      console.log("세션 유지중");
      e.data.docs[0].scenarios.some((item) => {
        this.scenarios.push({
          name: item.scenarioName,
          initBalance: item.initBalance,
          currentBalance: item.currentBalance,
          benefitRatio: item.benefitRatio,
        });
      });
    });
  },
  methods: {
    editItem(item) {
      console.log(this.scenarios.indexOf(item));
      console.log(Object.assign({}, item));
      this.editedIndex = this.scenarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.scenarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      var idx = this.editedIndex;
      axios.delete("/api/dashboard", { idx }).then((e) => {
        if (e.data.success) {
          this.scenarios.splice(idx, 1);
        }
      });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        var idx = this.editedIndex;
        var editedObj = this.editedItem;
        axios
          .put("/api/dashboard", {
            idx: this.editedIndex,
            name: this.editedItem.name,
            initBalance: this.editedItem.initBalance,
            currentBalance: this.editedItem.initBalance,
            benefitRatio: 0,
          })
          .then((e) => {
            if (e.data.success) {
              Object.assign(this.scenarios[idx], editedObj);
            }
          });
      } else {
        var obj = {
          name: this.editedItem.name,
          initBalance: this.editedItem.initBalance,
          currentBalance: this.editedItem.initBalance,
          benefitRatio: 0,
        };

        axios.post("/api/dashboard", obj).then((e) => {
          console.log(e);
          if (e.data.success) {
            this.scenarios.push(obj);
          }
        });
      }
      this.close();
    },
  },
};
</script>

<style scoped></style>
