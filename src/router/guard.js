import Axios from "axios";
import {useRouter} from "vue-router"
export default async function () {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const router = useRouter()
    Axios.defaults.headers.common.Authorization = token
    try {
        const response = await Axios.post(`${import.meta.env.VITE_API}/api/user/check`)
        if (!response.data.success) router.push({path: '/login'})
    }
    catch (error) {if (error.response?.status > 400) router.push({path: '/login'})}
}