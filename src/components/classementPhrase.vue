<template>
  <div class="hello">
    {{ flatWordsgroupesIds }}
    <div>
      <div>
        <button @click.prevent.stop="lang = 'ltr'">français</button>
        <button @click.prevent.stop="lang = 'rtl'">Arabe</button>
      </div>
      <textarea
        cols="70"
        rows="5"
        v-model="text"
        :style="{ direction: lang }"
      ></textarea>
      <br />
      <button @click="detectWords">detecter les mots</button>
    </div>
    <br />

    <div>
      <template v-for="element in words">
        <span
          :key="element.id"
          :class="{ exist: flatWordsgroupesIds.includes(element.id) }"
          class="span"
          draggable
          @dragstart="startDrag($event, element)"
        >
          {{ element.word }}
        </span>
      </template>
    </div>
    <div>
      <input type="text" v-model="groupename" placeholder="Groupe" />
      <button v-if="groupename.length >= 3" @click.prevent.stop="addGroupe">
        Ajouter groupe
      </button>
    </div>
    <div class="groupes">
      <template v-if="groupes.length > 0">
        <div
          v-for="(groupe, i) in groupes"
          :key="i"
          class="groupe"
          @dragover.prevent
          @dragenter.prevent
          @dragover="dragover"
          @drop="onDrop($event, groupe)"
        >
          <div>
            <button @click.prevent.stop="effaceGroupe(groupe)">X</button>
            <h3>{{ groupe.groupename }}</h3>
          </div>
          <ul>
            <template v-if="groupe.items.length > 0">
              <li v-for="(item, i) in groupe.items" :key="i">
                <button @click.prevent.stop="effaceItem(groupe, item)">
                  X
                </button>
                {{ item.word }}
              </li>
            </template>
          </ul>
        </div>
      </template>
    </div>
    <hr />
    <p>élève</p>
    <div>
      <button @click.prevent.stop="initialiser">Start</button>
    </div>
    <div>
      <template v-for="element in words">
        <span
          :key="element.id"
          :class="{ exist: flatWordsgroupesEleves.includes(element.id) }"
          class="span"
          draggable
          @dragstart="startDragEleve($event, element)"
        >
          {{ element.word }}
        </span>
      </template>
    </div>
    <div>
      <div class="groupes">
        <template v-if="groupesEleves.length > 0">
          <div
            v-for="(groupe, i) in groupesEleves"
            :key="i"
            class="groupe"
            @dragover.prevent
            @dragenter.prevent
            @dragover="dragover"
            @drop="onDropEleve($event, groupe)"
          >
            <div>
              <button @click.prevent.stop="effaceGroupe(groupe)">X</button>
              <h3>{{ groupe.groupename }}</h3>
            </div>
            <ul>
              <template v-if="groupe.items.length > 0">
                <li
                  v-for="(item, i) in groupe.items"
                  :key="i"
                  :class="{
                    correct: isCorrect(groupe, item),
                    wrong: !isCorrect(groupe, item),
                  }"
                >
                  {{ item.word }}
                </li>
              </template>
            </ul>
          </div>
        </template>
      </div>
      <button @click="showCorrection = true">Corriger</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupename: "",
      groupes: [],
      groupesEleves: [],
      showCorrection: false,
      lang: "ltr",
      currentWord: null,
      edit: false,
      text:
        "أعلن جوسيب جوارديولا، المدير الفني لفريق مانشستر سيتي الإنجليزي لكرة القدم، عن نيته في الرحيل عن فريقه الحالي واستكشاف الفرص على المستوى الدولي عندما ينتهي تعاقده ب نهاية الموسم المقبل.",
      words: [],
      list2: [],
      reponses: [],
    };
  },
  methods: {
    effaceItem(groupe, item) {
      let gr = this.groupes.find((gr) => gr.groupename == groupe.groupename);
      if (gr) {
        gr.items = gr.items.filter((it) => it.id != item.id);
      }
    },
    isCorrect(groupe, item) {
      let gr = this.groupes.find((gr) => gr.groupename == groupe.groupename);
      let exist = false;
      if (gr) {
        if (gr.items.length > 0) {
          gr.items.forEach((it) => {
            if (it.id == item.id) {
              exist = true;
            }
          });
        }
      }
      return exist;
    },
    initialiser() {
      let arr = [];
      this.groupes.forEach((gr) => {
        arr.push({ groupename: gr.groupename, items: [] });
      });
      this.groupesEleves = arr;
    },
    addGroupe() {
      this.groupes.push({ groupename: this.groupename, items: [] });
      this.groupename = "";
    },
    effaceGroupe(groupe) {
      this.groupes = this.groupes.filter(
        (gr) => gr.groupename != groupe.groupename
      );
    },
    startDragEleve: (evt, item) => {
      console.log(item);
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("text", JSON.stringify(item));
    },
    onDropEleve(evt, groupe) {
      console.log(evt.dataTransfer.getData("text"));
      const newEl = JSON.parse(evt.dataTransfer.getData("text"));
      let groupes = this.groupesEleves;
      this.groupesEleves.forEach((gr) => {
        if (gr.groupename == groupe.groupename) {
          gr.items.push(newEl);
        }
      });
      this.groupesEleves = groupes;
      console.log(newEl);
    },
    startDrag: (evt, item) => {
      console.log(item);
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("text", JSON.stringify(item));
    },
    onDrop(evt, groupe) {
      console.log(evt.dataTransfer.getData("text"));
      const newEl = JSON.parse(evt.dataTransfer.getData("text"));
      let groupes = this.groupes;
      groupes.forEach((gr) => {
        if (gr.groupename == groupe.groupename) {
          gr.items.push(newEl);
        }
      });
      this.groupes = groupes;
      console.log(newEl);
    },
    dragover(evt) {
      console.log("dragover");
      //console.log(evt.added.element);
    },
    checkfillIn(evt) {
      console.log("checkfillIn");
      //console.log(evt.added.element);
    },
    diviser(element) {
      let newWord = element.word;
      //console.log(newWord.split(" "));
      let divisions = newWord.split(" ");
      let vm = this;
      this.currentWord = null;
      let arr = [];
      this.words.forEach((e) => {
        if (e == element) {
          divisions.forEach((d, i) => {
            if (i == 0) {
              vm.currentWord = { id: e.id + i, word: d, liaison: true };
              arr.push({ id: e.id + i, word: d, liaison: true });
            } else {
              arr.push({ id: e.id + i, word: d, liaison: false });
            }
          });
        } else {
          arr.push(e);
        }
        this.words = arr;
      });
    },
    lier(element) {
      element.liaison = true;
    },
    clickTerm(evt, word) {
      if (this.currentWord == word) {
        this.currentWord = null;
      } else {
        this.currentWord = word;
      }
      //console.log(word);
    },
    addToList2(e) {
      //console.log(e.added);
      //this.list2.push(e.added.element);
    },
    efface(el) {
      this.list2 = this.list2.filter((e) => e.id !== el.id);
    },

    detectWords() {
      let arr = this.text.split(" ");
      this.words = arr.map((mot, i) => {
        return { id: i, word: mot, liaison: false };
      });
      //console.log(this.words);
    },
  },
  computed: {
    flatWordsgroupesIds() {
      return this.flatWordsgroupes.map((el) => el.id);
    },
    flatWordsgroupes() {
      let words = [];
      this.groupes.forEach((gr) => {
        if (gr.items.length > 0) {
          gr.items.forEach((item) => {
            words.push(item);
          });
        }
      });
      return words;
    },
    flatWordsgroupesEleves() {
      let words = [];
      this.groupesEleves.forEach((gr) => {
        if (gr.items.length > 0) {
          gr.items.forEach((item) => {
            words.push(item.id);
          });
        }
      });
      return words;
    },
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.group {
  width: 150px;
  height: 70px;
  padding: 10px;
  border: 1px solid #aaaaaa;
}
.list-group-item {
  background: orange;
  margin: 1px;
}
.exist {
  background: orange;
}
p {
  text-align: left;
}
.span {
  /*
  border: solid 0.5px #111;
  padding: 0 2px;
  */
}
.span:hover {
  cursor: pointer;
}
.current {
  background: paleturquoise;
}
.current-word {
  font-size: 20px;
}
.espace {
  margin: 0 3px;
}
.selected {
  background: burlywood;
}
.correct {
  background: greenyellow;
}
.wrong {
  background: red;
}
.groupe {
  background: #eee;
  min-width: 150px;
  max-width: 250px;
  margin: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.groupe h3 {
  margin: 5px;
}
.groupes {
  display: flex;
}
</style>
