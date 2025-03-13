import axios from 'axios';
import utils from '@/utils';


export default {
    name: 'users',
    actions: {
        async loadUsers({commit}) {
            await axios.get('./data/users.json')
                .then((response) => {
                    const objs = utils.apiObjectsToObjects(response.data);
                    console.log("loadUsers", objs)
                    commit("setUsers", objs);
                })
                .catch((e) => {
                });
        }
    },
    mutations: {
        setUsers(state, users) {
            state.users = users;
        }
    },
    state: {
        users: [],
    },
    getters:{
        getUsers: (state) => {
            return state.users;
        }
    }
}
