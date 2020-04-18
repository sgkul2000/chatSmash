<template>
  <div class="main">
    <div class="test">
      <div class="row text-center mx-auto">
        <div class="col-3 ml-auto convBox px-0 heightSet">
          <div class="heightSet">
            <div class="listHeader">Conversations</div>
            <b-list-group
              class="listGroup"
              v-for="(room, index) in roomListComp"
              :key="index"
            >
              <b-list-group-item
                class="listGroupItem"
                @click="roomUpdate(room)"
              >{{ room }}</b-list-group-item>
            </b-list-group>
            <div class="newRoom">
              <b-dropdown
                id="dropdown-right"
                right
                text
                variant
                class="m-2"
              >
                <template v-slot:button-content>
                  <i class="faso fas fa-plus"></i>
                </template>
                <b-dropdown-item v-b-modal.joinRoomModal>Join room</b-dropdown-item>
                <b-dropdown-item v-b-modal.createRoomModal>Create Room</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
        <div class="col-8 col-md-7 mr-auto px-0 chatPanel heightSet">
          <div class="chatHeader">
            <div class="name">{{ room }}</div>

            <div class="menu">
              <i class="faso fas fa-ellipsis-v"></i>
            </div>
          </div>
          <div
            class="chatDiv"
            v-for="(message, index) in roomForchats"
            :key="index"
          >
            <div
              class="RowR"
              v-if="message.user === user.username && message.type === 'chat'"
            >
              <div class="byYou">
                <span class>
                  <div class="userName">You</div>
                  {{ message.text }}
                  <span class="date">{{ dateParse(message.dateCreated) }}</span>
                </span>
              </div>
            </div>
            <div
              class="RowL"
              v-else-if="message.type === 'chat'"
            >
              <div class="byYou byFriend">
                <span class>
                  <div class="userName">{{ message.user }}</div>
                  {{ message.text }}
                  <span class="date">{{ dateParse(message.dateCreated) }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="chatFooter">
            <b-input-group
              class="footerWrapper"
              size="sm"
              prepend
              append
            >
              <textarea
                @input="auto_grow()"
                class="inputBar"
                id="inputBar"
                placeholder="Enter message..."
                rows="1"
                max-rows="6"
                no-resize
              ></textarea>
              <button class="goaRound">
                <i class="faso fas fa-paper-plane"></i>
              </button>
            </b-input-group>
          </div>
        </div>
      </div>
    </div>
    <div class="newRoomDiv">
      <b-modal
        id="createRoomModal"
        ref="createRoomModal"
        title="Create Room"
        header-bg-variant="dark"
        header-text-variant="light"
        @show="resetModal"
        @hidden="resetModal"
        @ok="createNewRoom"
        :hide-header-close="true"
        ok-variant="success"
        cancel-variant="outline-danger"
        ok-title="Create"
        cancel-title="Cancel"
        button-size="sm"
      >
        <b-form-group
          id="newRoom-group"
          label="Enter New Room Name:"
          label-for="newRoom-input"
        >
          <b-form-input
            id="newRoom-input"
            v-model="newRoomName"
            required
            placeholder="Enter Room name..."
          ></b-form-input>
        </b-form-group>
      </b-modal>
    </div>
    <div class="joinRoomDiv">
      <b-modal
        id="joinRoomModal"
        ref="joinRoomModal"
        title="Join Room"
        header-bg-variant="dark"
        header-text-variant="light"
        @show="resetModal"
        @hidden="resetModal"
        @ok="joinNewRoom"
        ok-variant="success"
        :hide-header-close="true"
        cancel-variant="outline-danger"
        ok-title="Create"
        cancel-title="Cancel"
        button-size="sm"
      >
        <b-form-group
          id="joinRoom-group"
          label="Enter Room Name:"
          label-for="joinRoom-input"
        >
          <b-form-input
            id="joinRoom-input"
            v-model="searchRoomName"
            required
            placeholder="Search for an existing room..."
          ></b-form-input>
        </b-form-group>
        <b-list-group>
          <div
            class="listItemsWrapper"
            v-for="(room,index) in filteredList"
            :key="index"
          >
            <b-list-group-item
              href="#"
              :active="isIn(room.name)"
            >{{ room.name }}</b-list-group-item>
          </div>
        </b-list-group>
      </b-modal>
    </div>
  </div>
</template>

<script>
import getRoom from "../getRoom";
import { mapState } from "vuex";

export default {
  name: "chat",
  data() {
    return {
      newRoomName: "",
      searchRoomName: "",
      pageLoaded: false,
      allRooms: [],
      roomList: [],
      allInOne: [],
      room: "Home"
    };
  },
  sockets: {
    connect() {
      // alert('you\'re connect')
    }
  },
  methods: {
    // ...mapState(["user"]),
    // ...mapActions(["loadAllRooms"]),
    roomUpdate(roomName) {
      this.room = roomName;
    },
    makeToast(Title, message) {
      this.$bvToast.toast(message, {
        title: Title,
        autoHideDelay: 2500,
        appendToast: false
      });
    },
    async joinNewRoom() {
      try {
        var title = "Joined";
        var mes = await getRoom.joinRoom();
        this.reloadRooms();
        this.makeToast(title, mes);
      } catch (err) {
        console.log(err);
        console.log(err.message);
      }
    },
    async createNewRoom() {
      try {
        var title = "Room Created";
        var mes = await getRoom.createRoom(
          this.user.username,
          this.newRoomName
        );
        this.loadAllInOne();
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
    resetModal() {
      this.newRoomName = "";
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
    }
  },
  async created() {
    try {
      this.loadAllInOne();
    } catch (err) {
      console.log(err.message);
    }
  },
  mounted() {
    this.pageLoaded = true;
  }
};
</script>

<style scoped>
@import "../styles/chat.css";

.inputBar {
  width: 80% !important;
  padding: 0.2rem 1rem;
  margin-right: 0.4rem;
  border-radius: 15px !important;
  /* height: 1.9rem; */
  min-height: 1.9rem;
  max-height: 6rem;
  resize: none;
  overflow: hidden;
  /* max-height: 1.9rem; */
}
</style>
