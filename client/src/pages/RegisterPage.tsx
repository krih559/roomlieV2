import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../state/api";

export function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const [register, {isLoading, isError}] = useRegisterMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
            await register({name, email, password}).unwrap()
            navigate('/login')
        } catch(error){
            console.error("Sikertelen regisztráció: ", error)
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
            }}>Regisztráció</h2>
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
                    }}>Név</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />
                </div>
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
                    Regisztráció
                </button>
            </form>
        </div>
    )
}
