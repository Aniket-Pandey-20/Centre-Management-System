export const LoginStart=(userCredential)=>{
    return({
        type:"LOGIN_START",
    })
}

export const LoginSuccess=(user)=>{
    return({
        type:"LOGIN_SUCCESS",
        payload:user,
    })
}

export const LoginFailure=()=>{
    return({
        type:"LOGIN_FAILURE",
    })
}

export const Logout=()=>{
    return({
        type:"LOGOUT",
    })
}

export const RefreshAccessToken=(user)=>{
    return({
        type:"REFRESH_ACCESS_TOKEN",
        payload:user,
    })
}