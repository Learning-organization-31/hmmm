import { list, detail } from '@/api/hmmm/companys'
export default {
  namespaced: true,
  state: {
    companysList: {},
    companysListEdit: {},
  },
  mutations: {
    getCompanysList(state, payload) {
      state.companysList = payload
    },
    editCompanysList(state, payload) {
      state.companysListEdit = payload
    },
  },
  actions: {
    async getCompanysList(contxt, payload) {
      const { data } = await list(payload)
      contxt.commit('getCompanysList', data)
    },
    async editCompanysList(contxt, payload) {
      const { data } = await detail(payload)
      data.isFamous === 1 ? (data.isFamous = true) : (data.isFamous = false)
      contxt.commit('editCompanysList', data)
    },
  },
}
