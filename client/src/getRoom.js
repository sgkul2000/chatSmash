import axios from 'axios'

const url = "https://shielded-beyond-17297.herokuapp.com/api/room/"
// const url = "/api/room/"


class getRoom {
  static getRoomList() {
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        // console.log(url)
        const data = res.data
        resolve(data)
      }).catch((err) => {
        console.log(err)
        console.log(err.message)
        // console.log(url)
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
        console.log('user not signed in')
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
        // console.log(data)
        resolve(data)
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }

  //join room
  static joinRoom(user, roomName) {
    var uri = url + "join/"
    var data = {
      user: user,
      name: roomName
    }
    return new Promise((resolve, reject) => {
      axios.post(uri, data).then((res) => {
        console.log(res.status)
        const data = res.data
        // console.log(data)
        resolve(data)
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }
  //add message
  static addMessage(userName, roomName, message) {
    var uri = url + "newMessage/add/"
    var data = {
      username: userName,
      roomName: roomName,
      text: message
    }
    return new Promise((resolve, reject) => {
      axios.post(uri, data).then(res => {
        console.log(res.status)
        console.log("Message acknowledged")
        resolve()
      }).catch((err) => {
        console.log(err.message)
        console.log(err)
        reject(err)
      })
    })
  }
  //delete room
  static deleteRoom(roomName) {
    const data = {
      roomName: roomName
    }
    const uri = url + "deleteRoom/"
    return new Promise((resolve, reject) => {
      axios.post(uri, data).then((res) => {
        console.log(res.status)
        resolve()
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }

  //create or login user
  static userLogin(userName, nickName) {
    var uri = url+ "newUser/"
    const data = {
      name: userName,
      nickname: nickName
    }
    return new Promise((resolve, reject) => {
      axios.post(uri, data).then((res) => {
        console.log(res.status)
        resolve()
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }

}

export default getRoom
