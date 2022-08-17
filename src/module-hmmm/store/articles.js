import { list } from '@/api/hmmm/articles'
export default {
  namespaced: true,
  state: {
    InterviewList: {},
  },
  mutations: {
    getInterviewList(state, payload) {
      state.InterviewList = payload
    },
    setState(state, payload) {
      const item = state.InterviewList.items.find((item) => item.id === payload)
      item.state === 1 ? (item.state = 0) : (item.state = 1)
    },
  },
  actions: {
    async getInterviewList(contxt, payload) {
      const { data } = await list(payload)
      contxt.commit('getInterviewList', data)
    },
  },
}
