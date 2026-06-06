import type { RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../state/authSlice";
import { Link } from "react-router-dom";

interface NavbarProps {
    theme: string;
    toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
    const dispatch = useDispatch();
    const {user, token } = useSelector((state: RootState) => state.auth);

    const hanldeLogout = () => {
        dispatch(logout());
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 20px',
            backgroundColor: 'var(--social-bg)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div>
                <strong style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>Roomlie</strong>
            </div>

            <div style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
            }}>
                <Link to="/" style={{
                    textDecoration: 'none',
                    color: 'var(--text-h)'
                }}>Terem</Link>

                {!token && (
                    <>
                        <Link to="/login" style={{
                            textDecoration: 'none',
                            color: 'var(--text-h)'
                        }}>Bejelentkezés</Link>
                        <Link to="/register" style={{
                            textDecoration: 'none',
                            color: 'var(--text-h)'
                        }}>Regisztráció</Link>    
                    </>
                )}

                {token && user && (
                    <>
                        {user.role === 'admin' && (
                            <Link to="/admin/bookings" style={{
                                textDecoration: 'none',
                                color: 'var(--text-h)'
                            }}>Beérkezett foglalások</Link>
                        )}
                        {user.role === 'user' && (
                            <Link to="/my-bookings" style={{
                                textDecoration: 'none',
                                color: 'var(--text-h)'
                            }}>Foglalásaim</Link>
                        )}

                        <span style={{color: 'var(--text)', marginLeft: '10px'}}>
                            Üdv, <strong>{user.name}</strong> {user.role === 'admin' ? '(Admin)' : ''}
                        </span>

                        <button onClick={hanldeLogout} className="panel-btn" style={{
                            marginLeft: '10px',
                            padding: '5px 10px'
                        }}>
                            Kijelentkezés
                        </button>
                    </>
                )}
            <button 
                onClick={toggleTheme} 
                style={{
                    background: 'transparent', border: '1px solid var(--border)', 
                    color: 'var(--text)', padding: '5px 10px', borderRadius: '6px', 
                    cursor: 'pointer', marginLeft: '10px'
                }}
            >
                {theme === 'light' ? 'Sötét' : 'Világos'}
            </button>
            </div>
        </nav>

    )

}