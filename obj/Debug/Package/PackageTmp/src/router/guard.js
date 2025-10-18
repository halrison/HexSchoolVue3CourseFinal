import { http } from "../util"
import { useRouter } from "vue-router"
export default function(){
  const token=sessionStorage.getItem('token')
  const router=useRouter()

  http.defaults.headers.common.Authorization=token
  http.post('/api/user/check')
    .then(function(response){
      if(!response.data.success) router.push({ path: '/login' })
    })
}