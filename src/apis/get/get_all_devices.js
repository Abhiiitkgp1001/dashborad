import axios from 'axios';
import { base_url } from '../../config';
import { api_get } from '../wrapper/wrapper_get';
export const get_all_devices = async () =>{
    const url = base_url+'data/get_all_devices';
    const response = await api_get(url);

    
    return response;
}