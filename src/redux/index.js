/** @format */

import {persistCombineReducers} from 'redux-persist';
import {reducer as UserRedux} from './UserRedux';
import {reducer as TestToneRedux} from './TestToneRedux'; 
import {reducer as TestToneResultRedux} from './TestToneResultRedux';
import {reducer as DeviceRedux} from './DeviceRedux';
import {reducer as network} from 'react-native-offline';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['network'],
};

export default persistCombineReducers(persistConfig, {
    user: UserRedux,
    network: network,
    testToneList : TestToneRedux,
    testToneResultTemp: TestToneResultRedux,
    deviceInfo : DeviceRedux
});
