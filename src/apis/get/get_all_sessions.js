import { api_get } from '../wrapper/wrapper_get';
import { base_url } from '../../config';
export const get_all_session = async () =>{
    const url = base_url+'data/get_all_sessions';
    const response = await api_get(url);

    
    return response;
}