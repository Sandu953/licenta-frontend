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
    IonCard
} from '@ionic/react';
import {loginUser, registerUser} from "../Api";
import {personOutline} from "ionicons/icons";
import './Auth.css';

const Auth : React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [maxWidth, setMaxWidth] = useState("1400px");

    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    useEffect(() => {
        // Listen for dark mode changes dynamically
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password);
            alert(`Login successful!`);
            localStorage.setItem("token", response.token); // Save token for authentication
        } catch (error) {
            setError("Invalid email or password.");
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
            <IonHeader style={{ paddingTop : "1.5px" }}>
                <IonToolbar style={{ maxWidth, margin: "0 auto", "--background": isDarkMode ? "#121212" : "#fff" }}>
                    <IonButtons slot="start">
                        <IonButton routerLink="/" fill="clear" style={{"--color-hover": "#4ad493"}}>
                            {/*<IonTitle>LOGO</IonTitle>*/}
                            <img src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="primary" style={{ display: "flex", gap: "15px" }}>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Parked
                        </IonButton>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Car Advisor
                        </IonButton>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Sell a Car
                        </IonButton>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Auctions
                        </IonButton>
                        <IonButton routerLink="/auth" style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px"}}>
                            <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>


            <IonContent >
                <div style={{ maxWidth, margin: "0 auto", padding: "10px"}}>
                    <IonGrid className={ isDarkMode ? "auth-grid-dark" : "auth-grid-light"}>
                        <IonRow>
                            <IonCol sizeMd="6" className="auth-box">
                                <IonCard className="auth-card" style={{"--background": isDarkMode ? "#1f1f1f" : "#fff"}}>
                                    <IonCardContent >
                                        <IonText className="auth-title">{isLogin ? 'LOGIN' : 'REGISTER'}</IonText>

                                        <IonButton expand="full" color="dark" className="social-button">{isLogin ? 'Login' : 'Register'} Google</IonButton>
                                        <IonButton expand="full" color="dark" className="social-button">{isLogin ? 'Login' : 'Register'} Facebook</IonButton>

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

                                        <IonButton
                                            expand="full"
                                            color="dark"
                                            className="submit-button"
                                            onClick={handleLogin}>
                                            {isLogin ? 'LOGIN' : 'REGISTER'}
                                        </IonButton>

                                        <IonText className="toggle-text">
                                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                                        </IonText>

                                        <IonButton expand="full" fill="clear" className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
                                            {isLogin ? 'Register NOW' : 'Login'}
                                        </IonButton>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol sizeMd="6" className="info-box-normal">
                                <div className="divider-vertical"></div>
                                <IonCard className="info-card" style={{"--background": isDarkMode ? "#1f1f1f" : "#fff"}}>
                                    <IonCardContent>
                                        <IonText className="info-title">Advantages for login/ register</IonText>
                                        <ul>
                                            <li>Parked vehicles available everywhere</li>
                                            <li>Save searches</li>
                                            <li>Always get the latest deals</li>
                                        </ul>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Auth;
