import axios from 'axios';
import {tgcrm} from '../../../utils/const'
export const newForgetPassword = async (email) => {
    try {
        const apiUrl = `${tgcrm}api/forgot-password?email=${email}`;
        
        const response = await axios.post(apiUrl);
        
        if (response.status == 200 || response.status == 201) {
            if(response.data.error){
                console.log('Error:', response.data.error);
                return {error: true, message: response.data.error};
            }else{
                return {success: true, message: "Reset password link sent"};
            }
        } else {
            return {success: false, message: "No Account found"};
        }
    } catch (error) {
        console.error('Error occurred while sending forgot password request:', error.message);
        throw error
    }
};