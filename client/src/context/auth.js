import React , { useReducer ,  createContext } from 'react'
import jwtDecode from 'jwt-decode'

const initalState = {
    user: null
}

if(localStorage.getItem("jwtToken")){
    const decodeToken = jwtDecode(localStorage.getItem("jwtToken"))

    if(decodeToken.exp * 1000 < Date.now()){
        localStorage.removeItem("jwtToken")
    }else{
        initalState.user = decodeToken
    }
}

const AuthContext = createContext({
    user:null,
    login:(data) => {},
    logout: () => {}
})

const authReducer = (state , action) => {
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default:
            return state
    }
}

const AuthProvider = (props) =>{
    const [state , dispatch] = useReducer(authReducer , initalState)

    const login = (userData) =>{
        localStorage.setItem("jwtToken" , userData.token)
        dispatch({
            type:'LOGIN',
            payload: userData
        })
    }

    const logout = () =>{
        localStorage.removeItem("jwtToken")
        dispatch({
            type:'LOGOUT'
        })
    }

    return (
        <AuthContext.Provider
            value = {{ user : state.user , login , logout }}
            {...props}
            />
    )
}

export { AuthContext , AuthProvider }