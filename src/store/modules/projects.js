import axios from 'axios';
import utils from '@/utils';


export default {
    name: 'projects',
    actions: {
        async loadProjects({commit}) {
            await axios.get('./data/projects.json')
                .then((response) => {
                    const objs = utils.apiObjectsToObjects(response.data);
                    console.log("loadProjects", objs)
                    commit("setProjects", objs);
                })
                .catch((e) => {
                });
        }
    },
    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        }
    },
    state: {
        projects: [],
    },
    getters:{
        getProjects: (state) => {
            return state.projects;
        }
    }
}
