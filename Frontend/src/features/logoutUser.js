import api from "../../utils/axios.js"

export const logoutUser = async () => {
     try {
        const { data } = api.get("/auth/logout");
        console.log(data); 
    } catch (error) {
         console.log(error);
    }
}

export default logoutUser