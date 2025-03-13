import axios from 'axios';
import utils from '@/utils';


export default {
    name: 'customers',
    actions: {
        async loadCustomers({commit}) {
            await axios.get('./data/customers.json')
                .then((response) => {
                    const objs = utils.apiObjectsToObjects(response.data);
                    console.log("loadCustomers", objs)
                    commit("setCustomers", objs);
                })
                .catch((e) => {
                });
        }
    },
    mutations: {
        setCustomers(state, customers) {
            state.customers = customers;
        }
    },
    state: {
        customers: [],
    },
    getters:{
        getCustomers: (state) => {
            return state.customers;
        }
    }
}
