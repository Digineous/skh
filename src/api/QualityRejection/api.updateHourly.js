import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUpdateHourly = async (updateHourly) => {
  //console.log(updateHourly);
    const url = baseUrl + `/hourly/updateRejectNo/${updateHourly.id}`;
    try {
      const token=localStorage.getItem("token")
 
      const data = await axios.put(url, 
        {
          "id":updateHourly.id,
          "machineId":updateHourly.machineId,
          "rejectionNo":updateHourly.rejectionNoHourly,
         
      }
        ,{headers:{
          Authorization:`Bearer ${token}`
      }});
      return data;
    } catch (error) {
      console.error("Error during adding plant:", error);
      throw error;
    }
  };