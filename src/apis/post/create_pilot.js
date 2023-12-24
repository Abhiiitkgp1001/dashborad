import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const create_pilot = async (data) =>{
    const url = base_url+'admin/create_pilot';
    const response = await api_post(url, data,true);

    
    return response;
}