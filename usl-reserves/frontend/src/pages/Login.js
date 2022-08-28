import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios'
const LOGIN_URL = '/auth'

const Login = () => {
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"
    
    const [idnum, setIdnum] = useState('');
    const [pass, setPass] = useState('');    
    const [errMsg, setErrMsg] = useState('');
    

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() =>{
        setErrMsg('');
    }, [idnum, pass])

    const loginUser = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({idnum, pass}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data))
            
            const accessToken = response?.data?.accessToken
            const roles = response?.data?.roles

            setAuth({ idnum, pass, roles, accessToken})
            setIdnum('')
            setPass('')
            navigate(from, { replace:true })
        } catch(err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={loginUser}>
                        <label htmlFor="idnum">ID Number:</label>
                        <input
                            type="text"
                            id="idnum"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setIdnum(e.target.value)}
                            value={idnum}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="pass"
                            onChange={(e) => setPass(e.target.value)}
                            value={pass}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                </section>
    );
}
 
export default Login;