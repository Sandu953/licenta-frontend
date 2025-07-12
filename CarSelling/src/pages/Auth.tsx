import React, {useEffect, useState} from 'react';
import {
    IonContent,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText, IonPage, IonToolbar, IonButtons, IonIcon, IonHeader,
    IonCardContent,
    IonCard,
    IonCheckbox,
    IonRadio,
    IonSpinner,
    IonAccordion,
    IonBackButton,
    IonSelect,
    IonToggle,
    IonTabBar,
    IonTabButton, IonRouterOutlet,
    IonTabs, IonFooter
} from '@ionic/react';
import {loginUser, registerUser} from "../Api";
import {carSportOutline, cashOutline, homeOutline, personOutline, sparklesOutline} from "ionicons/icons";
import './Auth.css';
import {useHistory, useLocation} from "react-router-dom";

const Auth : React.FC = () => {
    const [isLoginButton, setIsLoginButton] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    const [maxWidth, setMaxWidth] = useState("1400px");

    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    function useIsMobile(breakpoint = 550) {
        const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

        useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [breakpoint]);

        return isMobile;
    }

    const isMobile = useIsMobile();

    const location = useLocation();

    useEffect(() => {
        // Listen for dark mode changes dynamically
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        setEmail("");
        setPassword("");
        setUsername("");
        setError("");
    }, [isLoginButton]);

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password);
            localStorage.setItem("userId", response.userId);
            localStorage.setItem("token", response.accessToken);
            localStorage.setItem("userName", response.username);
            localStorage.setItem("profilePicturePath", response.profilePicturePath);
            window.location.href = "/dashboard";
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    const handleRegister = async () => {
        try {
            if(email === "" || password === "" || (!isLoginButton && username === "")) {
                setError("Please fill in all fields.");
                return;
            }
            const response = await registerUser(email, password, username || email.split('@')[0]);
            //alert("Registration successful! You can now log in.");
            localStorage.setItem("userId", response.userId);
            localStorage.setItem("token", response.accessToken);
            localStorage.setItem("userName", response.username);
            localStorage.setItem("profilePicturePath", response.profilePicturePath);
            window.location.href = "/dashboard";
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Registration failed. Try again.");
            }
        }
    };

    const updateMaxWidth = () => {
        if (window.innerWidth > 1800) {
            setMaxWidth("1600px");
        } else if (window.innerWidth > 1400) {
            setMaxWidth("1400px");
        } else if (window.innerWidth > 1200) {
            setMaxWidth("1200px");
        } else {
            setMaxWidth("100%");
        }
    };

    useEffect(() => {
        updateMaxWidth();
        window.addEventListener("resize", updateMaxWidth);
        return () => window.removeEventListener("resize", updateMaxWidth);
    }, []);

    return (
        <IonPage>
            {!isMobile && (
                <IonHeader style={{ paddingTop : "1.5px" }}>
                    <IonToolbar style={{ maxWidth, margin: "0 auto", "--background": isDarkMode ? "#121212" : "#fff" }}>
                        <IonButtons slot="start">
                            <IonButton routerLink="/" fill="clear" style={{"--color-hover": "#4ad493"}}>
                                {/*<IonTitle>LOGO</IonTitle>*/}
                                <img src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
                            </IonButton>
                        </IonButtons>
                        <IonButtons slot="primary" style={{ display: "flex", gap: "15px" }}>
                            <IonButton routerLink="/car-favorites" style={{"--color-hover": "#4ad493"}}>
                                Parked
                            </IonButton>
                            <IonButton routerLink="/car-recommendations" style={{"--color-hover": "#4ad493"}}>
                                Recommendations
                            </IonButton>
                            <IonButton routerLink="/sell-car" style={{"--color-hover": "#4ad493"}}>
                                Sell a Car
                            </IonButton>
                            <IonButton routerLink="/auth" style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px"}}>
                                <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
            )}

            <IonContent  fullscreen>
                <div style={{ maxWidth, margin: "0 auto", padding: "10px"}}>
                    <IonGrid className={ isDarkMode ? "auth-grid-dark" : "auth-grid-light"}>
                        <IonRow>
                            <IonCol sizeMd="6" className="auth-box">
                                <IonCard className="auth-card" style={{"--background": isDarkMode ? "#1f1f1f" : "#fff"}}>
                                    <IonCardContent >
                                        <IonText className="auth-title">{isLoginButton ? 'LOGIN' : 'REGISTER'}</IonText>

                                        <IonButton expand="full" color="dark" className="social-button">{isLoginButton ? 'Login' : 'Register'} Google</IonButton>
                                        <IonButton expand="full" color="dark" className="social-button">{isLoginButton ? 'Login' : 'Register'} Facebook</IonButton>

                                        <div className="divider-horizontal"></div>

                                        <IonInput
                                            label="EMAIL"
                                            labelPlacement="floating"
                                            type="email"
                                            value={email}
                                            onIonChange={(e) => setEmail(e.detail.value!)}
                                            style={{"--highlight-color-focused": "#4ad493"}}/>
                                        <IonInput
                                            label="PASSWORD"
                                            labelPlacement="floating"
                                            type="password"
                                            value={password}
                                            onIonChange={(e) => setPassword(e.detail.value!)}
                                            style={{"--highlight-color-focused": "#4ad493"}} />

                                        {!isLoginButton && (
                                            <IonInput
                                                label="USERNAME"
                                                labelPlacement="floating"
                                                type="text"
                                                value={username}
                                                onIonChange={(e) => setUsername(e.detail.value!)}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        )}

                                        <IonButton
                                            expand="full"
                                            color="dark"
                                            className="submit-button"
                                            onClick={isLoginButton ? handleLogin : handleRegister}>
                                            {isLoginButton ? 'LOGIN' : 'REGISTER'}
                                        </IonButton>
                                        {error && (
                                            <IonText color="danger"  style={{ marginTop: "10px", display: "block", textAlign: "center" }}>
                                                {error}
                                            </IonText>
                                        )}
                                        <IonText className="toggle-text">
                                            {isLoginButton ? "Don't have an account?" : "Already have an account?"}
                                        </IonText>

                                        <IonButton expand="full" fill="clear" className="toggle-button" style = {{ color: "#4ad493"}} onClick={() => setIsLoginButton(!isLoginButton)}>
                                            {isLoginButton ? 'Register NOW' : 'Login'}
                                        </IonButton>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol sizeMd="6" className="info-box-normal">
                                <div className="divider-vertical"></div>
                                <IonCard className="info-card" style={{"--background": isDarkMode ? "#1f1f1f" : "#fff", padding : "24px"}}>
                                    <IonCardContent>
                                        <IonText className="info-title" style={{
                                            fontSize: "1.8rem",
                                            fontWeight: 600,
                                            marginBottom: "16px",
                                            display: "block",
                                            textAlign: "center",
                                            color: "#4ad493"
                                        }}>
                                           Why join our car auctions?
                                        </IonText>
                                        <ul style={{ fontSize: "1.2rem", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
                                            <li style={{ marginBottom: "12px" }}>Parked vehicles available everywhere</li>
                                            <li style={{ marginBottom: "12px" }}>Personalized car recommendations</li>
                                            <li style={{ marginBottom: "12px" }}>Always get the latest deals</li>
                                        </ul>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>

            {isMobile && (
                <IonFooter className="ion-hide-md-up">
                    <IonToolbar
                        style={{
                            '--background': 'var(--ion-background-color)',
                            paddingBottom: 'env(safe-area-inset-bottom)',
                        }}
                    >
                        <IonButtons
                            slot="start"
                            style={{
                                width: '100%',
                                justifyContent: 'space-around',
                            }}
                        >
                            {[
                                { href: '/home', icon: homeOutline, label: 'Home' },
                                { href: '/car-favorites', icon: carSportOutline, label: 'Parked' },
                                { href: '/car-recommendations', icon: sparklesOutline, label: 'AI' },
                                { href: '/sell-car', icon: cashOutline, label: 'Sell' },
                                { href: '/auth', icon: personOutline, label: 'Account' },
                            ].map(({ href, icon, label }) => {
                                const isActive = location.pathname === href;
                                return (
                                    <IonButton
                                        key={href}
                                        fill="clear"
                                        routerLink={href}
                                        style={{
                                            minWidth: '50px',
                                            color: isActive ? '#4ad493' : 'var(--ion-color-medium)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <IonIcon icon={icon} />
                                            <span
                                                style={{
                                                    fontSize: '0.7rem',
                                                    marginTop: '2px',
                                                    lineHeight: 1,
                                                    color: 'inherit',
                                                }}
                                            >
                                            {label}
                                            </span>
                                        </div>
                                    </IonButton>
                                );
                            })}
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );
};

export default Auth;
