import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const remove_assigned_pilot = async (data) =>{
    const url = base_url+'admin/remove_asigned_pilot';
    const response = await api_post(url, data,true);

    
    return response;
}