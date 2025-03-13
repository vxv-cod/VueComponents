import axios from 'axios';
import utils from '@/utils';


export default {
    name: 'fields',
    actions: {
        async loadFields({commit}) {
            await axios.get('./data/fields.json')
                .then((response) => {
                    const objs = utils.apiObjectsToObjects(response.data);
                    console.log("loadFields", objs)
                    commit("setFields", objs);
                })
                .catch((e) => {
                });
        }
    },
    mutations: {
        setFields(state, fields) {
            state.fields = fields;
        }
    },
    state: {
        fields: [],
    },
    getters:{
        getFields: (state) => {
            return state.fields;
        }
    }
}
