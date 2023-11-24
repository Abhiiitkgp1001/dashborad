import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const initiate_signup = async (data) =>{
    const url = base_url+'auth/signup-initiate';
    const response = await api_post(url, data);
    return response;
}