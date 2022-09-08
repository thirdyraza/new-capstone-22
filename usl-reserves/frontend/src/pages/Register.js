import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const USER_REGEX = /^[0-9]{5,7}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [idnum, setIdnum] = useState('');
    const [validId, setValidId] = useState(false);
    const [idFocus, setIdFocus] = useState(false);

    const [role, setRole] = useState('');

    const [pass, setPass] = useState('');
    const [validPass, setValidPass] = useState(false);
    const [passFocus, setPassFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidId(USER_REGEX.test(idnum));
    }, [idnum])

    useEffect(() => {
        setValidPass(PWD_REGEX.test(pass));
        setValidMatch(pass === matchPwd);
    }, [pass, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [idnum, pass, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(idnum);
        const v2 = PWD_REGEX.test(pass);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await fetch('http://localhost:2301/api/register', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                    body: JSON.stringify({
                    idnum,
                    pass,
                    role,
                }),
            })
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
            if(response){
                setSuccess(true);
                setIdnum('');
                setPass('');
                setMatchPwd('');
            }
            else{
                console.log('error connection with mongodb')
            }
            //clear state and controlled inputs
            
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validId ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validId || !idnum ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setIdnum(e.target.value)}
                            value={idnum}
                            required
                            aria-invalid={validId ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setIdFocus(true)}
                            onBlur={() => setIdFocus(false)}
                        />
                        <p id="uidnote" className={idFocus && idnum && !validId ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        
                        {/* start for roles = trial input */}
                        <label htmlFor="role">
                            Role:
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setRole(e.target.value)}
                            value={role}
                            required
                        />
                        {/* end for roles = trial input */}


                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPass ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPass || !pass ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPass(e.target.value)}
                            value={pass}
                            required
                            aria-invalid={validPass ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPassFocus(true)}
                            onBlur={() => setPassFocus(false)}
                        />
                        <p id="pwdnote" className={passFocus && !validPass ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button disabled={!validId || !validPass || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            <Link to="/">Sign In</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register
