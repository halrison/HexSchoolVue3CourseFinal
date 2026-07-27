import useMessageStore from "@/stores/messages"
import axios from "axios"
const messageStore=useMessageStore()
export const http = axios.create({baseURL:import.meta.env.VITE_API})
export const currency = num => {
  const n = parseInt( num, 10 );
  return `${ n.toFixed( 0 ).replace( /./g, ( c, i, a ) => ( i && c !== '.' && ( ( a.length - i ) % 3 === 0 ) ? `, ${ c }`.replace( /\s/g, '' ) : c ) ) }`;
}
export const transDate = date => {
  const localDate = new Date( date )
  return localDate.toISOString().slice( 0, 10 )
  }
export function addImage ( tempUrl, callback ) {
  const image = new Image()
  image.src = tempUrl
  image.onload = function () {
    callback()
    messageStore.pushMessage({ type: 'success', title: '上傳圖片成功', content: `已上傳至${ image.src }` } )
  }
  image.onerror = function () {
    messageStore.pushMessage({ type: 'warning', title: '上傳圖片失敗', content: '此網址並非圖片' } )
  }
}
export function uploadImage ( file, callback ) {
  const form = new FormData
  if ( file ) {
    form.append( 'image', file )
    axios.post(
      `${ import.meta.env.VITE_API }/api/${ import.meta.env.VITE_PATH }/admin/upload`,
      form
    ).then( function ( response ) {
      if ( response.data.success ) {
        callback()
      } else if ( typeof response.data.message === 'string' ) {
        messageStore.pushMessage( { type: 'warning', title: '上傳圖片失敗', content: response.data.message } )
      } else {
        response.data.message.forEach( function ( msg ) {
          messageStore.pushMessage( { type: 'warning', title: '上傳圖片失敗', content: msg } )
        } )
      }
    } ).catch( function ( error ) {
      messageStore.pushMessage({ type: 'danger', title: '上傳圖片失敗', content: error?.response?.data?.message } )
    } )
  } else {
    messageStore.pushMessage( { type: 'danger', title: '上傳圖片失敗', content: '未上傳圖片' } )
  }
  file = {}
}

