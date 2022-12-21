import axios from '../axios';  // importing axios

import {
  PAYMENT_FAIL,


  PAYMENT_REQUEST,
  PAYMENT_SUCCESS,
} from '../constants/paymentConstants'; // fetchning data from paymnent constants

export const payAmount = (cardNo, amount) => async (dispatch, getState) => {   // payment code


  try {
    dispatch({ type: PAYMENT_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {


      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,  // Bearer token is used in the postman
      },
    };


    const { data } = await axios.post(

      `/api/cards/${cardNo}/pay`,  // api for card payments
      { amount },
      config
    );

    dispatch({ type: PAYMENT_SUCCESS, payload: data });
  } catch (err) {
    dispatch({

      type: PAYMENT_FAIL,
      payload:
        err.response && err.response.data.message

          ? err.response.data.message
          : err.message,
          
    });
  }
};
