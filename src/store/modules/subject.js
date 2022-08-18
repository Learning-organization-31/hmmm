import {list} from '../../api/hmmm/subjects'
import {directoryList,changeState} from '../../api/hmmm/directorys'

export default {
    namespaced: true,
    state: {
      subjectList:{},
      directoryList:{},
      stateList:{}
    },
    mutations: {
     getSubjectList(state,payload){
        state.subjectList = payload
     },
     getDirectoryList(state,payload){
      state.directoryList = payload
   },
      getStateList(state,payload){
         state.stateList = payload
      }
    },
    actions: {
    async setSubjectList(context,payload){
        const {data} = await list(payload)
        context.commit('getSubjectList',data)
     },
     async setDirectoryList(context,payload){
      const {data} = await directoryList(payload)
      context.commit('getDirectoryList',data.items)
   },
   async setStateList(context,payload){
      const res = await changeState(payload)
      context.commit('getStateList',res)
   }
    }
}