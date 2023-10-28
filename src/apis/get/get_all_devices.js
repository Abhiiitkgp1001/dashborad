import axios from 'axios';
import { base_url } from '../../config';
export const get_all_devices = async () =>{
    const url = base_url+'data/get_all_devices';
    const response = await axios.get(url);

    
    return response;
}