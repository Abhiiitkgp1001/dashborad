import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const send_data = async (data) =>{
    const url = base_url+'data/session_bms_data';
    const response = await api_post(url, data);

    
    return response;
}