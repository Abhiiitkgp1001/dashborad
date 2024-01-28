import { base_url } from '../../config';
import store from '../../store';
import { api_get } from '../wrapper/wrapper_get';
export const get_profile = async () =>{
    console.log(store.getState().user_id);
    const url = base_url+`auth/get_profile/${store.getState().user_id}`;
    const response = await api_get(url, true);

    
    return response;
}