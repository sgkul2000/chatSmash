export default {
    updateUser: (state, payload) => {
        state['user'] = {
            username: payload.username,
            nickname: payload.nickname
        }
    }
}