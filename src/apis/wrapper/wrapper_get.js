import axios from 'axios';
export const api_get = async (url) => {
    try{
        const response = await axios.get(url); 
    } catch (error){
        console.log(error);
    }
    
}