export default {
  state: {
    historyTagView: [],
    tagViews: [],
  },
  mutations: {
    addTag(state, payload) {
      if (state.tagViews.indexOf(payload) == -1) {
        state.tagViews.push(payload)
      }
      if (state.historyTagView.indexOf(payload) == -1) {
        state.historyTagView.push(payload)
      } else {
        state.historyTagView.splice(state.historyTagView.indexOf(payload), 1)
        state.historyTagView.push(payload)
      }
    },
    delTag(state, payload) {
      const index = state.tagViews.indexOf(payload)
      if (index > -1) {
        state.tagViews.splice(index, 1)
      }
      const historyIndex = state.historyTagView.indexOf(payload)
      if (historyIndex > -1) {
        state.historyTagView.splice(historyIndex, 1)
      }
    }
  },
  actions: {},
  getters: {
    tagViews: state => state.tagViews,
    currentTagView: state => state.historyTagView[state.historyTagView.length - 1]
  }
}
