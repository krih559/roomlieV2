import { useState } from "react";
import { useLoginMutation } from "../state/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../state/authSlice";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login, {isLoading, isError}] = useLoginMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent) =>  {
        e.preventDefault();
        try{
            const result = await login({email, password}).unwrap();
            dispatch(setCredentials({user: result.user, token: result.token}));
            navigate('/')
        }catch(error){
            console.error("Sikertelen bejelentkezés: ", error)
        }
    }


    return (
        <div style={{ 
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            borderRadius: '8px'
         }}>
            <h2 style={{
                color: 'var(--text)',
                marginTop: 0
            }}>Bejelentkezés</h2>
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: 'var(--text-h)'
                    }}>E-mail</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
                </div>
                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: 'var(--text-h)'
                    }}>Jelszó</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" />
                </div>

                {isError && 
                    <p style={{color:'#ff4444', margin: 0}}>Hibás e-mail vagy jelszó</p>
                }
                <button className="panel-btn btn-add" type="submit" disabled={isLoading} style={{marginTop: '10px'}}>
                    Bejelentkezés
                </button>
            </form>
        </div>
    )
}