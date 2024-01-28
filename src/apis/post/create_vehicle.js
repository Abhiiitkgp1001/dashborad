import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const add_vehicle = async (data) =>{
    const url = base_url+'admin/add_vehicle';
    const response = await api_post(url, data,true);

    
    return response;
}