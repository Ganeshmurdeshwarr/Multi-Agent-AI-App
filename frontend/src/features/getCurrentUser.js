import api from "../utils/axios"

export const getCurrentUser = async()=>{
    try {
        const {data} = await api.get("/api/me")
        return data;
    } catch (error) {
        console.error("Error fetching current user:", error);
       
        return null
    }
}