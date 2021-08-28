<template>
  <div>
    <p>
      encadrer les parties du texte souhaitées par des [...text...] pour créer
      un bloc
    </p>
    <div>
      <textarea cols="100" rows="5" v-model="sentence"></textarea>
    </div>
    <div>
      <p>sentences</p>
      <template v-for="(word, i) in reponses">
        <template v-if="word.input">
          <span
            class="sentence"
            :key="i"
            draggable
            @dragstart="startDrag($event, word)"
            ><b>{{ word.text }}</b></span
          >
          <template v-if="i < reponses.length - 1">
            <span>-</span>
          </template>
        </template>
      </template>
    </div>
    <hr />
    <template v-for="(part, index) in sentenceParts">
      <template v-if="part.input">
        <template v-if="part.guess != ''">
          <span
            :class="{
              correct: partIsCorrect(part),
              wrong: !partIsCorrect(part),
            }"
            >{{ part.guess }}</span
          >
        </template>
        <template v-else>
          <span
            :key="index"
            @dragover.prevent
            @dragenter="over = true"
            @dragleave="over = false"
            @drop="onDrop($event, part)"
          >
            _______________
          </span>
        </template>
      </template>
      <template v-else>
        <span>{{ part.text }}</span>
      </template>
    </template>
    <p v-if="allCorrect">All done!</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sentence:
        "The replace() [method] replaces a [specified] value with another value in a string:",
      sentenceParts: [],
    };
  },
  computed: {
    allCorrect() {
      return this.sentenceParts.every(this.partIsCorrect);
    },
    reponses() {
      return this.sentenceParts.filter((part) => part.input == true);
    },
  },
  methods: {
    startDrag: (evt, item) => {
      console.log(item);
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("text", JSON.stringify(item));
    },
    onDrop(evt, part) {
      this.over = false;
      console.log(evt.dataTransfer.getData("text"));
      const newEl = JSON.parse(evt.dataTransfer.getData("text"));
      console.log(newEl);
      console.log(part);
      this.sentenceParts.forEach((p) => {
        if (part.id === p.id) {
          part.input = true;
          part.guess = newEl.text;
        }
      });
    },
    partIsCorrect(part) {
      return !part.input || part.text === part.guess;
    },

    reset() {
      const re = /(\[[^\]]*\])/;

      // The filter removes empty strings
      const parts = this.sentence.split(re).filter((text) => text);

      this.sentenceParts = parts.map((segment, i) => {
        const isInput = re.test(segment);

        return {
          id: i + 1,
          guess: "",
          input: isInput,
          text: isInput ? segment.slice(1, -1) : segment,
        };
      });
    },
  },

  watch: {
    sentence: {
      immediate: true,
      handler: "reset",
    },
  },
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
.sentence {
  margin: 4px;
}
</style>
