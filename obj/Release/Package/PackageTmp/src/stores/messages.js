import { defineStore } from "pinia"
import { reactive } from "vue"
export default defineStore(
  'messages',
  () => {
    const messages = reactive([])

    function pushMessage (type, title, content = '') {
      messages.push({ type, title, content })
      setTimeout(
        function () {
          messages.pop()
        },
        4000
      )
    }
    return { messages, pushMessage }
  }
)