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
        uniqueId:"",
        systemName:"",
        systemVersion:"",
        isTablet:false,
        brand:"",
        model:"",
        deviceType:"",
        language:""
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
  