<template>
<div class="main">
  <div class="test container-fluid">
    <div class="row text-center">
      <div class="col-4 convBox px-0 heightSet">
        <div class="listHeader"><input type="text" class="roomSearch" v-model="roomSearch" placeholder="Search..."></div>
        <b-list-group class="listGroup" v-for="(room, index) in searchRoomComp" :key="index">
          <b-list-group-item class="listGroupItem list-group-item" @click="roomUpdate(room)">{{ room }}</b-list-group-item>
        </b-list-group>
        <div class="newRoom">
          <b-dropdown id="dropdown-right" right text variant class="m-2">
            <template v-slot:button-content>
              <i class="faso fas fa-plus"></i>
            </template>
            <b-dropdown-item v-b-modal.joinRoomModal>Join room</b-dropdown-item>
            <b-dropdown-item v-b-modal.createRoomModal>Create Room</b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <div class="col-8 px-0 chatPanel heightSet" v-if="room !== 'Home'">
        <div class="chatHeader">
          <div class="name"> {{ room }} <br>
            <p class="typing" v-show="typingVariable.roomName === room && room !== 'Home'">{{ typingVariable.typeString }}</p>
          </div>

          <div class="menu">
            <i v-if="this.room !== 'Home'" v-b-modal.deleteModal class="faso fas fa-trash-alt"></i>
          </div>
        </div>
        <div class="chatdivWrapper" id="chatwindow">
          <div class="chatDiv" v-for="(message, index) in roomForchats" :key="index">
            <div class="RowR" v-if="message.user === user.username && message.type === 'chat'">
              <div class="byYou">
                <span class>
                  <div class="userName">You</div>
                  {{ message.text }}
                  <span class="date">{{ dateParse(message.dateCreated) }}</span>
                </span>
              </div>
            </div>
            <div class="RowL" v-else-if="message.type === 'chat'">
              <div class="byYou byFriend">
                <span class>
                  <div class="userName">{{ message.user }}</div>
                  {{ message.text }}
                  <span class="date">{{ dateParse(message.dateCreated) }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="chatFooter">
          <b-input-group class="footerWrapper" size="sm" prepend append>
            <b-form-input @keyup.enter="messageSubmitHandler" @input="typeHandler" v-model="currentMessage" class="inputBar" id="inputBar" placeholder="Enter message...">
            </b-form-input>
            <button class="goaRound" @click="messageSubmitHandler">
              <i class="faso fas fa-paper-plane"></i>
            </button>
          </b-input-group>
        </div>
      </div>
      <div class="col-8 px-0 chatPanel heightSet">
        <div class="chatHeader">
          <div class="name"> {{ room }} <br>
            <p class="typing" v-show="typingVariable.roomName === room && room !== 'Home'">{{ typingVariable.typeString }}</p>
          </div>

          <div class="menu">
            <i v-if="this.room !== 'Home'" v-b-modal.deleteModal class="faso fas fa-trash-alt"></i>
          </div>
        </div>
        <div class="chatIconDiv">
          <img class="chatIcon" src="../assets/chatIcon.svg" alt="chatIcon">
          <div class="idleText">
            Please choose a conversation to start chatting.
          </div>
        </div>
      </div>

    </div>
  </div>
  <div class="newRoomDiv">
    <b-modal id="createRoomModal" ref="createRoomModal" title="Create Room" header-bg-variant="dark" header-text-variant="light" @show="resetModal" @hidden="resetModal" @ok="createNewRoom" :hide-header-close="true" ok-variant="success"
      cancel-variant="outline-danger" ok-title="Create" cancel-title="Cancel" button-size="sm">
      <b-form-group id="newRoom-group" label="Enter New Room Name:" label-for="newRoom-input">
        <b-form-input id="newRoom-input" v-model="newRoomName" required @keyup.enter="createNewRoom" placeholder="Enter Room name..."></b-form-input>
      </b-form-group>
    </b-modal>
  </div>
  <div class="joinRoomDiv">
    <b-modal id="joinRoomModal" ref="joinRoomModal" title="Join Room" header-bg-variant="dark" header-text-variant="light" @show="resetModal" @hidden="resetModal" @ok="joinNewRoom" ok-variant="success" :hide-header-close="true"
      cancel-variant="outline-danger" ok-title="Join" cancel-title="Cancel" button-size="sm">
      <b-form-group id="joinRoom-group" label="Enter Room Name:" label-for="joinRoom-input">
        <b-form-input id="joinRoom-input" v-model="searchRoomName" @keyup.enter="joinNewRoom" required placeholder="Search for an existing room..."></b-form-input>
      </b-form-group>
      <b-list-group>
        <div class="listItemsWrapper" v-for="(room,index) in filteredList" :key="index">
          <b-list-group-item href="#" :active="isIn(room.name)" @click="joinSet(room.name)">{{ room.name }}</b-list-group-item>
        </div>
      </b-list-group>
    </b-modal>
  </div>
  <div class="deleteConfirm">
    <b-modal id="deleteModal" ref="deleteModal" title="Confirm Deletion" header-bg-variant="dark" header-text-variant="light" ok-variant="success" @ok="deleteRoom" :hide-header-close="true" cancel-variant="outline-danger" ok-title="Yes"
      cancel-title="Cancel" button-size="sm">
      Are you sure you want to delete '{{ room }}' ?
    </b-modal>
  </div>
</div>
</template>

<script>
import getRoom from "../getRoom";
import {
  mapState
} from "vuex";

export default {
  name: "chat",
  data() {
    return {
      newRoomName: "",
      typingVariable: {
        typeString: "",
        roomName: ""
      },
      searchRoomName: "",
      roomSearch: "",
      pageLoaded: false,
      allRooms: [],
      roomList: [],
      allInOne: [],
      room: "Home",
      currentMessage: "",
      typing: {
        user: "",
        roomName: ""
      }
    };
  },
  sockets: {
    connect() {
      // alert('you\'re connect')
      // console.log("connection successful");
    },
    rightbackatya() {
      // console.log("everything looks perfect");
    },
    someonesTyping(data) {
      // console.log(data)
      this.typingDisplay(data);
      // this.typingVariable.typeString = data.user + "is typing..."
      // this.typingVariable.roomName = data.roomName
    },
    newMessageBroadcast(data) {
      // console.log('message recieved');
      this.newMessageHandler(data);
    },
    updateRoom() {
      // console.log('rooms updated');
      this.loadAllInOne();
      // console.log('loaded rooms successfully');
    }
  },
  watch: {
    roomForchats: function() {
      this.autoScroll();
      return true;
    }
  },
  methods: {
    // ...mapState(["user"]),
    // ...mapActions(["loadAllRooms"]),
    roomUpdate(roomName) {
      this.room = roomName;
      setTimeout(function() {
        if (this.room !== "Home") {
          const chatWindow = document.getElementById("chatwindow");
          var xH = chatWindow.scrollHeight;
          chatWindow.scrollTo(0, xH);
        }
      }, 700);
      this.autoScroll();
    },
    async deleteRoom() {
      try {
        await getRoom.deleteRoom(this.room);
        this.$socket.emit("newRoomCreated");
        var title = "Room Deleted";
        var message = "Room " + this.room + " was deleted successfully";
        this.makeToast(title, message);
        this.room = "Home";
        this.loadAllInOne();
      } catch (err) {
        console.log(err);
      }
    },
    getRoomChatsList(roomname) {
      var roomObj = this.allInOne.filter(room => {
        return room.roomName === roomname;
      });

      return roomObj[0].chats;
    },
    messageSubmitHandler() {
      var chatlist = this.getRoomChatsList(this.room);
      chatlist.push({
        user: this.user.username,
        type: "chat",
        text: this.currentMessage,
        dateCreated: new Date()
      });
      var mesData = {
        user: this.user.username,
        text: this.currentMessage,
        roomName: this.room
      };
      this.$socket.emit("newMessage", mesData);
      getRoom.addMessage(this.user.username, this.room, this.currentMessage);
      this.currentMessage = "";
    },
    newMessageHandler(data) {
      if (this.roomList.includes(data.roomName)) {
        this.makeToast(data.roomName, data.text);
        var chatlist = this.getRoomChatsList(data.roomName);
        chatlist.push({
          user: data.user,
          type: "chat",
          text: data.text,
          dateCreated: new Date()
        });
      }
    },
    typeHandler() {
      var data = {
        user: this.user.username,
        roomName: this.room,
        nickname: this.user.nickname
      };
      // console.log(data);
      this.$socket.emit("typing", data);
    },
    typingDisplay(data) {
      this.typingVariable.typeString = data.nickname + " is typing...";
      this.typingVariable.roomName = data.roomName;
      setTimeout(() => {
        this.typingVariable = {
          typeString: "",
          roomName: "",
          nickname: ""
        };
      }, 2000);
    },
    autoScroll() {
      if (this.room !== "Home") {
        const chatWindow = document.getElementById("chatwindow");
        var xH = chatWindow.scrollHeight;
        chatWindow.scrollTo(0, xH);
      }
    },
    makeToast(Title, message) {
      this.$bvToast.toast(message, {
        title: Title,
        autoHideDelay: 2000,
        appendToast: false
      });
    },
    async joinNewRoom() {
      try {
        this.$refs["joinRoomModal"].hide();
        if (this.roomList.includes(this.searchRoomName)) {
          this.makeToast("Oops!", "You are already a part of the room!");
          return null;
        }
        if (!this.allRoomListComp.includes(this.searchRoomName)) {
          this.makeToast("Error!", "Choose a correct room name to join!");
          return null;
        }
        var title = "Joined";
        var mes = await getRoom.joinRoom(
          this.user.username,
          this.searchRoomName
        );
        await this.loadAllInOne();
        this.makeToast(title, mes);
      } catch (err) {
        console.log(err);
        console.log(err.message);
      }
    },
    async createNewRoom() {
      try {
        this.$refs["createRoomModal"].hide();
        if (this.newRoomName === "") {
          this.makeToast("Error!", "Please enter a valid room name.");
          return null;
        }
        var title = "Room Created";
        var mes = await getRoom.createRoom(
          this.user.username,
          this.newRoomName
        );
        this.loadAllInOne();
        this.$socket.emit("newRoomCreated");
        this.makeToast(title, mes);
      } catch (err) {
        console.log(err);
        console.log(err.message);
      }
    },
    isIn(roomName) {
      return this.roomList.includes(roomName);
    },
    auto_grow() {
      const element = document.getElementById("inputBar");
      element.style.height = "5px";
      element.style.height = element.scrollHeight + "px";
    },
    joinSet(roomName) {
      this.searchRoomName = roomName;
    },
    resetModal() {
      this.newRoomName = "";
      this.searchRoomName = "";
    },
    async loadAllInOne() {
      try {
        this.allInOne = [];
        this.allRooms = await getRoom.getRoomList();
        this.roomList = await getRoom.getSpecificRoom(this.user.username);
        var i = 0;
        var tempRoomList = this.roomList;
        for (i = 0; i < tempRoomList.length; i++) {
          // console.log("the list is: "+tempRoomList)
          // console.log(tempRoomList[i])
          var tempChats = await getRoom.getRoomChats(tempRoomList[i]);
          // console.log(tempChats)
          this.allInOne.push({
            roomName: tempRoomList[i],
            chats: tempChats
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    dateParse(dateObj) {
      // console.log(Date.parse(dateObj))
      var tempTime = Date.parse(dateObj);
      var hours = new Date(tempTime).getHours();
      var mins = new Date(tempTime).getMinutes();
      return hours + ":" + mins;
    }
  },
  computed: {
    ...mapState(["user"]),
    roomListComp() {
      return this.roomList;
    },
    allRoomListComp() {
      var newList = [];
      var i = 0;
      for (i = 0; i < this.allRooms.length; i++) {
        newList.push(this.allRooms[i].name);
      }
      return newList;
    },
    filteredList() {
      if (this.searchRoomName.length > 1) {
        return this.allRooms.filter(room => {
          return room.name
            .toLowerCase()
            .includes(this.searchRoomName.toLowerCase());
        });
      } else {
        return null;
      }
    },
    roomForchats() {
      if (!this.pageLoaded) {
        return [];
      }
      // console.log(this.allInOne)
      var all = this.allInOne;
      var nameOfRoom = this.room;
      if (nameOfRoom === "Home") {
        nameOfRoom = "team quarantine quack";
      }
      var roomie = all.find(room => {
        return room.roomName === nameOfRoom;
      });
      if (typeof roomie == "undefined") {
        return [];
      }
      return roomie.chats;
    },
    searchRoomComp() {
      if (this.roomSearch.length > 1) {
        return this.roomList.filter(room => {
          return room.toLowerCase().includes(this.roomSearch.toLowerCase());
        });
      } else {
        return this.roomList;
      }
    }
  },
  async created() {
    try {
      // alert(screen.width);
      this.loadAllInOne();
    } catch (err) {
      console.log(err.message);
    }
  },
  mounted() {
    this.pageLoaded = true;
    this.autoScroll();
    this.$socket.emit("hey");
    // console.log("just called socket");
  }
};
</script>

<style lang="css" scoped>
@import '../styles/chat.css';



.inputBar {
  width: 80% !important;
  padding: 0.2rem 1rem;
  margin-left: 0.7rem;
  margin-right: 0.4rem;
  border-radius: 15px !important;
  /* height: 1.9rem; */
  min-height: 1.9rem;
  max-height: 6rem;
  resize: none;
  overflow: hidden;
  /* max-height: 1.9rem; */
}

html,
body {
  margin: 0 !important;
  padding: 0 !important;
}

* {
  box-sizing: border-box !important;
}

#dropdown-right__BV_toggle_{
  background-color: #fff !important;
  border: none !important;
}

.btn-secondary, .btn{
  background-color: #fff !important;
  border: none !important;
}

.btn-secondary:hover{
  background-color: transparent !important;
  border: none !important;

}

.newRoom {
  position: fixed;
  bottom: 0.8rem;
  left: 22vw;
}



</style>


// @input="auto_grow"
//                 rows="1"
//                 max-rows="6"
//                 no-resize
