import axios from "axios"
import { ref } from "vue"
import useMessageStore from "@/stores/messages"
import pinia from "./stores"

const { pushMessage } = useMessageStore(pinia)
const currency = num => {
  const n = parseInt(num, 10);
  return `${n.toFixed(0).replace(/./g, (c, i, a) => (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c))}`;
}
function addImage (tempUrl, callback) {
  const image = new Image()

  image.src = tempUrl
  image.onload = function () {
    callback(tempUrl)
    pushMessage('success', '上傳圖片成功')
  }
  image.onerror = function () { 
    pushMessage('danger', '上傳圖片失敗', '此網址並非圖片')
  }
}
function uploadImage (files, callback) {
  const form = new FormData
  const file = ref(files[0])

  if (file.value){
    form.append('image', file.value)
    http.post(
      `/api/${import.meta.env.VITE_PATH}/admin/upload`,
      form
    ).then(function (response) {
      if (response.data.success) {
        callback(response.data.imageUrl)
        pushMessage('success', '上傳圖片成功', `已上傳至${response.data.imageUrl}`)
      } else if (typeof response.data.message === 'string') {
        pushMessage('success', '上傳圖片失敗', response.data.message)
      } else {
        response.data.message.forEach(function (msg) {
          pushMessage('danger', '上傳圖片失敗', msg) 
        })
      }
    }).catch(function (error) {
      pushMessage('danger', '上傳圖片失敗', error)
    })
  } else {
    pushMessage('danger', '未上傳圖片')
  }

  file.value = {}
}
const http = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    'cache-control': 'no-cache'
  }
})
export { currency, http, addImage, uploadImage }