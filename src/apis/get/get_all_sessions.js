import axios from 'axios';
import { base_url } from '../../config';
export const get_all_session = async () =>{
    const url = base_url+'data/get_all_sessions';
    const response = await axios.get(url);

    
    return response;
}