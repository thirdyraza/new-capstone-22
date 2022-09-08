import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

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
            const response = await fetch('http://localhost:2301/api/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idnum,
                    pass,
                }),
                withCredentials: true
            })
            
            const data = await response.json()
            if(data.status === 'success'){
                if(data.user){
                    const roles = response?.data?.roles
                    console.log('fetch from mongodb success')
                    setAuth({ idnum, pass, roles })
                    setIdnum('')
                    setPass('')
                    navigate(from, { replace:true })
                }
            } else {
                console.log('error connecting to mongodb')
            }
            
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
                        <input type="submit" value="SIGN IN" />
                    </form>
                </section>
    );
}
 
export default Login;