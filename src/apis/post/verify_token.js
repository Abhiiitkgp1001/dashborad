import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const verify_token = async (data) =>{
    const url = base_url+'auth/verify_token';
    console.log(data);
    const response = await api_post(url,data,true);
    return response;
}