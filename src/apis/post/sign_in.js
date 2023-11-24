import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const sign_in = async (data) =>{
    const url = base_url+'auth/signin';
    const response = await api_post(url,data);
    return response;
}