import { base_url } from '../../config';
import { api_get } from '../wrapper/wrapper_get';
export const get_all_pilots = async () =>{
    const url = base_url+'admin/get_all_pilots';
    const response = await api_get(url, true);

    
    return response;
}