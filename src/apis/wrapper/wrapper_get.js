import axios from 'axios';
import store, { dataAction } from '../../store';
import { headers } from '../../config';
export const api_get = async (url, addAuth = false) => {
    let header = headers;
    if(addAuth){
        header = {...header, "Authorization": store.getState().token };
    }
    try{
        const response = await axios.get(url, {
            headers:header
        }); 
        console.log(response);
        if(response.status === 200 || response.status === 201)
          return response;
    } catch (error){
        console.log(error.response);
        if(error.response === undefined)
            store.dispatch(dataAction.setAlert({type:'error', message: error.message }));
        else if(error.response.status === 500)
            store.dispatch(dataAction.setAlert({type:'error', message: "Something went wrong!" }));
        else
            store.dispatch(dataAction.setAlert({type:'error', message: error.response.data.message }));
    }
}