import { defineStore } from "pinia"
import { ref } from "vue"

export default defineStore(
  'loading',
  ()=>({ isLoading: ref(false) })
)