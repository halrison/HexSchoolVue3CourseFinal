// JavaScript source code
export default {
  data(){
    return {
      messages: []
    }
  },
  methods: {
    pushMessage(type, title, content=''){
      this.messages?.push({ type, title, content })
      setTimeout(
        () => {
          this.messages?.pop()
        },
        4000
      )
    }
  }
}