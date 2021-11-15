const types = {
    SETUP_DEVICEINFO: 'SETUP_DEVICEINFO',
};
  
export const deviceInfoActions = {
    setupDeviceInfo: deviceInfo => {
        return {type: types.SETUP_DEVICEINFO, deviceInfo};
    },
};
  
const initialState = {   
    "deviceInfo" :  {
        language : "en",
        deviceBrand : "",
        deviceModel : ""
    }
};
  
export const reducer = (state = initialState, action) => {
    const {type, deviceInfo} = action;  
    switch (type) {
        case types.SETUP_DEVICEINFO:
            console.log('Device Redux : ' + JSON.stringify(deviceInfo));
            return Object.assign({}, state, {
                ...state,
                deviceInfo
            });
        default:
            return state;
    }
};
  