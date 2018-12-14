const { MVVM } = require('./src/mvvm');
var vm = new MVVM({
  el: '#vue-app',
  data: {
    word: 'Hello World!'
  },
  methods: {
    sayHi: function() {
      this.word = 'Hi, everybody!';
    }
  }
});