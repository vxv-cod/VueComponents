<template>
  <div class="bands">
    <div :class="minimizied ? 'band-min' : 'band'" v-for="band in bands" :key="band.Index">
      <div class="band-size" :style="'width:' + band.LeftSize + '%;'"></div>
      <div class="band-size" :class="band.Pin" :style="'width:' + band.ValueSize + '%; background-color:' + band.Color" :title="band.Title"></div>
      <div class="band-size" :style="'width:' + band.RightSize + '%;'"></div>
    </div>
  </div>
  <!-- <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr v-for="band in bands" :key="band.Index">
      <td :style="'width:' + Math.round(band.LeftSize) + '%;'">
      </td>
      <td :style="'width:' + Math.round(band.ValueSize) + '%; background-color:' + band.Color">
      </td>
      <td :style="'width:' + Math.round(band.RightSize) + '%;'">
      </td>
    </tr>
  </table> -->
</template>

<script>

import localizeFilter from '@/localize';
import { mapGetters, mapActions } from "vuex"

export default {
  props: {
    task: {
      type: Object,
      default: () => null
    },
    month: {
      type: Object,
      default: () => null
    },
    minimizied: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      bands: []
    };
  },
  methods: {
     ...mapActions([
        "loadProjects",
    ]),
    getGraphTaskBand(taskTitle, taskStartDate, taskFinishDate, color, index) {
        
      const month = this.month;
      let Title = "";
      let LeftSize = 0;
      let ValueSize = 0;
      let RightSize = 0;
      let RangeEntry = false;

      if(month && taskStartDate instanceof Date && taskFinishDate instanceof Date) {
        const minStartDate = new Date(taskStartDate.getTime());
        const maxFinishDate = new Date(taskFinishDate.getTime());
        minStartDate.setHours(0, 0, 0, 0);
        maxFinishDate.setHours(23, 59, 59, 999);
        const taskStartTime = minStartDate.getTime();
        const taskFinishTime = maxFinishDate.getTime();

        if(taskStartTime >= month.StartTime && taskStartTime <= month.FinishTime) {
          LeftSize = Math.round((taskStartTime - month.StartTime) * 100 / (month.FinishTime - month.StartTime), 2);
          RangeEntry = true;
        }
        if(taskFinishTime >= month.StartTime && taskFinishTime <= month.FinishTime) {
          RightSize = Math.round((month.FinishTime - taskFinishTime) * 100 / (month.FinishTime - month.StartTime), 2);
          RangeEntry = true;
        }
        if(taskStartTime < month.StartTime && taskFinishTime > month.FinishTime) {
          RangeEntry = true;
        }

        if(RangeEntry) {
            Title = taskTitle + ": " + taskStartDate.toLocaleDateString() + " - " + taskFinishDate.toLocaleDateString();
            ValueSize = 100 - LeftSize - RightSize;
        }
      } else if (taskStartDate && taskStartDate instanceof Date && !taskFinishDate) {
        // значок начала (плана/прогноза/факта)
        const minStartDate = new Date(taskStartDate.getTime());
        const taskStartTime = minStartDate.getTime();
        if(taskStartTime >= month.StartTime && taskStartTime <= month.FinishTime) {
          LeftSize = Math.round((taskStartTime - month.StartTime) * 100 / (month.FinishTime - month.StartTime), 2);
          return {
            Title: taskTitle + ": " + taskStartDate.toLocaleDateString(),
            LeftSize,
            ValueSize: 1,
            RightSize: (99-LeftSize),
            Color: color,
            Index: index,
            Pin: ("band-pin-" + index + (this.minimizied ? "-min" : ""))
          }
        }        
      }
      
      return {
          Title,
          LeftSize,
          ValueSize,
          RightSize,
          RangeEntry,
          Color: color,
          Index: index,
          Pin: ""
      }
    },
    getGraphTaskBands() {
        let bands = [];
        const task = this.task;
        if(task) {

          const projectShift = this.getProjects.find(p => p.ID == task.ProjectID)?.Shifr;
          bands.push(this.getGraphTaskBand(projectShift + " - " + task.Title + " " + localizeFilter("Plan"), task.PlanStartDate, task.PlanFinishDate, "#00BFFF", 1));
          bands.push(this.getGraphTaskBand(projectShift + " - " + task.Title + " " + localizeFilter("Prognos"), task.PrognosStartDate, task.PrognosFinishDate, "#FFA500", 2));
          bands.push(this.getGraphTaskBand(projectShift + " - " + task.Title + " " + localizeFilter("Fact"), task.FactStartDate, task.FactFinishDate, "#32CD32", 3));
        }
        return bands;
    }
  },
  computed: {
    ...mapGetters([     
      "getProjects"
    ]),
  },
  async mounted() {
    if (!this.getProjects || !this.getProjects.length ) {
      await this.loadProjects();
    }
    this.bands = this.getGraphTaskBands();
  }
};
</script>

<style scoped>

  .bands {
    margin: 0;
    padding: 0;
    border: 0;
    display: block;
    position: relative;

  }
  .band {
    margin-top: 2px;
    margin-bottom: 3px;
    border: 0px solid;
    display: flex;
    cursor: pointer;
    position: relative;
  }
  .band .band-size {
    height: 9px;
  }

  .band-min {
    margin-top: 0px;
    margin-bottom: 2px;
    display: flex;
    cursor: pointer;
  }
  .band-min .band-size {
    height: 5px;
  }

  .band-pin-1 {
    border: 5px solid #00BFFF;
    border-radius: 5px;
  }
  .band-pin-2 {
    border: 5px solid #FFA500;
    border-radius: 5px;
  }
  .band-pin-3 {
    border: 5px solid #32CD32;
    border-radius: 5px;
  }
  .band-pin-1-min {
    border: 3px solid #00BFFF;
    border-radius: 3px;
  }
  .band-pin-2-min {
    border: 3px solid #FFA500;
    border-radius: 3px;
  }
  .band-pin-3-min {
    border: 3px solid #32CD32;
    border-radius: 3px;
  }

</style>