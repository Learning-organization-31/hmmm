import {list} from '../../api/hmmm/subjects'

export default {
    namespaced: true,
    state: {
      subjectList:{},
    
    },
    mutations: {
     getSubjectList(state,payload){
        state.subjectList = payload
     },
    
    },
    actions: {
    async setSubjectList(context,payload){
        const res = await list(payload)
        console.log(res); 
        context.commit('getSubjectList',res)
     },

    }
}