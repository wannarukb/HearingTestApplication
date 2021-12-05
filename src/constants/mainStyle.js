import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get("screen");
import themeColor from "../constants/Theme";

const styles = StyleSheet.create({
    viewSection :{
        width: '100%',
        alignItems: 'center',
        height: '75%',
       
    },
    homeContainer: {
        position: "relative",
        padding: 10,
        marginHorizontal: 5,
        marginTop: 25,
        zIndex: 2,
    },
    contentContainer : {
        flex: 1,
        paddingVertical: 20,
        position: 'relative',
        marginBottom: 20,
    },
    row: {
        flex: 1, 
        flexDirection: 'row'
    },
    container: {
        // marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
        // marginBottom: -HeaderHeight * 2,
        flex: 1
    },
    buttonSection : {
        flex: 1, 
        bottom: '10%',
        position: "absolute",
        paddingHorizontal: 15,
        zIndex: 0
    },
    primaryButton:{
        width: '100%',
        marginVertical: 3,
        borderRadius: 0,
        backgroundColor: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
        elevation: 0,
    },
    primaryButtonText:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.WHITE
    },
    secondaryButton:{
        width: '100%',
        marginVertical: 3,
        borderRadius: 0,
        backgroundColor: themeColor.COLORS.LIGHT_SECONDARY,
        elevation: 0,
    },
    secondaryButtonText:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.PRIMARY_BTN_SUCCESS
    },
    tridaryButton:{
        width: '100%',
        marginVertical: 3,
        borderRadius: 0,
        backgroundColor: themeColor.COLORS.WHITE,
        elevation: 0,
    },
    tridaryButtonText:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.DEFAULT
    },
    
    logo: {
        width: '100%',
        height: 60,
        position: 'relative',
        marginTop: '0%',
        marginHorizontal : 'auto'
    },
    titleBlock:{
        marginTop:'5%'
    },
    pageHeader : {
        fontSize: 24,
        fontFamily: 'Sarabun-Bold',
        color: themeColor.COLORS.PRIMARY,
    },
    title: {
        fontFamily:'Sarabun-Bold',
        fontSize: 26,
        color: themeColor.COLORS.PRIMARY,
        textAlign : 'center'
    },
    subTitle: {
        fontFamily:'Sarabun-SemiBold',
        fontSize: 20,
        color: themeColor.COLORS.PRIMARY,
        textAlign : 'center'
    },
    subTitleDesc: {
        fontFamily:'Sarabun',
        fontSize: 16,
        color: themeColor.COLORS.PRIMARY,
        textAlign : 'center'
    },
    formLabel:{
        fontFamily:'Sarabun-SemiBold',
        fontSize: 16,
        color: themeColor.COLORS.PRIMARY,
    },

    formRequireLabel:{
        fontFamily:'Sarabun-SemiBold',
        fontSize: 16,
        color: themeColor.COLORS.REQUIRED
    },

    inputType:{
        borderColor: themeColor.COLORS.INPUT,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: themeColor.COLORS.WHITE,
        // marginTop: 5
        width: '100%',
        fontFamily:'Sarabun',
        fontSize: 18,
        color: themeColor.COLORS.PRIMARY,
    },

    loadingBox :{
        width : width,
        height: height,
        backgroundColor : 'rgba(255,255,255, 0.35)',
        justifyContent : 'center',
        position: "absolute",
        top: '0%',
        zIndex: 10
    }
});

export default {
    styles
}