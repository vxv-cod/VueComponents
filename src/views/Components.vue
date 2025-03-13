<template>
    <h1>Компоненты</h1>
    <div>
        <h2>Tabs</h2>        
        <Tabs>
            <Tab title="Вкладка1" name="tab1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Tab>
            <Tab title="Вкладка2" name="tab2">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
            </Tab>
        </Tabs>        
    </div>    
    <div>      
      <h2>Иконки</h2>
      <Icon :icon="'gear'" size="16px"/>
      <Icon :icon="'user'" size="32px"/>
      <Icon :icon="'house'" color="#E1FF00" size="64"/>
      <Icon :icon="'coffee'" />
      <Icon :icon="'triangle-exclamation'" />
      <Icon :icon="'heart'" />
      <Icon :icon="'circle-info'" />
      <Icon :icon="'basketball'" />
      <Icon :icon="'triangle-exclamation'"/>
      <Icon :icon="'compact-disc'" />
      <Icon :icon="'bell'" />
      <Icon :icon="'cog'" />
      <Icon :icon="'compass'" />
      <Icon :icon="'spinner'" />
    </div>
    <div>
      <h2>ProgressBar</h2>
      <div class="progress">
          <ProgressBar
            :show-plan="true"
            fill-percentage="45"
            planPercentage="65">            
          </ProgressBar>         
          <ProgressBar
            :show-plan="true"
            fill-percentage="60"
            planPercentage="45">            
          </ProgressBar>
          <ProgressBar
            :show-plan="false"
            fill-percentage="50"
            planPercentage="45">            
          </ProgressBar>
      </div>       
    </div>    
    <div>
        <h2>TextBox</h2>
        <div>
          <div>
            DevExtreme:
            <TextBoxDev  
              value="Text"
              placeholder="Placeholder text"
              width="200px"
              :buttons="buttons"
              :show-clear-button="true"
              :showInFocus="true"
              :on-value-changed="onButtonClick">
            </TextBoxDev>
          </div>
          <div>
            RN:
            <TextBox  
              value="Text"
              placeholder="Placeholder text"
              width="200px"
              :buttons="buttons"
              :show-clear-button="true"
              :showInFocus="true"
              :disabled="false"
              :on-value-changed="onButtonClick">
            </TextBox>
        </div>
        </div>
       
    </div>
</template>


<script setup>
import { ref, defineProps, inject, onMounted, computed} from 'vue'
import Tab from '@/components/RN/Tab.vue';
import Tabs from '@/components/RN/Tabs.vue';
import TextBoxDev from '@/components/Common/TextBox.vue';
import TextBox from '@/components/RN/TextBox.vue';
//import Icon from '@/components/RN/Icon.vue';
import ProgressBar from '@/components/RN/ProgressBar.vue';
const props = defineProps({
  /*title: {
    type: String,
    default: 'Tab'
  },
  name: {
    type: String,
    default: ''
  },
  selectedTab: {
    type: String,
    default: ''
  }*/
})

const onButtonClick = () => {
  console.log("Click")
}

const buttons = computed(() => {
  return [{
      name: 'search',
      location: 'after',
      options: {
          icon: 'search',
          width: 50,
          onClick: () => {
              console.log("click")
          },
      },
  }];
})

/*const isActive = ref(false)
const registerTab = inject("registerTab")

const setIsActive = (value) => {
  isActive.value = value;
}*/

/*onMounted(() => {
  registerTab({name: props.name, title: props.title, setIsActive: setIsActive })  
})*/
</script>

<style>
  .progress {
    width: 400px;
    padding: 10px;    
  }
  .progress > div {
    margin-top: 40px;
    margin-bottom: 40px;
  }
</style>