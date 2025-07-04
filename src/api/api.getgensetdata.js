// import axios from "axios";
// import { baseUrl } from "./baseUrl";

// export const apiGetGensetData = async (locationId,dataType) => {
//   const url =`${baseUrl}/common/getGensetData/${locationId}/${dataType}`;
//   try {
//     const token = localStorage.getItem("token");

//     const data = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };


import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetGensetData = async (locationId, dataType, deviceNo) => {
  const url = `${baseUrl}/common/gensetDetails`;
  try {
    const token = localStorage.getItem("token");
    //console.log("loc id,datatype ,deviceno:",locationId,dataType,deviceNo)
    const body = {
      locationId: locationId,
      intervalCode: dataType,
      deviceNo: deviceNo,
    };
    //console.log(body)
    const data = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
