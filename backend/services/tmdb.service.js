import axios from "axios";
import { ENV_VARIABLES } from "../config/envVariables.js";



export const fetchFromTMDB = async (url)=>{

    const options = {
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + ENV_VARIABLES.TMDB_API_KEY
        }
    };
    
    const response = await axios.get(url, options)
    if(response.status!=200){
        throw new Error('Failed to fetch Data from TMDB ' + response.statusText)
    }
    return response.data;
}