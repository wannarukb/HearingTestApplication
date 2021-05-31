import React from "react";
import {StatusBar,SafeAreaView } from "react-native";
import Navigation from "./navigation";
import { connect } from "react-redux";


class Router extends React.PureComponent {
  
    render() {
        return (
            <>
                <StatusBar  barStyle='dark-content' />
                <SafeAreaView style={{ backgroundColor: '#fff',flex:1}}>
                    <Navigation />
                </SafeAreaView>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: {},
        network: state.network,
        testToneList: {}
    };
};

export default connect(mapStateToProps)(Router);
