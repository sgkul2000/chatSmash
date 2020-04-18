import axios from 'axios'

const url = "/api/room/"

class getRoom {
  static getRoomList() {
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        console.log(url)
        const data = res.data
        resolve(data)
      }).catch((err) => {
        console.log(err)
        console.log(err.message)
        console.log(url)
        reject(err)
      })
    })
  }
  static getSpecificRoom(userName) {
    var uri = url + "getRoomList/" + userName + "/"
    return new Promise((resolve, reject) => {
      axios.get(uri).then((res) => {
        const data1 = res.data
        // console.log(data1)
        const data2 = data1[0]
        const data = data2.rooms
        // console.log(data)
        resolve(data)
      }).catch((err) => {
        console.log(err)
        console.log(err.message)
        reject(err)
      })
    })
  }

  //load Chats
  static getRoomChats(roomName) {
    var uri = url + roomName + "/"
    return new Promise((resolve, reject) => {
      axios.get(uri).then((res) => {
        const data = res.data
        resolve(data)
      }).catch((err) => {
        console.log(err)
        console.log(err.message)
        reject(err)
      })
    })
  }
  //create room
  static createRoom(user, roomName) {
    var uri = url + "newRoom/"
    var data = {
      "user":user,
      "roomName": roomName
    }
    return new Promise((resolve, reject) => {
      axios.post(uri, data).then((res) => {
        console.log(res.status)
        const data = res.data
        console.log(data)
        resolve(data)
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }

  //join room
  static joinRoom(user, roomName) {
    var uri = url + "join/" + roomName + "/" + user + "/"
    return new Promise((resolve, reject) => {
      axios.get(uri).then((res) => {
        console.log(res.status)
        const data = res.data
        console.log(data)
        resolve(data)
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }

}

export default getRoom