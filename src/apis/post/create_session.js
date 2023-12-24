import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const create_session = async (data) =>{
    const url = base_url+'data/create_session';
    const response = await api_post(url, data);

    
    return response;
}