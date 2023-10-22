import axios from 'axios';
import { base_url } from '../../config';
export const create_session = async (data) =>{
    const url = base_url+'data/create_session';
    const response = await axios.post(url, data);

    
    return response;
}