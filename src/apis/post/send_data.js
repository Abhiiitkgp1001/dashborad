import axios from 'axios';
import { base_url } from '../../config';
export const send_data = async (data) =>{
    const url = base_url+'data/session_bms_data';
    const response = await axios.post(url, data);

    
    return response;
}