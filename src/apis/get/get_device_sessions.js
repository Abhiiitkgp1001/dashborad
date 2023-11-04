import axios from 'axios';
import { base_url } from '../../config';
export const get_device_sessions = async (id) =>{
    const url = base_url+`data/get_device_all_sessions/${id}`;
    const response = await axios.get(url);

    
    return response;
}