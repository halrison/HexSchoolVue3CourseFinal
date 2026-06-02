import mitt from "mitt"
import axios from "axios"
export const currency = num => {
  const n = parseInt( num, 10 );
  return `${ n.toFixed( 0 ).replace( /./g, ( c, i, a ) => ( i && c !== '.' && ( ( a.length - i ) % 3 === 0 ) ? `, ${ c }`.replace( /\s/g, '' ) : c ) ) }`;
}

export const transDate = date => {
  const localDate = new Date( date )
  return localDate.toISOString().slice( 0, 10 )
  }
export const emitter = mitt()
export function addImage ( tempUrl, callback ) {
  const image = new Image()
  image.src = tempUrl
  image.onload = function () {
    callback( tempUrl )
    emitter.emit( 'message', { type: 'success', title: '上傳圖片成功', content: `已上傳至${ image.src }` } )
  }
  image.onerror = function () {
    emitter.emit( 'message', { type: 'warning', title: '上傳圖片失敗', content: '此網址並非圖片' } )
  }
}
export function uploadImage ( file, callback ) {
  const form = new FormData
  if ( file ) {
    form.append( 'image', file )
    axios.post(
      `${ process.env.VUE_APP_API }/api/${ process.env.VUE_APP_PATH }/admin/upload`,
      form
    ).then( function ( response ) {
      if ( response.data.success ) {
        callback( response.data.imageUrl )
      } else if ( typeof response.data.message === 'string' ) {
        emitter.emit( 'message', { type: 'warning', title: '上傳圖片失敗', content: response.data.message } )
      } else {
        response.data.message.forEach( function ( msg ) {
          emitter.emit( 'message', { type: 'warning', title: '上傳圖片失敗', content: msg } )
        } )
      }
    } ).catch( function ( error ) {
      emitter.emit( 'message', { type: 'danger', title: '上傳圖片失敗', content: error?.response?.data?.message } )
    } )
  } else {
    emitter.emit( 'message', { type: 'danger', title: '上傳圖片失敗', content: '未上傳圖片' } )
  }
  file = {}
}

