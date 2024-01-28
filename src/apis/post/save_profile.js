import { base_url } from '../../config';
import store from '../../store';
import { api_patch } from '../wrapper/wrapper_patch';
export const save_profile = async (data) =>{
    const url = base_url+`auth/update_profile/${store.getState().user_id}`;
    const response = await api_patch(url, data,true);

    
    return response;
}