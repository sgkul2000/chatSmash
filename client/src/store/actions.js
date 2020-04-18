export default {
    loginUser: ({ commit }, payload) => {
        commit('updateUser', payload)
    }
}