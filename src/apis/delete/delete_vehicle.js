import { base_url } from '../../config';
import { api_delete } from '../wrapper/wrapper_delete';
export const delete_vehicle = async (_id) =>{
    const url = base_url+'admin//delete_vehicle/'+_id;
    const response = await api_delete(url, true);

    
    return response;
}