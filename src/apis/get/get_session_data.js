import { api_get } from '../wrapper/wrapper_get';
import { base_url } from '../../config';
export const get_session_data = async (id) =>{
    const url = base_url+`data/get_session_data/?sessionId=${id}`;
    const response = await api_get(url);
    
    
    return response;
}