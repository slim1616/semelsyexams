<template>
  <div class="hello">
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
    <div v-if="currentWord">
      <button @click.prevent.stop="currentWord = null">X</button>
      <input class="current-word" type="text" v-model="currentWord.word" />
      <button @click="lier(currentWord)">lier avec le suivant</button>
      <button @click="diviser(currentWord)">diviser</button>
    </div>
    <div>
      <draggable
        :sort="false"
        v-model="words"
        :group="{ name: 'question', pull: 'clone', put: false }"
        @start="drag = true"
        @end="drag = false"
      >
        <template v-for="(element, i) in words">
          <span
            :key="element.id"
            class="span"
            style="font-size: 22px"
            @click="clickTerm($event, element)"
            :class="{
              exist: list2.includes(element),
              current: element == currentWord,
            }"
            >{{ element.liaison ? element.word : element.word + " " }}</span
          >
        </template>
      </draggable>
    </div>
    <div>
      <div>
        <p>Liste de mots</p>
        <draggable
          class="dragArea list-group group"
          :list="list2"
          group="question"
          @change="addToList2"
        >
          <div
            class="list-group-item"
            v-for="(element, i) in list2"
            :key="element.id"
          >
            {{ element.word }}
            <button @click.prevent.stop="efface(element)">X</button>
          </div>
        </draggable>
      </div>
    </div>

    <hr />
    <p>élève</p>

    <ul>
      <template v-for="(element, i) in list2">
        <li
          :key="element.id"
          style="font-size: 22px; margin: 2px"
          draggable
          @dragstart="startDrag($event, element)"
        >
          {{ element.word }}
        </li>
      </template>
    </ul>
    <template v-for="element in words">
      <template v-if="list2.includes(element)">
        <template v-if="element.reponse != null">
          <span
            :key="element.id"
            :class="{
              selected: element.reponse != null,
              correct: showCorrection && element.id == element.reponse.id,
              wrong: showCorrection && element.id != element.reponse.id,
            }"
          >
            {{ element.reponse.word }}
          </span>
        </template>
        <template v-else>
          <span
            @dragover.prevent
            @dragenter.prevent
            @dragover="dragover($event)"
            class="span"
            :key="element.id"
            @drop="onDrop($event, element)"
            >_______</span
          >
        </template>
      </template>
      <template v-else>
        <span :class="{ selected: reponses.includes(element) }">
          {{ element.word }}
        </span>
      </template>
    </template>
    <div>
      <button @click="showCorrection = true">Corriger</button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "HelloWorld",
  components: { draggable },
  props: {
    msg: String,
  },
  data() {
    return {
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
    startDrag: (evt, item) => {
      console.log(item);
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("text", JSON.stringify(item));
    },
    onDrop(evt, word) {
      console.log(evt.dataTransfer.getData("text"));
      const newEl = JSON.parse(evt.dataTransfer.getData("text"));
      console.log(newEl);
      this.list2 = this.list2.map((mot) => {
        if (mot.id == word.id) {
          mot.reponse = newEl;
        }
        return mot;
      });
      if (newEl.id == word.id) {
        this.reponses.push(newEl);
      }
      console.log(word);
      //const itemID = evt.dataTransfer.getData("itemID");
      //const item = this.items.find((item) => item.id == itemID);
      //item.list = list;
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
    elevesWords() {
      return this.list2.map((word) => {
        return { id: "r-" + word.id, word: word.word, liaison: word.liaison };
      });
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
</style>
