<template>
  <div id="playCanvas" ref="playCanvas"></div>
  <el-form v-if="formShow" ref="form" :model="formVar" :rules="rules">
    <el-form-item required style="width: 400px" prop="musicType">
      <el-radio-group v-model="formVar.musicType">
        <el-radio-button label="drum">드럼</el-radio-button>
        <el-radio-button label="melody" style="margin-top: 50px"
          >멜로디</el-radio-button
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item style="flex: 1; margin-right: 100px; padding-top: 20px">
      <span style="font-size: 2em">음악 생성 개수</span>
      <el-slider
        v-model="formVar.createCount"
        :min="createCount_min"
        :max="createCount_max"
        show-stops
      >
      </el-slider
      ><span style="font-size: 2em">음악 템포</span>
      <el-slider
        v-model="formVar.tempo"
        :step="10"
        :min="tempo_min"
        :max="tempo_max"
        show-stops
      >
      </el-slider>
    </el-form-item>
    <!--LINE BREAK -->
    <div style="width: 100%"></div>
    <el-form-item
      style="margin-top: 0px; margin-left: auto; margin-right: 100px"
    >
      <el-button class="submitBtn" type="primary" @click="onSubmit">시작</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { onMounted, ref } from "vue";
import createP5 from "@/libraries/sketch_play.js";

export default {
  name: "play",
  setup() {
    const p5State = ref({
      p5: {},
    });
    const playCanvas = ref(null);
    const backgroundColor = "black";
    const form = ref(null);

    onMounted(() => {
      const width = playCanvas.value.parentNode.clientWidth;
      const height = playCanvas.value.parentNode.clientHeight;

      p5State.value.p5 = createP5("playCanvas", width, height, backgroundColor);

      window.addEventListener("resize", () => {
        p5State.value.p5.resizeCanvas(
          playCanvas.value.parentNode.clientWidth,
          playCanvas.value.parentNode.clientHeight
        );
      });
    });

    return {
      playCanvas,
      p5State,
      form
    };
  },
  data() {
    return {
      formVar: {
        musicType: "",
        createCount: 4,
        tempo: 80,
      },
      createCount_min: 1,
      createCount_max: 4,
      tempo_max: 120,
      tempo_min: 60,
      formShow:true,
      rules: {
        musicType: [{ required: true, message: "음악 종류 선택", trigger: "blur" }],
      },
    };
  },
  watch: {
    "formVar.musicType": function (val) {
      console.log(val);
    },
    "formVar.createCount": function (val) {
      console.log(val);
    },
    "formVar.tempo": function (val) {
      console.log(val);
    },
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid)=>{
        if(valid){
          this.formShow=false;
        }else{
          this.formShow=true;
          return false;
        }
      });
    },
  },
};
</script>
<style >
.el-form {
  position: absolute;
  background-color: white;
  border-radius: 4px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 80%;
  height: 50%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.submitBtn {
  display: block;
  width: 150px;
  height: 60px;
  font-size: 2em;
}
.el-form-item {
  margin-top: 80px;
  margin-left: 100px;
}
.el-radio-group {
  width: 100%;
}
.el-radio-button {
  display: block;
}
.el-radio-button:last-child .el-radio-button__inner {
  border-radius: 6px;
  text-align: center;
}
.el-radio-button:first-child .el-radio-button__inner {
  border-radius: 6px;
  text-align: center;
}
.el-radio-button__inner {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  width: 100%;
  /* height: 100px; */
  line-height: 2;
  font-size: 35px;
}
.el-slider {
  width: 100%;
  margin-bottom: 50px;
}
.el-form-item__content {
  margin-left: 0px;
}
</style>