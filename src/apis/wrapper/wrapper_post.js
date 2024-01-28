import axios from 'axios';
import { headers } from '../../config';
import store, { dataAction } from '../../store';
export const api_post = async (url, data, addAuth=false) => {
    let header = headers;
    if(addAuth){
        header = {...header, "Authorization": `Bearer ${store.getState().token}` };
    }
    console.log(header);
    try{
        const response = await axios.post(url, data, {
            headers: header
        }); 
        if(response.status === 200 || response.status === 201 || response.status === 204)
          return response;
    } catch (error){
        if(error.response === undefined)
            store.dispatch(dataAction.setAlert({type:'error', message: error.message }));
        else if(error.response.status === 500)
            store.dispatch(dataAction.setAlert({type:'error', message: "Something went wrong!" }));
        else
            store.dispatch(dataAction.setAlert({type:'error', message:error.response.data.message }));
        console.log(error);
    }
    
}

