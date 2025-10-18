import Axios from "axios";
import { useRouter } from "vue-router"
export default function () {
  const token = document.cookie.replace( /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1' );
  const router = useRouter()

  Axios.defaults.headers.common.Authorization = token
  Axios.post( `${ process.env.VUE_APP_API }/api/user/check` )
    .then( function ( response ) { if ( !response.data.success ) router.push( { path: '/login' } ) } )
    .catch( function ( error ) { if ( error.response.status > 400 ) router.push( { path: '/login' } ) } )
}