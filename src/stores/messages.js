// JavaScript source code
export default {
  data(){
    return {
      messages: []
    }
  },
  methods: {
    pushMessage(message){
      this.messages?.push(message)
      setTimeout(
        () => {
          this.messages?.pop()
        },
        4000
      )
    }
  }
}