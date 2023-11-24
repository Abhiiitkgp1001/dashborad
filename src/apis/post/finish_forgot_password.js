import { base_url } from '../../config';
import { api_post } from '../wrapper/wrapper_post';
export const finish_forgot_password = async (data) =>{
    const url = base_url+'auth/reset_password';
    const response = await api_post(url, data);
    return response;
}