<template>
  <div style="height: 100%;">
    <b-modal id="deleteModal" ref="deleteModalRef" size="lg" title="Delete" @ok="deleteNotebook" ok-title="Delete">
      <b-container fluid>
        You are going to delete the notebook {{ this.del.selectedNotebook.name }}. It contains {{ this.del.selectedNotebook.notesCount }} notes.
        To confirm delete, enter the password of the notebook.
        <b-row>
          <b-col sm="3"><label for="deletePasswordInput">Password:</label></b-col>
          <!-- TODO: Change to password input type as soon as https://github.com/bootstrap-vue/bootstrap-vue/issues/1908 is resolved -->
          <b-col><b-form-input id="deletePasswordInput" type="text" placeholder="Enter password for this notebook." v-model="del.password"/></b-col>
        </b-row>
      </b-container>
    </b-modal>
    <div class="notebooklist" v-if="notebooks.length !== 0">
      <span class="header">Existing notebooks:</span>
      <b-list-group class="list">
        <b-list-group-item :key="notebook" v-for="notebook in sortedNotebooks" class="d-flex justify-content-between align-items-center notebooklist-item">
          {{ notebook.name }}
          <span>
            <b-badge variant="primary" pill>{{ notebook.notesCount }}</b-badge>
            <button class="delete-btn" @click="() => selectNotebookToDelete(notebook)">🗑</button>
          </span>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
  import NotesApiService from "./../services/NotesApiService";
  import { md5 } from "./../services/md5";

  export default {
    name: 'notebook-list',
    props: ['notebooks'],
    data() {
      return {
        del: {
          selectedNotebook: "",
          password: "",
        }
      };
    },
    computed: {
      sortedNotebooks: function() {
        return this.notebooks.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      },
    },
    mounted() {
      this.loadNotebooks()
    },
    methods: {
      showModal () {
        this.$refs.deleteModalRef.show()
      },
      hideModal () {
        this.del = {
          selectedNotebook: "",
          password: "",
        }
        this.$refs.deleteModalRef.hide()
      },
      loadNotebooks: function() {
        let vm = this;
        NotesApiService.list()
          .then(res => {
            vm.$emit("notebooksLoaded", res);
          })
          .catch(() => {
            // No need to show a message, because the user can still use the app.
          });
      },
      selectNotebookToDelete: function(notebook) {
        this.del.selectedNotebook = notebook;
        this.showModal()
      },
      deleteNotebook: function() {
        let vm = this;
        NotesApiService.delete(this.del.selectedNotebook.name, md5(this.del.password))
          .then(res => {
            vm.$emit("notebooksLoaded", res)
          })
          .catch((error) => {
            vm.$emit("alert", error)
          })
        this.hideModal()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .notebooklist {
    height: 100%;
  }

  .notebooklist .notebooklist-item {
    padding: 1.75em 1.25em;
  }

  .header {
    font-size: 30px;
    color: rgb(73, 80, 87);
  }

  .list {
    height: 100%;
    overflow-x: auto;
    margin-top: 12px;
  }
</style>
