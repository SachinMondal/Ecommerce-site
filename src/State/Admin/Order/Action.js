
import { API_BASE_URL, api } from "../../../config/apiConfig";
import { CONFIRMED_ORDER_FAILURE, CONFIRMED_ORDER_REQUEST, CONFIRMED_ORDER_SUCCESS, DELETE_ORDER_FAILURE, DELETE_ORDER_REQUEST, DELETE_ORDER_SUCCESS, DELIVERED_ORDER_FAILURE, DELIVERED_ORDER_REQUEST, DELIVERED_ORDER_SUCCESS, GET_ORDERS_FAILURE, GET_ORDERS_REQUEST, GET_ORDERS_SUCCESS, SHIP_ORDER_FAILURE, SHIP_ORDER_REQUEST, SHIP_ORDER_SUCCESS } from "./ActionType";

export const getOrders = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ORDERS_REQUEST });
        try {
            const response = await api.get(`${API_BASE_URL}/api/admin/orders/`);
            dispatch({ type: GET_ORDERS_SUCCESS, payload: response.data })
        } catch (error) {
            dispatch({ type: GET_ORDERS_FAILURE, payload: error.message });
        }
    }
}
export const confirmOrder = (orderId) => async (dispatch) => {
    dispatch({ type: CONFIRMED_ORDER_REQUEST });
    try {
        const response = await api.put(`${API_BASE_URL}/api/admin/orders/${orderId}/confirmed`);
        const data = response.data;

        dispatch({ type: CONFIRMED_ORDER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CONFIRMED_ORDER_FAILURE, payload: error.message })
    }
}
export const shipOrder = (orderId) => {
    return async (dispatch) => {
        try {
            dispatch({ type: SHIP_ORDER_REQUEST });
            const { data } = await api.put(`${API_BASE_URL}/api/admin/orders/${orderId}/ship`);

            dispatch({ type: SHIP_ORDER_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: SHIP_ORDER_FAILURE, payload: error.message })
        }
    }
}

export const deliverOrder = (orderId) => async (dispatch) => {
    dispatch({ type: DELIVERED_ORDER_REQUEST });
    try {
        const response = await api.put(`${API_BASE_URL}/api/admin/orders/${orderId}/deliver`);
        const data = response.data;

        dispatch({ type: DELIVERED_ORDER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: DELIVERED_ORDER_FAILURE, payload: error.message })
    }
}
// export const cancelOrder = (orderId) => async (dispatch)=>{
//     dispatch({ type: CANCELED_ORDER_REQUEST });
//     try {
//         const response = await api.post(`/api/admin/orders/${orderId}/cancel`);
//         const data = response.data;
//         console.log("confirm order:", data);
//         dispatch({ type: CONFIRMED_ORDER_SUCCESS, payload: data });
//     } catch (error) {
//         dispatch({ type: CONFIRMED_ORDER_FAILURE, payload: error.message })
//     }
// }

export const deleteOrder = (orderId) => {
    return async (dispatch) => {
        try {
            dispatch({ type: DELETE_ORDER_REQUEST });
            await api.delete(`${API_BASE_URL}/api/admin/orders/${orderId}/delete`);


            dispatch({ type: DELETE_ORDER_SUCCESS, payload: orderId });
        } catch (error) {
            dispatch({ type: DELETE_ORDER_FAILURE, payload: error.message })
        }
    }
}